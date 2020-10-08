var pluginManager = require('../pluginManager.js'),
    async = require('async'),
    fs = require('fs'),
    path = require('path');

console.log('Installing Plugin');

console.log('Creating needed directories');
var dir = path.resolve(__dirname, '');
fs.mkdir(dir + '/../../frontend/express/public/folder', function() {});

console.log('Modifying database');
var countlyDb = pluginManager.dbConnection('countly');

countlyDb.collection('apps').find({}).toArray(function(err, apps) {
    if (!apps || err) {
        console.log('No apps to upgrade');
        countlyDb.close();
        return;
    }

    function upgrade(app, done) {
        console.log('Adding indexes to ' + app.name);
        countlyDb.collection('app_users' + app._id).ensureIndex({
            'name': 1
        }, done);
    }

    async.forEach(apps, upgrade, function() {
        console.log('Plugin installation finished');
        countlyDb.close();
    });
});