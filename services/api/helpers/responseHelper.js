/**
 * Response Helper
 */
const bunyan = require('bunyan');
const config = require('config');

const logger = bunyan.createLogger({
    name: 'general-controller',
    streams: [{ path: config.logs.controller }],
});

const ResponseHelper = {
    /**
     * @param {object} res Express response
     * @param {string} code Http status code. 200, 400, etc
     * @param {boolean} status true|false
     * @param {string} message Message stdout
     */
    response: (res, code, data, status, message = '') => {
        res.status(code).json({
            code,
            status,
            message,
            ...data,
        });
    },

    /**
     * @param {object} res Express response
     * @param {object} error Exception passed by express
     */
    error: (res, error) => {
        console.log('error', error);
        logger.error(error);

        res.status(400).json({
            statusCode: 400,
            message: error.message ? error.message : 'Something went wrong!',
        });
    },
};

module.exports = ResponseHelper;
