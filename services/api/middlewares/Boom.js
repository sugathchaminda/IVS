/**
 * Inspired by express-boom
 */
const boom = require('@hapi/boom');

const helperMethods = ['wrap', 'create'];

module.exports = () => (req, res, next) => {
    if (res.boom) throw new Error('boom already exists on response object');

    res.boom = {};

    Object.getOwnPropertyNames(boom).forEach(key => {
        if (typeof boom[key] !== 'function') return;

        if (helperMethods.indexOf(key) !== -1) {
            res.boom[key] = function () {
                return boom[key](...boom, ...arguments); // eslint-disable-line
            };
        } else {
            res.boom[key] = function () {
                const boomed = boom[key](...boom, ...arguments); // eslint-disable-line

                // eslint-disable-next-line
                const boomedPayloadAndAdditionalResponse = Object.assign(boomed.output.payload, arguments[1]);

                return res.status(boomed.output.statusCode).send(boomedPayloadAndAdditionalResponse);
            };
        }
    });

    next();
};
