/*global $, jQuery, countlyGlobal, countlyCommon, CountlyHelpers*/

(function(countlyMyMetric) {

    //we will store our data here
    var _data = {};

    //Initializing model
    countlyMyMetric.initialize = function() {

        //returning promise
        return $.ajax({
            type: "GET",
            url: "/o/my-metric",
            data: {
                //providing current user's api key
                "api_key": countlyGlobal.member.api_key,
                //providing current app's id
                "app_id": countlyCommon.ACTIVE_APP_ID,
                //specifying method param
                "method": "mymetric"
            },
            success: function(json) {
                //got our data, let's store it
                _data = json;
            }
        });
    };

    countlyMyMetric.store = function(my_metric, my_metric_count) {
        return $.ajax({
            type: "POST",
            url: "/i/my-metric",
            data: {
                "api_key": countlyGlobal.member.api_key,
                "app_id": countlyCommon.ACTIVE_APP_ID,
                "my_metric": my_metric,
                "my_metric_count": my_metric_count
            },
            success: function(json) {
                return json;
            }
        });
    };

    //return data that we have
    countlyMyMetric.getData = function() {
        return _data;
    };

}(window.countlyMyMetric = window.countlyMyMetric || {}, jQuery));
// CountlyHelpers.createMetricModel(window.countlyMyMetric = window.countlyMyMetric || {}, "mymetric", jQuery);
