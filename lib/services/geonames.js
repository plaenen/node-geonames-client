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


    /**
     * Reverse geoCode
     * @param lat
     * @param long
     * @param radius
     * @param maxRows
     * returns returns a list of postalcodes and places for the lat/lng query as JSON document.
     * The result is sorted by distance. For Canada the FSA is returned (first 3 characters of full postal code)
     */
    geonames.findNearbyPostalCodesByGpsCoordinates = function (lat, lng, radius, maxRows, callback) {
        var qs = {
            lat : lat,
            lng : lng,
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
     * Nearby Postcodes Search
     * @param postalCode
     * @param countryCode
     * @param radius
     * @param maxRows
     * returns returns a list of postalcodes and places for the lat/lng query as JSON document.
     * The result is sorted by distance. For Canada the FSA is returned (first 3 characters of full postal code)
     */
    geonames.findNearbyPostalCodesByPostCode = function (postalCode, countryCode, radius, maxRows, callback) {
        var qs = {
            postalcode : postalCode,
            country : countryCode,
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
     * @param lat latitude
     * @param lng longitude
     * @param radius in km
     * @param localCountry, true stick within country boundaries
     * @param cities, 'cities1000', 'cities5000','cities15000'
     *   cities1000  : all cities with a population > 1000 or seats of adm div (ca 80.000)
     *   cities5000  : all cities with a population > 5000 or PPLA (ca 40.000)
     *   cities15000 : all cities with a population > 15000 or capitals (ca 20.000)
     * @param callback
     * return  returns the closest populated place (feature class=P) for the lat/lng query as JSON document.
     * The unit of the distance element is 'km'.
     */
    geonames.findNearbyPlaceName = function(lat,lng, radius,localCountry,cities,callback){
        var qs = {
            lat : lat,
            lng : lng,
            radius : radius,
            style : 'FULL',
            localCountry : localCountry,
            cities : cities,
            charset : geonames._charset,
            username : geonames._username
        };
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