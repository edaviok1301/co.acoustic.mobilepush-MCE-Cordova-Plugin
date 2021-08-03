/*
 * Copyright © 2016, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

var inAppMediaElement;

exports.hideMediaInApp = function() {
    $('.mediaInApp').animate({ "top": document.height + "px" }, function() {
        $('.mediaInApp').remove();
    });
}

exports.show = function(inAppMessage, completion) {
    MCEPlugin.safeAreaInsets(function(insets) {
        MCEInAppMedia.autoDismiss = true;
        var close = MCEPlugin.bestImage("images/inApp/dismiss.png");
        var handle = MCEPlugin.bestImage("images/inApp/handle.png");

        $('#inApp').remove();

        var closeElement = $("<div class='close'><img src='" + close + "'></div>");
        closeElement.css({ "top": insets.top });
        var handleElement = $("<div class='handle'><img src='" + handle + "'></div>");
        handleElement.css({ "top": insets.top });
        var textElement = $("<div class='text'><b>" + inAppMessage['content']['title'] + "</b><div>" + inAppMessage['content']['text'] + "</div>");
        inAppMediaElement = $("<div id='inApp' class='mediaInApp'></div>")
        inAppMediaElement.append(closeElement).append(handleElement).append(textElement);

        $('body').append(inAppMediaElement);

        $('.mediaInApp .close').click(function() {
            MCEInAppMedia.hideMediaInApp();
        });

        var expanded = false;
        $('.mediaInApp .text').click(function() {
            MCEInAppMedia.autoDismiss = false;
            expanded = !expanded;
            if (expanded)
                $(this).css({ 'max-height': '100%', 'color': "white", "background": "RGBA(0,0,0,0.2)" });
            else
                $(this).css({ 'max-height': '44px', 'color': "gray", "background": "" });
        });
        
        completion();
    });
}