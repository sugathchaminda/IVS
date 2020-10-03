const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');
const responseHelper = require('./helpers/responseHelper');
const expressBoom = require('./middlewares/Boom');
// const Routes = require('./routes');

// create express app
const app = express();

app.use(cors({ origin: config.cors_urls }));
app.use(expressBoom());

// inform that we are going to use body-parser
// urlencoded - this type of body will be convert
// extended - which need to allow rich data or simple data
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            // console.error(err);
            return responseHelper.response(res, 400, [], true, 'Invalid Json');
        }

        next();
    });
});
// body-parser use to convert http post data to json
app.use(bodyParser.json());

app.get('/echo', (req, res) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(req.get('user-agent'), req.body, req.params, req.query, ipAddress);
    const userAgent = req.get('user-agent');

    return responseHelper.response(res, 200, { data: { ipAddress, userAgent } }, true, 'success', null);
});

// Routes(app);

// catch 404 and forwarding to error handler
app.use((req, res, next) => {
    res.boom.notFound();
    next();
});

// catch errors
app.use((error, req, res, next) => {
    if (error.isBoom) {
        const errorMessage = error.data.shift();
        res.boom.badData(errorMessage.message);
    } else {
        res.status(500).json({
            status: {
                message: 'Internal server error, Please contact Support.',
                code: 500,
            },
        });
        if (req.log) {
            req.log.error(error);
        } else {
            // console.log(error);
        }
        res.end();
    }
});

// create server
const server = app.listen(config.port, () => {
    console.log(`**** Server listing to port: ${config.port} ****`);
});

module.exports = server;
