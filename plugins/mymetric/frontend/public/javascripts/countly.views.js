/*global countlyView, T, countlyCommon, countlyMyMetric, CountlyHelpers, $, app, MyMetricView, jQuery*/
window.MyMetricView = countlyView.extend({
    //initalize out model
    beforeRender: function() {
        return $.when(countlyMyMetric.initialize()).then(function() {});
    },

    //render our data
    renderCommon: function(isRefresh) {
        var data = countlyMyMetric.getData();

        //prepare template data
        this.templateData = {
            "page-title": jQuery.i18n.map["mymetric.title"],
            "logo-class": "",
            "graph-type-double-pie": true,
            "pie-titles": {
                "left": jQuery.i18n.map["common.total-users"],
                "right": jQuery.i18n.map["common.new-users"]
            }
        };

        //if loading first time and not refershing
        if (!isRefresh) {

            //build template with data
            $(this.el).html(this.template(this.templateData));

            //create datatable with chart data
            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                //provide data to datatables
                "aaData": data.chartData,

                //specify which columns to show
                "aoColumns": [
                    { "mData": "mymetric", sType: "session-duration", "sTitle": jQuery.i18n.map["mymetric.title"] },
                    { "mData": "t", sType: "formatted-num", "mRender": function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.table.total-sessions"] }
                ]
            }));

            //make table headers sticky
            $(".d-table").stickyTableHeaders();

            //draw chart with total data
            countlyCommon.drawGraph(data.chartDPTotal, "#dashboard-graph", "pie");

            //draw chart with new data
            countlyCommon.drawGraph(data.chartDPNew, "#dashboard-graph2", "pie");
        }
    },

    //refreshing out chart
    refresh: function() {
        var self = this;
        $.when(countlyMyMetric.refresh()).then(function() {

            //populate and regenerate template data
            self.renderCommon(true);

            //replace existing elements in view with new data
            var newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el).find(".dashboard-summary").replaceWith(newPage.find(".dashboard-summary"));

            var data = countlyMyMetric.getData();

            //refresh charts
            countlyCommon.drawGraph(data.chartDPTotal, "#dashboard-graph", "pie");
            countlyCommon.drawGraph(data.chartDPNew, "#dashboard-graph2", "pie");

            //refresh datatables
            CountlyHelpers.refreshTable(self.dtable, data.chartData);
        });
    }
});

//register views
app.mymetricView = new MyMetricView();

//register routes
app.route('/mymetric', 'mymetric', function() {
    this.renderWhenReady(this.mymetricView);
});

//register menu button
$(document).ready(function() {
    app.addMenu("understand", {
        code: "My Metric",
        url: "#/mymetric",
        text: "My Metric",
        icon: '<div class="logo ion-pricetags"></div>',
        priority: 50
    });
});

app.addPageScript("/analytics/sessions", function() {
    //You can perform any dom manipulations here
    alert("You are viewing Sessions Analytics");
});

app.addPageScript("#", function() {
    //You can perform any dom manipulations here
    console.log("new page view loaded");
});

// All pages which URL starts with '/users/' and follows some string, for example: 
// /users/c49ebdad8f39519af9e0bfbf79332f4ec50b6d0f
app.addPageScript("/users/#", function() {
    console.log("new user profile view loaded");
});

app.addRefreshScript("/analytics/sessions", function() {
    //You can perform any dom manipulations here
    console.log("sessions view refreshed");
});