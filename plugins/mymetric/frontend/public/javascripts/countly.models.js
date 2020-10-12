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
                "my_metric_count": parseInt(my_metric_count),
                "created": new Date().getTime()
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

    countlyMyMetric.getTopThreeMetricValues = function() {
        return _data.sort(function(a, b) {
            if (a < b) { return 1; }
            else if (a == b) { return 0; }
            else { return -1; }
        });
    };

}(window.countlyMyMetric = window.countlyMyMetric || {}, jQuery));
// CountlyHelpers.createMetricModel(window.countlyMyMetric = window.countlyMyMetric || {}, "mymetric", jQuery);
