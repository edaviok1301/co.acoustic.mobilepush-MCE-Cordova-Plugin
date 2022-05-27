/*
 * Copyright © 2016, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

import MCEInAppMedia from "./MCEInAppMedia";
import MCEInAppPlugin from "./MCEInAppPlugin";
import { InAppMessage } from "./MCEInAppPluginTypes";

namespace MCEInAppImage {
    document.addEventListener("deviceready", function () {
        MCEInAppPlugin.registerInAppTemplate(function (
            inAppMessage: InAppMessage
        ) {
            MCEInAppMedia.show(inAppMessage, function () {
                $(".mediaInApp").append(
                    `<img class='image' src='${inAppMessage["content"]["image"]}' />`
                );

                $(".mediaInApp .image").click(function () {
                    MCEInAppPlugin.executeInAppAction(
                        inAppMessage["content"]["action"]
                    );
                    MCEInAppPlugin.deleteInAppMessage(
                        inAppMessage["inAppMessageId"]
                    );
                    MCEInAppMedia.hideMediaInApp();
                });

                var duration = inAppMessage["content"]["duration"];
                if (duration !== 0 && !duration) duration = 5;

                let closeTimer: number;
                // Animate in
                $(".mediaInApp")
                    .animate({ top: 0 }, function () {
                        if (duration) {
                            closeTimer = setTimeout(function () {
                                if (MCEInAppMedia.autoDismiss) {
                                    MCEInAppMedia.hideMediaInApp();
                                }
                            }, duration * 1000);
                        }
                    });

                $(".mediaInApp").on("closeModal", function () {
                    clearTimeout(closeTimer);
                });
            });
        },
        "image");
    });
}

export = MCEInAppImage;
