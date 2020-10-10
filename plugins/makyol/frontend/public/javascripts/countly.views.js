/*global countlyView, T, countlyMakyol, $, app, MakyolView*/
window.MakyolView = countlyView.extend({
    // initialize function
    initalize: function() {
        //some awesome code blocks...
    },

    beforeRender: function() {
        // fetch template
        var self = this;
        return $.when(T.get('/makyol/templates/makyol.html', function(template) {
            self.template = template;
        }), countlyMakyol.initialize()).then(function() {});
    },

    renderCommon: function() {
        this.templateData = {
            "page-title": "Makyol",
            "logo-class": "",
            "data": countlyMakyol.getData()
        };

        $(this.el).html(this.template(this.templateData));
    },

    refresh: function() {
        var self = this;
        $.when(countlyMakyol.initialize()).then(function() {
            if (app.activeView !== self) {
                return false;
            }

            self.renderCommon();
        });
    }
});

//register views
app.makyolView = new MakyolView();

//register routes
app.route('/makyol', 'makyol', function() {
    this.renderWhenReady(this.makyolView);
});

//register menu button
$(document).ready(function() {
    app.addMenu("understand", {
        code: "makyol",
        url: "#/makyol",
        text: "Makyol Metrics",
        icon: '<div class="logo ion-pricetags"></div>',
        priority: 50
    });
});