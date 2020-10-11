var plugin = {},
    common = require('../../../api/utils/common.js'),
    {validateUserForRead} = require('../../../api/utils/rights.js'),
    plugins = require('../../pluginManager.js'),
    fetch = require('../../../api/parts/data/fetch.js');

(function(plugin) {

    //waiting for metrics to be received
    plugins.register("/session/metrics", function(ob) {
        var predefinedMetrics = ob.predefinedMetrics;

        //tell countly to process our metric
        predefinedMetrics.push({
            db: "mymetric", //collection name
            metrics: [{
                    name: "_mymetric", //what to wait for in query string
                    set: "mymetric", // metric mymetric
                    short_code: "mymetric"
                } //optionally can provide short name
            ]
        });
    });

    //waiting for read request
    plugins.register("/o", function(ob) {
        var params = ob.params;

        //if user requested to read our metric
        if (params.qstring.method === "mymetric") {

            //validate user and output data using fetchTimeObj method
            validateUserForRead(params, fetch.fetchTimeObj, 'mymetric');

            //return true, we responded to this request
            return true;
        }

        //else we are not interested in this request
        return false;
    });

    //waiting for app delete event
    plugins.register("/i/apps/delete", function(ob) {
        var appId = ob.appId;

        //delete all app data from our metric collection
        common.db.collection('mymetric').remove({
            '_id': {
                $regex: appId + ".*"
            }
        }, function() {});
    });

    //waiting for app reset event
    plugins.register("/i/apps/reset", function(ob) {
        var appId = ob.appId;

        //delete all app data from our metric collection
        common.db.collection('mymetric').remove({
            '_id': {
                $regex: appId + ".*"
            }
        }, function() {});

    });
}(plugin));

module.exports = plugin;