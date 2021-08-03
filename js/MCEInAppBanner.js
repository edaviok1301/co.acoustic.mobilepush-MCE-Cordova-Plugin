/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

var inAppBannerElement;
var bannerInAppHidden;
var bannerInAppShown;
document.addEventListener('deviceready', function() {
    MCEInAppPlugin.registerInAppTemplate(function(inAppMessage) {
        MCEPlugin.safeAreaInsets(function(insets) {
            var close = MCEPlugin.bestImage("images/inApp/cancel.png");

            var icon = undefined;
            if (inAppMessage['content']['icon']) {
                icon = MCEPlugin.bestImage("images/inApp/" + inAppMessage['content']['icon'] + ".png");
            }

            var styles = "";
            var iconStyle = "";
            var closeStyle = "";
            var textStyle = "";
            if (inAppMessage["content"]["orientation"] == "top") {
                styles = 'padding-top: ' + insets.top + "px;";
                closeStyle = "top: " + insets.top + "px;";
                iconStyle = "top: " + insets.top + "px;";
            } else {
                styles = 'padding-bottom: ' + insets.bottom + "px;";
                closeStyle = "bottom: " + insets.bottom + "px;";
                iconStyle = "bottom: " + insets.bottom + "px;";
            }
            var background;
            if (typeof(inAppMessage['content']['mainImage']) != 'undefined') {
                styles += 'background-image: url(' + inAppMessage['content']['mainImage'] + ');';
                styles += 'background-size: cover;';
            } else if (typeof(inAppMessage['content']['color']) != 'undefined')
                styles += 'background-color: ' + MCEInAppPlugin.processColor(inAppMessage['content']['color'], "RGBA(18,84,189,1)") + ";";
            else
                styles += 'background-color: RGBA(18,84,189,1);';

            styles += 'color: ' + MCEInAppPlugin.processColor(inAppMessage['content']['foreground'], "white") + ';';

            $('#inApp').remove();

            var closeElement = $("<div class='close' style='" + closeStyle + "'><img src='" + close + "'></div>");
            var iconElement = $("<div class='icon' style='" + iconStyle + "'><img src='" + icon + "'></div>");
            inAppBannerElement = $("<div style='" + styles + "' id='inApp' class='bannerInApp'></div>");
            inAppBannerElement.append(closeElement);
            if (icon) {
                textStyle = 'margin-left: 44px;';
                inAppBannerElement.append(iconElement);
            } else {
                textStyle = 'margin-left: 10px;';
            }
            var textElement = $("<div class='text' style='" + textStyle + "'>" + inAppMessage['content']['text'] + " </div>");
            inAppBannerElement.append(textElement);

            $('body').append(inAppBannerElement);

            iconElement.click(function() {
                MCEInAppPlugin.executeInAppAction(inAppMessage['content']['action'])
                MCEInAppPlugin.deleteInAppMessage(inAppMessage['inAppMessageId']);
                hideBannerInApp();
            });

            textElement.click(function() {
                MCEInAppPlugin.executeInAppAction(inAppMessage['content']['action'])
                MCEInAppPlugin.deleteInAppMessage(inAppMessage['inAppMessageId']);
                hideBannerInApp();
            });

            closeElement.click(function() {
                hideBannerInApp();
            });

            // Vertical center text
            var padding = ($('#inApp').height() - $('#inApp div.text').height()) / 2;
            textElement.css('padding-top', padding + "px");

            if (inAppMessage["content"]["orientation"] == "top") {
                bannerInAppHidden = { 'top': (-44 - insets.top) + "px" };
                bannerInAppShown = { 'top': "0px" };
            } else {
                bannerInAppHidden = { 'bottom': "-44px" };
                bannerInAppShown = { 'bottom': "0px" };
            }

            var duration = inAppMessage["content"]["duration"];
            if (duration !== 0 && !duration)
                duration = 5;

            // Animate in
            inAppBannerElement.css(bannerInAppHidden).animate(bannerInAppShown, function() {
                if (duration)
                    setTimeout(hideBannerInApp, duration * 1000);
            });
        });
    }, "default");
});

function hideBannerInApp() {
    // Animate Out
    inAppBannerElement.animate(bannerInAppHidden, function() {
        // Complete
        inAppBannerElement.remove();
    });
}