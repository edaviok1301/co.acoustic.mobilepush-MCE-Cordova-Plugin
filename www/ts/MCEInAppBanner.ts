/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

import MCEInAppPlugin from "./MCEInAppPlugin";
import { InAppMessage } from "./MCEInAppPluginTypes";

namespace MCEInAppBanner {
    var inAppBannerElement;
    var bannerInAppHidden;
    var bannerInAppShown;
    var timer: number;

    document.addEventListener("deviceready", function () {
        MCEInAppPlugin.registerInAppTemplate(function (
            inAppMessage: InAppMessage
        ) {
            MCEPlugin.safeAreaInsets(async function (insets) {
                cordova.exec(
                    null,
                    null,
                    "MCEInAppPlugin",
                    "sendMessageOpenedEvent",
                    [inAppMessage.inAppMessageId]
                );
                
                var close: string = await MCEPlugin.bestImage(
                    "images/inApp/cancel.png"
                );

                var icon: string = undefined;
                if (inAppMessage["content"]["icon"]) {
                    icon = await MCEPlugin.bestImage(
                        "images/inApp/" +
                            inAppMessage["content"]["icon"] +
                            ".png"
                    );
                }

                var styles = "";
                if (inAppMessage["content"]["orientation"] == "top") {
                    styles = "padding-top: " + insets.top + "px;";
                } else {
                    styles = "padding-bottom: " + insets.bottom + "px;";
                }

                if (inAppMessage["content"]["mainImage"]?.startsWith("http")) {
                    styles +=
                        "background-image: url(" +
                        inAppMessage["content"]["mainImage"] +
                        ");";
                    styles += "background-size: cover;";
                } else if (inAppMessage["content"]["color"]?.startsWith("#"))
                    styles +=
                        "background-color: " +
                        MCEInAppPlugin.processColor(
                            inAppMessage["content"]["color"],
                            "RGBA(18,84,189,1)"
                        ) +
                        ";";
                else styles += "background-color: RGBA(18,84,189,1);";

                styles +=
                    "color: " +
                    MCEInAppPlugin.processColor(
                        inAppMessage["content"]["foreground"],
                        "white"
                    ) +
                    ";";

                $("#inApp").remove();

                var closeElement = $("<img class='close' src='" + close + "'>");
                var iconElement = $("<img class='icon' src='" + icon + "'>");
                inAppBannerElement = $(
                    "<div style='" +
                        styles +
                        "' id='inApp' class='bannerInApp'></div>"
                );
                if (icon) {
                    inAppBannerElement.append(iconElement);
                }
                var textElement = $(
                    "<div class='text'>" +
                        inAppMessage["content"]["text"] +
                        " </div>"
                );
                inAppBannerElement.append(textElement);
                inAppBannerElement.append(closeElement);

                $("body").append(inAppBannerElement);

                iconElement.click(function () {
                    MCEInAppPlugin.executeInAppAction(
                        inAppMessage["content"]["action"]
                    );
                    MCEInAppPlugin.deleteInAppMessage(
                        inAppMessage["inAppMessageId"]
                    );
                    hideBannerInApp();
                });

                textElement.click(function () {
                    MCEInAppPlugin.executeInAppAction(
                        inAppMessage["content"]["action"]
                    );
                    MCEInAppPlugin.deleteInAppMessage(
                        inAppMessage["inAppMessageId"]
                    );
                    hideBannerInApp();
                });

                closeElement.click(function (e) {
                    hideBannerInApp();
                    e.stopPropagation();
                });

                if (inAppMessage["content"]["orientation"] == "top") {
                    bannerInAppHidden = { top: -44 - insets.top + "px" };
                    bannerInAppShown = { top: "0px" };
                } else {
                    bannerInAppHidden = { bottom: "-44px" };
                    bannerInAppShown = { bottom: "0px" };
                }

                var duration = inAppMessage["content"]["duration"];
                if (duration !== 0 && !duration) duration = 5;

                // Animate in
                inAppBannerElement
                    .css(bannerInAppHidden)
                    .animate(bannerInAppShown, function () {
                        if (duration) {
                            timer = setTimeout(
                                hideBannerInApp,
                                duration * 1000
                            );
                        }
                    });
            });
        },
        "default");
    });

    function hideBannerInApp() {
        // Animate Out
        inAppBannerElement.animate(bannerInAppHidden, function () {
            // Complete
            inAppBannerElement.remove();
            clearTimeout(timer);
        });
    }
}

export = MCEInAppBanner;
