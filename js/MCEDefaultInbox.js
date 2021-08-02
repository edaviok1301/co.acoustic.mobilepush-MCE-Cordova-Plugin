/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

/* Inbox Default Template Support */
MCEInbox.setInboxRegistry("default", {
    'actions': function(inboxMessage) { return inboxMessage["content"]["actions"] },
    'preview': function(inboxMessage) {
        return "<div open class='" + (inboxMessage['isExpired'] ? "expired" : "") + "'>" +
            "<div>" +
            "<div class='date'>" + (inboxMessage['isExpired'] ? "Expired: " + inboxMessage['expirationDate'].toLocaleDateString() : inboxMessage['sendDate'].toLocaleDateString()) + "</div>" +
            "<div class='subject " + (inboxMessage['isRead'] ? "old" : "new") + "'>" + inboxMessage['content']['messagePreview']['subject'] + "</div>" +
            "</div>" +
            "<div class='message'>" + inboxMessage['content']['messagePreview']['previewContent'] + "</div>" +
            "</div>";
    },
    'display': function(inboxMessage) {
        return "<div class='defaultDisplay'>" +
            "<div class='subject'>" + inboxMessage['content']['messagePreview']['subject'] + "</div>" +
            "<div class='date'>" + inboxMessage['sendDate'].toLocaleString() + "</div>" +
            "<div class='content'>" + inboxMessage['content']['messageDetails']["richContent"] + "</div>" +
            "</div>";
    }
});