"use strict";

var request = require('request');
var extend = require('util')._extend;

/*
 geonames library for NodeJs
 see http://www.geonames.org/export/web-services.html for geonames documentation
 */


/**
 * Service to access geonames api
 * @param config
 *  {
 *      username : string //no default
 *      endpoint : string //default 'http://api.geonames.org/'
 *      language : string //default 'en'
 *      country : string //default 'UK'
 *  }
 * @returns {{}}
 */
module.exports = function (config) {
    var geonames = {};
    //init
    geonames._username = config.username || "";
    geonames._endpoint = config.endpoint || 'http://api.geonames.org';
    geonames._language = config.language || 'en';
    geonames._country = config.country || 'UK';
    geonames._charset = config.charset || 'UTF-8';


    /**
     * Reverse geoCode
     * @param options : {lat : float, lng : float, radius : integer, maxRows : integer }
     * returns returns a list of postalcodes and places for the lat/lng query as JSON document.
     * The result is sorted by distance. For Canada the FSA is returned (first 3 characters of full postal code)
     */
    geonames.findNearbyPostalCodesByGpsCoordinates = function (options, callback) {
        var qs = extend({
            maxRows : 5,
            charset : geonames._charset,
            username : geonames._username,
            radius : 10
        },options);
        var url = '/findNearbyPostalCodesJSON';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body.postalCodes || []);
        });
    };

    /**
     * Nearby Postcodes Search
     * @param options : {postalCode, countryCode, radius, maxRows}
     * returns returns a list of postalcodes and places for the lat/lng query as JSON document.
     * The result is sorted by distance. For Canada the FSA is returned (first 3 characters of full postal code)
     */
    geonames.findNearbyPostalCodesByPostCode = function (options, callback) {
        var qs = extend(
            {
                country :  geonames._country,
                maxRows :  5,
                charset : geonames._charset,
                username : geonames._username
            },
            {
                postalcode : options.postalCode,
                country : options.countryCode,
                maxRows : options.maxRows
            });

        var url = '/findNearbyPostalCodesJSON';

        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body.postalCodes || []);
        });
    };

    /**
     * get places by postalcode
     * @Param options : {postalCode : string, countryCode : string, maxRows : integer}
     * @param callback
     * returns a list of places for the given postalcode in JSON format, sorted by postalcode, placename
     */
    geonames.postalCodeLookup = function (options, callback) {
        var qs = extend(
            {
                country :  geonames._country,
                maxRows :  20,
                charset : geonames._charset,
                username : geonames._username
            },
            {
                postalcode : options.postalCode,
                country : options.countryCode,
                maxRows : options.maxRows
            });

        var url = '/postalCodeLookupJSON';

        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body.postalcodes || []);
        });
    };

    /**
     * Check countries for which postal code geocoding is available.
     * @param callback
     * return countries for which postal code geocoding is available.
     */
    geonames.postalCodeCountryInfo = function(callback){
        var qs = {
            charset : geonames._charset,
            username : geonames._username
        };
        var url = '/postalCodeCountryInfoJSON';

        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body.geonames || []);
        });
    };

    /**
     * Find the nearest place by lat, lng
     * @param : options {
     *           lat : lattitude
     *           lng : longituted,
     *           radius : radius in km
     *           cities : see below
     *           localCountry : (boolean) stay withing country boundaries
     *           style : (string) on ['SHORT','MEDIUM','LONG','FULL']
     *       }
     *  cities, 'cities1000', 'cities5000','cities15000'
     *   cities1000  : all cities with a population > 1000 or seats of adm div (ca 80.000)
     *   cities5000  : all cities with a population > 5000 or PPLA (ca 40.000)
     *   cities15000 : all cities with a population > 15000 or capitals (ca 20.000)
     * @param callback
     * return  returns the closest populated place (feature class=P) for the lat/lng query as JSON document.
     * The unit of the distance element is 'km'.
     */
    geonames.findNearbyPlaceName = function(options,callback){
        var qs = extend(
            {
                country :  geonames._country,
                maxRows :  20,
                charset : geonames._charset,
                username : geonames._username,
                style : 'FULL'
            },
            {
                lat : options.lat,
                lng : options.lng,
                radius : options.radius,
                cities : options.cities,
                localCountry : options.localCountry,
                style : options.style

            });

        var url = '/findNearbyPlaceNameJSON';

        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body.geonames || []);
        });
    };

    //full feature code list can be found at : http://download.geonames.org/export/dump/featureCodes_en.txt

    return geonames;
};