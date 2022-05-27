"use strict";
/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */
/**
Acoustic MCE InApp Cordova Plugin
*/
var MCEInAppPlugin;
(function (MCEInAppPlugin) {
    cordova.exec(null, null, "MCEInAppPlugin", "initialize", []);
    var error = function (message) { return console.log(message); };
    /**
  Allows Cordova InApp Plugin to delete an existing InAppMessage
  @param {integer} inAppMessageId id of message to be deleted.
  */
    MCEInAppPlugin.deleteInAppMessage = function (inAppMessageId) {
        cordova.exec(null, error, "MCEInAppPlugin", "deleteInAppMessage", [
            inAppMessageId,
        ]);
    };
    /**
  Allows Cordova InApp Plugin to look for and possibly execute the next InApp message.
  @param {Array.<string>} rules A list of rules to be matched against.
  */
    MCEInAppPlugin.executeInAppRule = function (rules) {
        cordova.exec(null, error, "MCEInAppPlugin", "executeInAppRule", [
            rules,
        ]);
    };
    /**
  Allows Cordova InApp Plugin to register a template handler.
  @param {InAppTemplateCallback} callback The callback that handles the response
  @param {string} templateName A template name that this handler displays
  */
    MCEInAppPlugin.registerInAppTemplate = function (callback, templateName) {
        MCEPlugin.pauseResumeCallback(function () {
            cordova.exec(callback, error, "MCEInAppPlugin", "registerInAppTemplate", [templateName, false]);
        }, function () {
            cordova.exec(callback, error, "MCEInAppPlugin", "registerInAppTemplate", [templateName, true]);
        });
    };
    /**
  Allows Cordova InApp Plugin to initiate a sync with the server.
  */
    MCEInAppPlugin.syncInAppMessages = function (callback) {
        cordova.exec(callback, error, "MCEInAppPlugin", "syncInAppMessages", []);
    };
    /**
  Allows Cordova InApp Plugin to call out to action registry to handle rich message actions.
  @param {string} action is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
  */
    MCEInAppPlugin.executeInAppAction = function (action) {
        cordova.exec(null, error, "MCEInAppPlugin", "executeInAppAction", [
            action,
        ]);
    };
    MCEInAppPlugin.processColor = function (colorString, defaultColor) {
        if (colorString != undefined) {
            if (typeof colorString == "string") {
                if (colorString.substr(0, 2) == "0x") {
                    return "#" + colorString.substr(2, 6);
                }
                else if (colorString.substr(0, 1) != "#") {
                    return "#" + colorString;
                }
                else {
                    return colorString;
                }
            }
            else if (colorString["red"] != undefined &&
                colorString["green"] != undefined &&
                colorString["blue"] != undefined) {
                var red = parseFloat(colorString["red"]) * 255;
                var green = parseFloat(colorString["green"]) * 255;
                var blue = parseFloat(colorString["blue"]) * 255;
                return "RGBA(" + red + "," + green + "," + blue + ",1)";
            }
        }
        return defaultColor;
    };
    /**
     * Adds an InAppMessage to the database, this is largely for testing purposes.
     * @param {StringObject} InApp Message Dictionary
     */
    MCEInAppPlugin.addInAppMessage = function (inAppMessage) {
        cordova.exec(null, error, "MCEInAppPlugin", "addInAppMessage", [
            inAppMessage,
        ]);
    };
})(MCEInAppPlugin || (MCEInAppPlugin = {}));
module.exports = MCEInAppPlugin;
