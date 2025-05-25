const winston = require('winston');
const { createLogger, format, transports} = winston;

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: `logs/${new Date().toISOString().split('T')[0]}.log`,
            level: 'info'
        })
    ]

});

logger.stream = {
    write(message) {
        logger.info(message.trim());
    }
};

module.exports = logger;