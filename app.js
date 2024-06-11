const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/error')
const ErrorHandler = require('./utils/errorHandler.js')
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = YAML.load('./swagger.yaml')
const config = require('./config/configs.js');
const rateLimit = require("express-rate-limit");
const i18n = require('./config/i18nConfig.js')

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
connectDatabase()

/** middlewares */
app.enable("trust proxy")
app.use(express.json());
app.use(i18n.init)
app.use(limiter);
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use('/api/v1/swagger/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
// Middleware to handle Accept-Language header
app.use((req, res, next) => {
    const lang = req.acceptsLanguages(i18n.getLocales());
    if (lang) {
        i18n.setLocale(req, lang);
    }
    next();
});

const authRouter = require('./routers/auth.js')
const refreshToken = require('./routers/refreshToken.js')
const cafeRouter = require('./routers/cafe')
const tableRouter = require('./routers/table')
const commentRouter = require('./routers/comment.js')
const foodCategoryRouter = require('./routers/foodCategory.js')
const foodRouter = require('./routers/food.js')
const adminRouter = require('./routers/admin.js')
const employerRouter = require('./routers/employer.js')
const jobRouter = require('./routers/job.js')
const checkRouter = require('./routers/check.js')

/** api routes */
app.use('/api/v1/cafes', cafeRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/refreshToken', refreshToken)
app.use('/api/v1/tables', tableRouter)
app.use('/api/v1/comments', commentRouter)
app.use('/api/v1/foodCategory', foodCategoryRouter)
app.use('/api/v1/food', foodRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/employer', employerRouter)
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/check', checkRouter)

// handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404))
})

app.use(errorMiddleware)

app.listen(config.PORT, () => {
    console.log(`SERVER: Serverr started on port ${config.PORT} in ${config.NODE_ENV} mode`)
    console.log(`SWAGGER: http://localhost:${config.PORT}/swagger/docs/#/`)
})

//Handling unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1);
    })
})
