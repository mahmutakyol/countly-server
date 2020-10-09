/*global $, jQuery, countlyGlobal, countlyCommon*/
(function(countlyMakyol) {

    //plugin properties
    var _data = {};

    countlyMakyol.initialize = function() {

        var data = {
            "api_key": countlyGlobal.member.api_key,
            "app_id": countlyCommon.ACTIVE_APP_ID,
            "method": "makyol"
        };

        //return promise
        return $.ajax({
            type: "GET",
            url: "/o",
            data: data,
            success: function(json) {
                _data = json;
            }
        });
    };

    //return data that we have
    countlyMakyol.getData = function() {
        return _data;
    };

}(window.countlyMakyol = window.countlyMakyol || {}, jQuery));