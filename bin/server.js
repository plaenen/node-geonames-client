"use strict";

var argh = require('argh');
var os = require('os');

//Console Help
if (argh.argv.help || argh.argv.h) {
    console.log([
        'Usage: ./bin/server.js [--port]',
        'Starts the server with the specified configuration',
        '',
        '--port         port to run on (default: 3000) or as env.NGN_PORT',
        '--username     geomames user name or as or as env.NGN_USERNAME',
        '--googleapikey api key for google, ensure freebase api is enabled'
    ].join(os.EOL));
    process.exit();
}

//Parse start-up options and set defaults
var opts = {
    'port': +(argh.argv.port || process.env.NGN_PORT || '3000'),
    'username': argh.argv.username || process.env.NGN_USERNAME,
    'googleapikey' : argh.argv.googleapikey || process.env.NGN_GOOGLEAPIKEY
};

//Log all options
console.log(Object.keys(opts).map(function (prop) {
    return prop + ': ' + opts[prop];
}).join(os.EOL));


