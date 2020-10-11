/*global countlyView, T, countlyMyMetric, $, app, MyMetricView, jQuery*/
window.MyMetricView = countlyView.extend({
    // initialize function
    initialize: function() {
        //we can initialize stuff here
    },

    beforeRender: function() {
        // fetch template
        var self = this;
        return $.when(T.get('/mymetric/templates/mymetric.html', function(template) {
            self.template = template;
        }), countlyMyMetric.initialize()).then(function() {});
    },

    renderCommon: function() {
        this.templateData = {
            "page-title": jQuery.i18n.map["mymetric.title"],
            "logo-class": "",
            "data": countlyMyMetric.getData()
        };

        $(this.el).html(this.template(this.templateData));
    },

    refresh: function() {
        var self = this;
        $.when(countlyMyMetric.initialize()).then(function() {
            if (app.activeView !== self) {
                return false;
            }

            self.renderCommon();
        });
    }
});

//register views
app.mymetricView = new MyMetricView();

//register routes
app.route('/my-metric', 'mymetric', function() {
    this.renderWhenReady(this.mymetricView);
});

//register menu button
$(document).ready(function() {
    app.addMenu("understand", {
        code: "My Metric",
        url: "#/my-metric",
        text: "My Metric",
        icon: '<div class="logo ion-pricetags"></div>',
        priority: 50
    });
});