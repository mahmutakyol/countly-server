var plugin = {},
    common = require('../../../api/utils/common.js'),
    {validateUserForRead, validateUserForWrite} = require('../../../api/utils/rights.js'),
    plugins = require('../../pluginManager.js'),
    fetch = require('../../../api/parts/data/fetch.js');

(function() {

    //waiting for read request
    plugins.register("/o/my-metric", function(ob) {
        var params = ob.params;

        //if user requested to read our metric
        if (params.qstring.method === "mymetric") {

            //validate user and output data using fetchTimeObj method
            validateUserForRead(params, function() {
                var collectionName = 'mymetric';
                var query = {};
                if (params.qstring.is_active) {
                    query.is_active = params.qstring.is_active;
                }

                if (params.qstring.app_id) {
                    query.app_id = params.qstring.app_id;
                }
                common.db.collection(collectionName).find(query).toArray(function(err, metrics) {
                    if (!err) {
                        common.returnOutput(params, metrics);
                        return true;
                    }
                    else {
                        common.returnMessage(params, 500, err.message);
                        return false;
                    }
                });
            });

            //return true, we responded to this request
            return true;
        }

        //else we are not interested in this request
        return false;
    });

    //handling some custom path
    plugins.register("/i/my-metric", function(ob) {
        //get parameters
        var params = ob.params; //request params
        validateUserForWrite(params, function(params) {
            //create new object
            var data = params.qstring;
            //validate data if needed and write object to db
            common.db.collection('mymetric').insert(data, function(err, app) {
                if (err) {
                    common.returnMessage(params, 200, err);
                }
                else {
                    console.log(app);
                    common.returnMessage(params, 200, "Success");
                }
            });
        });
        //need to return true, so core does not repond that path does not exist
        return true;
    });
}(plugin));

module.exports = plugin;