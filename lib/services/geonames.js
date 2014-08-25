"use strict";

var request = require('request');

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




    //export functions
    /**
     * Reverse geoCode
     * @param lat
     * @param long
     * @param radius
     * @param maxRows
     * returns returns a list of postalcodes and places for the lat/lng query as xml document.
     * The result is sorted by distance. For Canada the FSA is returned (first 3 characters of full postal code)
     */
    geonames.findNearbyPostalCodes = function (lat, long, radius, maxRows, callback) {
        var qs = {
            lat : lat,
            lng : long,
            radius : radius,
            maxRows : maxRows || 5,
            charset : geonames._charset,
            username : geonames._username
        };
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
     * @param postalCode
     * @param country
     * @param maxRows
     * @param callback
     * returns a list of places for the given postalcode in JSON format, sorted by postalcode, placename
     */
    geonames.postalCodeLookup = function (postalCode, country, maxRows, callback) {
        var qs = {
            postalcode : postalCode,
            country : country || geonames._country,
            maxRows : maxRows || 20,
            charset : geonames._charset,
            username : geonames._username
        };
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

    return geonames;
};