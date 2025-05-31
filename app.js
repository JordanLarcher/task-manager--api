require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger");
const winston = require("./util/logger");

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const mainRoutes = require("./routes/index");
const app = express();
const session = require("express-session");
const passport = require('passport');
require("./config/passport"); // Passport configuration

app.use(session( { secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Routes

const authRoutes = require("./routes/authRoutes");
const oauthRoutes = require("./routes/oauthRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
// Middlewares

// Helmet helps us secure the app by setting HTTP headers
app.use(helmet());

// Cors enables cross-origin requests
app.use(cors());

// Parses incoming JSON request and puts the parsed data in req.body
app.use(express.json());

// HTTP request logger using winston stream.
app.use(morgan("combined", { stream: winston.stream }));

// Limits repeated requests to public APIs and/or endpoints.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Swagger docs served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.urlencoded());
app.use("/api", mainRoutes);

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
