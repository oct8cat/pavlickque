(function(exports) {
    'use strict';

    var https, rssi, _;

    https = require('https');
    rssi = require('rssi');
    _ = require('underscore');

    /**
     * API URL.
     * @type string
     */
    exports.apiUrl = 'https://api.vk.com';

    /**
     * Method execution URL.
     * @type string
     */
    exports.methodUrl = exports.apiUrl + '/method';

    /**
     * Token acquiring URL.
     * @type string
     */
    exports.tokenUrl = 'https://oauth.vk.com/access_token';

    /**
     * Joins the given parameters into a string.
     * @param {object} params Parameters
     * @param {string} [delim] Parameters delimiter. Defaults to "&".
     * @return {string} Parameters string.
     */
    exports._joinParams = function(params, delim) {
        if (typeof delim === 'undefined') { delim = '&'; }
        var a;
        a = [];
        _.each(_.keys(params), function(k) {
            a.push([k, params[k]].join('='));
        });
        return a.join(delim);
    };

    /**
     * Retrieves access token by the given parameters and the access code.
     * @param {object} params Request parameters. Keys are: client_id, client_secret, redirect_uri.
     * @param {string} code Access code.
     * @param {function} cb Callback.
     */
    exports.getToken = function(params, code, cb) {
        var t, url;
        t = rssi('#{tokenUrl}?client_id=#{client_id}&client_secret=#{client_secret}&code=#{code}&redirect_uri=#{redirect_uri}');
        url = t({
            tokenUrl: exports.tokenUrl,
            client_id: params.client_id,
            client_secret: params.client_secret,
            code: code,
            redirect_uri: params.redirect_uri
        });
        https.get(url, function(r) {
            var body;
            body = '';
            r.on('data', function(d) {
                return body += d;
            }).on('end', function() {
                return cb(null, JSON.parse(body));
            }).on('error', cb);
        });
        return exports;
    };

    /**
     * Executes the given API method.
     * @param {string} token Access token.
     * @param {string} method Method name to be executed.
     * @param {object} params Method arguments.
     * @param {function} cb Callback.
     */
    exports.exec = function(token, method, params, cb) {
        var t, url;
        t = rssi('#{methodUrl}/#{method}?access_token=#{token}&#{params}');
        url = t({
            methodUrl: exports.methodUrl,
            method: method,
            token: token,
            params: exports._joinParams(params)
        });
        https.get(url, function(r) {
            var body;
            body = '';
            r.on('data', function(d) {
                return body += d;
            }).on('end', function() {
                return cb(null, JSON.parse(body));
            }).on('error', cb);
        });
        return exports;
    };

}).call(this, exports);
