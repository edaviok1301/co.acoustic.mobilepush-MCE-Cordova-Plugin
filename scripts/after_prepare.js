#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

function fileExists(path) {
    try {
        return fs.statSync(path).isFile();
    } catch (e) {
        return false;
    }
}

function directoryExists(path) {
    try {
        return fs.statSync(path).isDirectory();
    } catch (e) {
        return false;
    }
}

module.exports = function(context) {
    var ANDROID_DIR = 'platforms/android';
    var platforms = context.opts.platforms;
    console.log("platforms: " + platforms)
    if (platforms.indexOf('android') !== -1 && directoryExists(ANDROID_DIR)) {
        var source_filename = "google-services.json";
        if (fileExists(source_filename)) {
            try {
                console.log("Copy from " + source_filename + " to " + ANDROID_DIR + "/app/" + source_filename);
                fs.copyFileSync(source_filename, ANDROID_DIR + "/app/" + source_filename);
                /*
                var json = JSON.parse(fs.readFileSync(source_filename).toString());
                var strings_filename = ANDROID_DIR + '/res/values/strings.xml';
                if(!fileExists(strings_filename)) {
                    strings_filename = ANDROID_DIR + '/app/src/main/res/values/strings.xml';
                }
                if(!fileExists(strings_filename)) {
                    console.log("Can't find strings.xml!");
                    return
                }
                var strings = fs.readFileSync(strings_filename).toString();
                strings = strings.replace(new RegExp('<string name="google_app_id">([^<]+?)</string>', 'i'), '');
                strings = strings.replace(new RegExp('<string name="google_api_key">([^<]+?)</string>', 'i'), '');
                strings = strings.replace(new RegExp('<resources>', 'i'), '<resources><string name="google_api_key">' + json.client[0].api_key[0].current_key + '</string><string name="google_app_id">' + json.client[0].client_info.mobilesdk_app_id + '</string>')
                fs.writeFileSync(strings_filename, strings);
                */
            } catch (error) {
                console.log("Error: " + error);
            }
        } else {
            console.log("Can't find file " + source_filename)
        }
    }
};