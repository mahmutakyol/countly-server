var request = require('supertest');
var should = require('should');
var testUtils = require("../../../test/testUtils");
const { describe } = require('mocha');
const { doesNotThrow } = require('should');
//request with url
request = request(testUtils.url);

//data will use in tests
var APP_KEY = "";
var API_KEY_ADMIN = "";
var APP_ID = "";
var DEVICE_ID = "1234567890";


describe('Testing plugin', function() {
    //Simple api test
    describe('should have no data', function() {
        API_KEY_ADMIN = testUtils.get('API_KEY_ADMIN');
        APP_ID = testUtils.get("APP_ID");
        APP_KEY = testUtils.get("APP_KEY");
    });

    // and make request
    request
        .get('/o?api_key=' + API_KEY_ADMIN + '&app_id' + APP_ID)
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            var ob = JSON.parse(res.text);
            ob.should.be.empty;
            done();
        });
});