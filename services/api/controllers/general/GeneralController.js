const responseHelper = require('../../helpers/responseHelper');
const Router = require('../../core/Router');
const responseMessages = require('../../constants/response');

class GeneralController extends Router {
    get routes() {
        return [
            ['GET', '/echo', 'getUserInfo'],
        ];
    }

    /**
     *
     * @param {*} req
     * @param {*} res
     */
    async getUserInfo(req, res) {
        const { CODES: { SUCCESS } } = responseMessages;

        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            console.log(req.get('user-agent'), req.body, req.params, req.query);
            const userAgent = req.get('user-agent');

            return responseHelper.response(res, 200, { data: { ipAddress, userAgent } }, true, SUCCESS, null);
        } catch (error) {
            responseHelper.error(res, error);
        }
    }
}

module.exports = GeneralController;
