/*global $, jQuery, countlyGlobal, countlyCommon*/
(function(countlyMakyol) {

    //plugin properties
    var _data = {};

    countlyMakyol.initialize = function() {

        return $.ajax({
            type: "GET",
            url: "/o",
            data: {
                //providing current user's api key
                "api_key": countlyGlobal.member.api_key,
                //providing current app's id
                "app_id": countlyCommon.ACTIVE_APP_ID,
                //specifying method param
                "method": "makyol"
            },
            success: function(json) {
                //got our data, let's store it
                _data = json;
            }
        });
    };

    //return data that we have
    countlyMakyol.getData = function() {
        return _data;
    };

    countlyMakyol.store = function() {
        // Store data
    };

}(window.countlyMakyol = window.countlyMakyol || {}, jQuery));