"use strict";
/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */
/**
Acoustic MCE Inbox Cordova Plugin
*/
var MCEInboxPlugin;
(function (MCEInboxPlugin) {
    cordova.exec(null, null, "MCEInboxPlugin", "initialize", []);
    /**
    Allow Cordova Inbox Plugin to respond to changes in the inbox list.
    @param {InboxListCallback} callback The callback that handles the response
    */
    MCEInboxPlugin.setInboxMessagesUpdateCallback = function (callback) {
        MCEPlugin.pauseResumeCallback(function () {
            cordova.exec(callback, MCEPlugin.error, "MCEInboxPlugin", "setInboxMessagesUpdateCallback", [false]);
        }, function () {
            cordova.exec(callback, MCEPlugin.error, "MCEInboxPlugin", "setInboxMessagesUpdateCallback", [true]);
        });
    };
    /**
    Allows Cordova Inbox Plugin to initiate a sync with the server. Will execute function
    registered with setInboxMessagesUpdateCallback when complete.
    */
    MCEInboxPlugin.syncInboxMessages = function () {
        cordova.exec(null, MCEPlugin.error, "MCEInboxPlugin", "syncInboxMessages", []);
    };
    /**
    Allows Cordova Inbox Plugin to get the inbox message by providing the inbox message id.
    @param {string} inboxMessageId Unique identifier for inbox message
    @param {InboxMessageCallback} callback  The callback that handles the response
    */
    MCEInboxPlugin.fetchInboxMessageId = function (inboxMessageId, callback) {
        cordova.exec(callback, MCEPlugin.error, "MCEInboxPlugin", "fetchInboxMessageId", [inboxMessageId]);
    };
    /**
    Allows Cordova Inbox Plugin to call out to action registry to handle rich message actions.
    @param {Object} action is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
    */
    MCEInboxPlugin.executeInboxAction = function (action, inboxMessageId) {
        cordova.exec(null, MCEPlugin.error, "MCEInboxPlugin", "executeInboxAction", [
            action,
            inboxMessageId,
        ]);
    };
    /**
    Allows Cordova Inbox Plugin to delete a message from the database cache and server.
    @param {string} inboxMessageId Unique identifier for inbox message
    */
    MCEInboxPlugin.deleteMessageId = function (inboxMessageId) {
        cordova.exec(null, MCEPlugin.error, "MCEInboxPlugin", "deleteMessageId", [
            inboxMessageId,
        ]);
    };
    /**
    Allows Cordova Inbox Plugin to set the read status of a message in the database cache and server.
    @param {string} inboxMessageId Unique identifier for inbox message
    */
    MCEInboxPlugin.readMessageId = function (inboxMessageId) {
        cordova.exec(null, MCEPlugin.error, "MCEInboxPlugin", "readMessageId", [
            inboxMessageId,
        ]);
    };
    /**
    Allows Cordova Inbox Plugin to retrieve an inbox message by providing a richContentId.
    @param {string} richContentId Unique identifier for rich content
    @param {InboxMessageCallback} callback The callback that handles the response
    */
    MCEInboxPlugin.fetchInboxMessageViaRichContentId = function (richContentId, callback) {
        cordova.exec(callback, MCEPlugin.error, "MCEInboxPlugin", "fetchInboxMessageViaRichContentId", [richContentId]);
    };
    /**
    Allows Cordova Inbox Plugin to immediately remove expired messages from the inbox database
    */
    MCEInboxPlugin.clearExpiredMessages = function () {
        cordova.exec(null, MCEPlugin.error, "MCEInboxPlugin", "clearExpiredMessages", []);
    };
})(MCEInboxPlugin || (MCEInboxPlugin = {}));
module.exports = MCEInboxPlugin;
