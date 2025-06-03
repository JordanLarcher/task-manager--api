require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");
const winston = require("./util/logger");
const cookieSession = require('cookie-session');

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const passport = require('passport');
const authRoutes = require("./routes/authRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const mainRoutes = require("./routes/index");
require("./config/passport"); // Passport configuration

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: winston.stream }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.urlencoded());
// Parses incoming JSON request and puts the parsed data in req.body
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger docs served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api', mainRoutes);

app.use(errorHandler);
// Connect to MongoDB
(async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      winston.info(`Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    winston.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();
