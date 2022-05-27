"use strict";
/*
 * Copyright © 2016, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MCEInbox_1 = __importDefault(require("./MCEInbox"));
var MCEInboxPlugin_1 = __importDefault(require("./MCEInboxPlugin"));
/* Inbox Default Template Support */
document.addEventListener("deviceready", function () {
    $(document).on("click", ".postInboxMessage .actions a[action]", function () {
        var action = JSON.parse($(this).attr("action"));
        MCEInboxPlugin_1.default.executeInboxAction(action, $(this).parents("[inboxMessageId]").attr("inboxMessageId"));
    });
    var imageSizeCache = {};
    $(document).on("inview", ".postInboxMessage .contentImage", function () {
        var element = this;
        var source = $(element).attr("source");
        var size = imageSizeCache[source];
        if (size) {
            element.src = source;
            var height = (imageSizeCache[source]["height"] /
                imageSizeCache[source]["width"]) *
                $(element).width();
            $(element).height(height);
            console.log("cache resizing image to " + height);
        }
        else {
            var contentImage = new Image();
            contentImage.onload = function () {
                element.src = source;
                imageSizeCache[source] = {
                    width: contentImage.naturalWidth,
                    height: contentImage.naturalHeight,
                };
                var height = (contentImage.naturalHeight / contentImage.naturalWidth) *
                    $(element).width();
                console.log("fresh resizing image to " + height);
                $(element).height(height);
            };
            contentImage.src = source;
        }
    });
});
MCEInbox_1.default.setInboxRegistry("post", {
    actions: function (richContent) {
        return richContent["content"]["actions"];
    },
    preview: function (richContent) {
        return view(richContent);
    },
    display: function (richContent) {
        return view(richContent);
    },
});
function view(richContent) {
    var c = richContent["content"];
    var header = "<div open class='postHeader'>";
    var titleStyle = "";
    if (c["headerImage"]) {
        header += "<img class='headerImage' src='" + c["headerImage"] + "'>";
        titleStyle = " style='left: 59px'";
    }
    header += "<div class='title'" + titleStyle + ">" + c["header"] + "</div>";
    header +=
        "<div class='subtitle'" + titleStyle + ">" + c["subHeader"] + "</div>";
    header += "</div>";
    var content = "";
    if (c["contentVideo"]) {
        content +=
            "<video class='contentVideo' webkit-playsinline playsinline controls preload='metadata'><source src=" +
                c["contentVideo"] +
                ">Your browser does not support the video tag.</video>";
    }
    else if (c["contentImage"]) {
        content +=
            "<img open class='contentImage' src='" +
                c["contentImage"] +
                "'>";
    }
    if (c["contentText"]) {
        content +=
            "<div open class='contentText'>" + c["contentText"] + "</div>";
    }
    var actions = "";
    if (c["actions"]) {
        actions += "<div class='actions'>";
        if (actions.length === 1) {
            actions += buildAction(c["actions"][0]);
        }
        else if (actions.length === 2) {
            actions += buildAction(c["actions"][0]) + buildAction(c["actions"][1]);
        }
        else if (actions.length > 2) {
            actions += buildAction(c["actions"][0]) + buildAction(c["actions"][2]) + buildAction(c["actions"][1]);
        }
        actions += "</div>";
    }
    return ("<div class='postInboxMessage'>" + header + content + actions + "</div>");
}
function buildAction(action) {
    return "<div><a noclick action='" +
        JSON.stringify(action) +
        "'>" +
        action["name"] +
        "</a></div>";
}
