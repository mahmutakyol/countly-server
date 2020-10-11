var plugin = {},
    common = require('../../../api/utils/common.js'),
    {validateUserForRead} = require('../../../api/utils/rights.js'),
    plugins = require('../../pluginManager.js'),
    fetch = require('../../../api/parts/data/fetch.js');

(function(plugin) {

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
}(plugin));

module.exports = plugin;