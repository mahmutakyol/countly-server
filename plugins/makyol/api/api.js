var plugin = {},
    common = require('../../../api/utils/common.js'),
    plugins = require('../../pluginManager.js');

(function(plugin) {

    /*
     * @apiName: GetMakyolMetricsData
     * @apiDescription: Get metrics data
     */
    //waiting for read request
    //waiting for read request
    plugins.register("/o", function(ob) {
        var params = ob.params;

        common.returnOutput(params, { metrics });
    });

    /*
     * @apiName: StoreMakyolMetricsData
     * @apiDescription: Get metrics data
     * @apiParam: 'app_key', Id of app
     * @apiParam: 'device_id', filter by device_id
     * @apiParam: 'makyol_metric', metric title
     * @apiParam: 'makyol_metric_count', metric count
     */
    plugins.register('/i/makyol-metric/:app_key/:device_id/:makyol_metric/:makyol_metric_count', function(ob) {
        var params = ob.params;
        if (params.qstring.user_details) {
            //if it is string, but we expect json, lets parse it
            if (typeof params.qstring.makyol === "string") {
                try {
                    params.qstring.makyol = JSON.parse(params.qstring.makyol);
                }
                catch (SyntaxError) {
                    console.log('Parse JSON failed');
                    //we are not doing anything with request
                    return false;
                }
                //start doing something with request

                //and tell core we are working on it, by returning true
                return true;
            }

            //we did not have data we were interested in
            return false;
        }
    });
}(plugin));

module.exports = plugin;