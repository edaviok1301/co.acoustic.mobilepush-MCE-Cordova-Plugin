/*
 * Copyright © 2016, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

import { InAppMessage } from "./MCEInAppPluginTypes";

var inAppMediaElement: JQuery<HTMLElement>;

namespace MCEInAppMedia {
    export var autoDismiss = false;

    export const hideMediaInApp = function () {
        $(".mediaInApp").animate(
            { top: window.innerHeight + "px" },
            function () {
                $(".mediaInApp").trigger("closeModal");
                $(".mediaInApp").remove();
            }
        );
    };

    export const show = function (
        inAppMessage: InAppMessage,
        completion: VoidFunction
    ) {
        MCEPlugin.safeAreaInsets(async function (insets) {
            cordova.exec(
                null,
                null,
                "MCEInAppPlugin",
                "sendMessageOpenedEvent",
                [inAppMessage.inAppMessageId]
            );

            var close = await MCEPlugin.bestImage("images/inApp/dismiss.png");
            var handle = await MCEPlugin.bestImage("images/inApp/handle.png");

            $("#inApp").remove();

            var closeElement = $(
                "<div class='close'><img src='" + close + "'></div>"
            );
            var handleElement = $(
                `<div class='handle' style='top: ${insets.top}px'><img src='${handle}'></div>`
            );
            var textElement = $(
                "<div class='text'><b>" +
                    inAppMessage["content"]["title"] +
                    "</b><div>" +
                    inAppMessage["content"]["text"] +
                    "</div>"
            );
            inAppMediaElement = $("<div id='inApp' class='mediaInApp'></div>");
            inAppMediaElement
                .append(closeElement)
                .append(handleElement)
                .append(textElement);

            inAppMediaElement.css("padding-top", `${insets.top}px`);
            inAppMediaElement.css("padding-bottom", `${insets.bottom}px`);

            $("body").append(inAppMediaElement);

            closeElement.click(function (e) {
                e.stopPropagation();
                MCEInAppMedia.hideMediaInApp();
            });

            var expanded = false;
            textElement.click(function () {
                MCEInAppMedia.autoDismiss = false;
                expanded = !expanded;
                if (expanded)
                    $(this).css({
                        "max-height": "100%",
                        color: "white",
                        background: "RGBA(0,0,0,0.2)",
                    });
                else
                    $(this).css({
                        "max-height": "44px",
                        color: "gray",
                        background: "",
                    });
            });

            completion();
        });
    };
}

export = MCEInAppMedia;
