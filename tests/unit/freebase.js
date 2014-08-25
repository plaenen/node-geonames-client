
/* jslint node: true */
/* global describe, it */
'use strict';

var assert = require('assert');
var argh = require('argh');


describe('Freebase API ', function () {
    //Parse start-up options and set defaults
    var opts = {
        'googleapikey' : argh.argv.googleapikey || process.env.NGN_GOOGLEAPIKEY
    };

    var freebase = require('freebase');


    it('Search for James bond in freebase', function (done) {
        freebase.list(' volcano', {key:opts.googleapikey}, function(result){
            console.log(result);
            done();
        }) //type:"/food/food",
    });
});