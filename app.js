const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/error')
const ErrorHandler = require('./utils/errorHandler.js')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')
const config = require('./config.js');
const rateLimit = require("express-rate-limit");

process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down the server due to unhandled promise rejection')
    process.exit(1)
})

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs 
});

//connecting to database
connectDatabase(config.DB_URI)

/** middlewares */
app.use(express.json());
app.use(limiter);
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

const authRouter = require('./routers/auth.js')
const refreshToken = require('./routers/refreshToken.js')
const cafeRouter = require('./routers/cafe')
const tableRouter = require('./routers/table')

/** api routes */
app.use('/api/v1/cafes', cafeRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/refreshToken', refreshToken)
app.use('/api/v1/tables', tableRouter)

// handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404))
})

app.use(errorMiddleware)

app.listen(config.PORT, () => {
    console.log(`SERVER: Server started on port ${config.PORT} in ${config.NODE_ENV} mode`)
    console.log(`SWAGGER: http://localhost:${config.PORT}/swagger/#/`)
})

//Handling unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1);
    })
})
