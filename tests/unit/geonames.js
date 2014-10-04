/* jslint node: true */
/* global describe, it */
'use strict';

var assert = require('assert');
var argh = require('argh');

describe('Geonames API ', function () {
    //Parse start-up options and set defaults
    var opts = {
        'username': argh.argv.username || process.env.NGN_USERNAME
    };

    var geonames = require('../../index.js')({username: opts.username});

    it('It should be possible to find place "Beringen" with postode 3580 in Belgium', function (done) {
        geonames.postalCodeLookup({postalCode : '3580', countryCode : 'BE', maxRows : 20}, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].placeName, 'Beringen');
            console.log(res);
            done();
        });
    });

    it('It should be possible to find place "Beringen" using gps coordinates', function (done) {
        var options = {
            lat: 51.05,
            lng: 5.21,
            radius: 10,
            maxRows: 5
        };
        geonames.findNearbyPostalCodesByGpsCoordinates(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].postalCode, '3580');
            console.log(res);
            done();
        });
    });

    it('It should be possible to find surrounding postalCodes for "3580" using postalCode and Country', function (done) {
        var options = {
                    postalCode : '3580',
                    countryCode : 'BE',
                    radius : 10,
                    maxRows : 5
                };
        geonames.findNearbyPostalCodesByPostCode(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].postalCode, '3580');
            console.log(res);
            done();
        });
    });

    it('It should be possible to get a list of countries where postalcode service is available', function (done) {
        geonames.postalCodeCountryInfo(function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].countryCode, 'AD');
            console.log(res);
            done();
        });
    });

    it('It should be possible to get the closest big city nearby lat = 51.05, lng = 5.21 (Beringen Belgium)', function (done) {
        var options = {
                lat : 51.05,
                lng : 5.21,
                radius : 100,
                localCountry : true,
                cities : geonames.cities.cities1000,
                maxRows : 5
            };
        geonames.findNearbyPlaceName(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].toponymName, 'Beringen');
            console.log(res);
            done();
        });
    });

    it('TODO : it should be possible to find the closest canal nearby lat = 51.05, lng = 5.23 (Beringen Belgium)', function(done) {
        var options = {
            lat: 51.04954,
            lng: 5.22606,
            radius: 20,
            localCountry: true,
            style: geonames.style.medium,
            maxRows: 20//,
            //featureClass: 'H',
            //featureCode: 'STM'
        };
        geonames.findNearby(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].toponymName, 'Beringen');
            console.log(res);
            done();
        });
    });

    it('it should be possible to find extended information for lat = 51.05, lng = 5.23 (Beringen Belgium)', function(done) {
        var options = {
            lat: 51.04954,
            lng: 5.22606
        };
        geonames.findByLatLongExtended(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[res.length-1].toponymName, 'Beringen');
            console.log(res);
            done();
        });
    });

    it('it should be possible to get the city beringen by geonameId (2802170)', function(done) {
        var options = {
            geonameId : '2802170',
            style: geonames.style.full
        };
        geonames.getFeatureByGeoId(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res.toponymName, 'Beringen');
            console.log(res);
            done();
        });
    });

    it('it should be possible ot get country information for BE (Belgium)', function(done){
        var options = {
            countryCode : 'BE'
        };
        geonames.getCountryInfoByCountryCode(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res[0].countryName, 'Belgium');
            console.log(res);
            done();
        });
    });

    it('it should be possible to get country code for a given lat = 51.05, lng = 5.23 (Beringen Belgium)', function(done){
        var options = {
            lat: 51.04954,
            lng: 5.22606
        };
        geonames.getCountryCodeByLatLong(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res.countryName, 'Belgium');
            console.log(res);
            done();
        });
    });

    it('it should be possible to get the sub-devisions for a given lat = 51.05, lng = 5.23 (Beringen Belgium)', function(done){
        var options = {
            lat: 51.04954,
            lng: 5.22606,
            admLevel : 3
        };
        geonames.getCountrySubdevisionByLatLong(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res.adminCode1, 'VLG');
            console.log(res);
            done();
        });
    });

    it('it should be possible to get the timezone for a given lat = 51.05, lng = 5.23 (Beringen Belgium)', function(done){
        var options = {
            lat: 51.04954,
            lng: 5.22606,
            date : new Date().toISOString
        };
        geonames.getTimeZoneByLatLong(options, function (err, res) {
            assert.equal(err, null);
            assert.equal(res.timezoneId, 'Europe/Brussels');
            console.log(res);
            done();
        });
    });
});