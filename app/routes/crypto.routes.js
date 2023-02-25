const controllerAllCrypto = require('../controllers/crypto.controller');
const { checkJwt } = require('../middlewares');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    app.get('/api/crypto/:fiat/:per_pages', controllerAllCrypto.getAllCrypto);
    app.get('/api/cryptos', controllerAllCrypto.getAllCrypto);
    app.get('/api/cryptos/favs/:id/:fiat?', [checkJwt.checkToken], controllerAllCrypto.getCyrptosFav);
};