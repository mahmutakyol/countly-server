/*global countlyView, T, countlyMyMetric, countlySession, $, app, MyMetricView*/
window.MyMetricView = countlyView.extend({
    // initialize function
    initialize: function() {
        //we can initialize stuff here
    },

    beforeRender: function() {
        // fetch template
        var self = this;
        return $.when(T.get('/mymetric/templates/mymetric.html', function(src) {
            self.template = src;
        }),
        countlyMyMetric.initialize(), countlySession.initialize()).then(function() {});
    },
    renderCommon: function() {

        //provide template data
        this.templateData = {
            "page-title": "My Metrics",
            "logo-class": "",
            "data": countlyMyMetric.getData()
        };

        //populate template with data and attach it to page's content element
        $(this.el).html(this.template(this.templateData));
    },

    //here we need to refresh data
    refresh: function() {
        var self = this;
        $.when(countlyMyMetric.initialize()).then(function() {
            //our view is not active
            if (app.activeView !== self) {
                return false;
            }
            //here basically we want to do the same we did in renderCommon method
            self.renderCommon();
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