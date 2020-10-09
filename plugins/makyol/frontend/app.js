var plugin = {},
    countlyConfig = require('../../../frontend/express/confg');


(function(plugin) {
    plugin.init = function(app, countlyDb, express) {

        //middleware or process request
        app.get(countlyConfig.path + '/makyol', function(req, res, next) {

            //url parameters
            var parts = req.url.split("/");
            var id = parts[parts.length - 1];

            // read data fro db using countlyDb
            countlyDb.collection('makyol').findOne({
                '_id': id
            }, function(err, plugindata) {

                //if data is null
                if (err || !plugindata) res.send('404: Page Not Found', 404);
                else {

                    //template rendering
                    res.render('../../../plugins/makyol/frontend/public/teplates/default', {
                        path: countlyConfig.path || "",
                        cdn: countlyConfig.cdn || "",
                        data: plugindata
                    });
                }
            });

            next();
        });
    };
}(plugin));

plugin.init = function(/*app, countlyDb*/) {
    //add middleware here
};

module.exports = plugin;