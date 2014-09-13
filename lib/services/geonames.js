"use strict";

var request = require('request');
var extend = require('util')._extend;
var xml2js = require('xml2js');

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

    /**
     * Defines the detail level of the response
     */
    geonames.style = {
        short : 'SHORT',
        medium : 'MEDIUM',
        long : 'LONG',
        full : 'FULL'
    };

    /**
     * Defines the matching range for cities
     *   cities1000  : all cities with a population > 1000 or seats of adm div (ca 80.000)
     *   cities5000  : all cities with a population > 5000 or PPLA (ca 40.000)
     *   cities15000 : all cities with a population > 15000 or capitals (ca 20.000)
     */
    geonames.cities = {
        cities1000 : 'cities1000',
        cities5000 : 'cities5000',
        cities15000 : 'cities15000'
    };

    //init
    geonames._username = config.username || "";
    geonames._endpoint = config.endpoint || 'http://api.geonames.org';
    geonames._language = config.language || 'en';
    geonames._country = config.country || 'UK';
    geonames._charset = config.charset || 'UTF-8';
    geonames._postCodeDefaults = {
        country :  geonames._country,
        maxRows :  5,
        charset : geonames._charset,
        username : geonames._username,
        lang : geonames._language
    };
    geonames._mapPostCodeOptions = function(options){
        return {
            postalcode : options.postalCode,
            country : options.countryCode,
            maxRows : options.maxRows
        };
    };



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
            lang : geonames._language,
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
            geonames._postCodeDefaults,
            geonames._mapPostCodeOptions(options));

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
            geonames._postCodeDefaults,
            geonames._mapPostCodeOptions(options));

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
            username : geonames._username,
            lang : geonames._language
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
     *           cities : geonames.cities
     *           localCountry : (boolean) stay withing country boundaries
     *           style : geonames.style
     *       }
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
                style : geonames.style.long,
                cities : geonames.cities.cities1000,
                lang : geonames._language
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


    /**
     * @param options : {
     *    lat : float
     *    lng : float
     *    featureClass : string
     *    featureCode : string
     *        //full feature code list can be found at : http://download.geonames.org/export/dump/featureCodes_en.txt
     *    radius : int in km
     *    maxRows : int
     *    style : geonames.style
     *    localCountry :  boolean, if true, remain in country borders
     * }
     * @param callback  returns the closest toponym for the lat/lng query as JSON document
     */
    geonames.findNearby = function(options,callback){
        //TODO: test featureCode anf featureClass better, looks like the geonames services is not working correctly
        var qs = extend(
            {
                country :  geonames._country,
                maxRows :  20,
                charset : geonames._charset,
                username : geonames._username,
                style : geonames.style.long,
                cities : geonames.cities.cities1000
            },
            {
                lat : options.lat,
                lng : options.lng,
                radius : options.radius,
                featureClass : options.featureClass,
                featureCode : options.featureCode,
                localCountry : options.localCountry,
                style : options.style,
                maxRows : options.maxRows

            });

        var url = '/findNearbyJSON';
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
     * @param options : {
     *    lat : float
     *    lng : float
     *    style : geonames.style
     * }
     * @param callback returns the most detailed information available for the lat/lng query as xml document
     * It is a combination of several services. Example:
     * In the US it returns the address information.
     * In other countries it returns the hierarchy service: http://api.geonames.org/extendedFindNearby?lat=47.3&lng=9&username=demo
     * On oceans it returns the ocean name.
     */
    geonames.findByLatLongExtended = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username
            },
            {
                lat : options.lat,
                lng : options.lng
            });

        var url = '/extendedFindNearby';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            //Convert xml2js
            xml2js.parseString(body, {trim: true, explicitArray: false}, function (err, result) {
                if (err) {
                    callback(err, null);
                }
                callback(null,result.geonames.geoname || []);
            });
        });
    };

    /**
     * Get  feature by geonameId
     * @param options : {
     *    geonameId : string
     *    style : geonames.style
     * }
     * @param callback returns the attribute of the geoNames feature with the given geonameId as json document
     */
    geonames.getFeatureByGeoId = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username,
                lang : geonames._language
            },
            {
                geonameId : options.geonameId,
                style : options.style
            });

        var url = '/getJSON';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body || []);
        });
    };


    /**
     * Get country information
     * @param options {
     *   countryCode : string
     * }
     * @param callback returns Country information : Capital, Population, Area in square km, Bounding Box of mainland (excluding offshore islands)
     */
    geonames.getCountryInfoByCountryCode = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username
            },
            {
                country : options.countryCode
            });

        var url = '/countryInfoJSON';
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
     * Get country code for a given lat/long
     * @param options {lat : float, long : float}
     * @param callback returns the iso country code for the given latitude/longitude
     */
    geonames.getCountryCodeByLatLong = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username
            },
            {
                lat : options.lat,
                lng : options.lng
            });

        var url = '/countryCodeJSON';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body || []);
        });
    };


    /**
     * Get country subdevision for a given lat/long
     * @param options {lat : float, long : float, admLevel : see http://www.geonames.org/export/subdiv-level.html}
     * @param callback returns the iso country code for the given latitude/longitude
     */
    geonames.getCountrySubdevisionByLatLong = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username,
                adm : 1 //default first admin level
            },
            {
                lat : options.lat,
                lng : options.lng,
                adm : options.admLevel
            });

        var url = '/countrySubdivisionJSON';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body || []);
        });
    };

    /**
     * Get Timezone for a given lat/long
     * @param options {lat : float, long : float, date : string (YYYY-MM-DD)}
     * @param callback
     */
    geonames.getTimeZoneByLatLong = function(options,callback){
        var qs = extend(
            {
                charset : geonames._charset,
                username : geonames._username,
                date : new Date().toISOString

            },
            {
                lat : options.lat,
                lng : options.lng,
                date : options.date
            });

        var url = '/timezoneJSON';
        request({
            qs : qs,
            url : geonames._endpoint + url,
            json : true

        }, function(error, response, body){
            if (error) {
                callback(error, null);
            }
            callback(null,body || []);
        });
    };


    return geonames;
};