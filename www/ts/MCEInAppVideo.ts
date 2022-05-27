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

namespace MCEInAppVideo {
    document.addEventListener("deviceready", function () {
        MCEInAppPlugin.registerInAppTemplate(function (inAppMessage) {
            MCEInAppMedia.show(inAppMessage, function () {
                $(".mediaInApp").append(
                    "<video id='video' playsinline webkit-playsinline><source src=" +
                        inAppMessage["content"]["video"] +
                        ">Your browser does not support the video tag.</video>"
                );
                $(".mediaInApp .text div").prepend(
                    "<progress id='videoProgress'></progress>"
                );

                $("#inApp .text div").css({ "border-top": "0" });

                var progress = $("#videoProgress");
                progress.attr("max", "1");
                progress.attr("min", "0");
                progress.attr("value", "0");

                // This requires <preference name="AllowInlineMediaPlayback" value="true"/> in config.xml
                // App Transport Security can also block videos from playing.
                ($("#video") as JQuery<HTMLVideoElement>)
                    .on("click", function () {
                        MCEInAppPlugin.executeInAppAction(
                            inAppMessage["content"]["action"]
                        );
                        MCEInAppPlugin.deleteInAppMessage(
                            inAppMessage["inAppMessageId"]
                        );
                        MCEInAppMedia.hideMediaInApp();
                    })
                    .on("timeupdate", function () {
                        const video = this as HTMLVideoElement;
                        progress.attr(
                            "value",
                            `${video.currentTime / video.duration}`
                        );
                    })
                    .on("ended", function () {
                        if (MCEInAppMedia.autoDismiss)
                            MCEInAppMedia.hideMediaInApp();
                    });

                // Animate in
                $(".mediaInApp")
                    .animate({ top: 0 }, function () {
                        ($("#video") as JQuery<HTMLVideoElement>)
                            .get(0)
                            .play();
                    });
            });
        }, "video");
    });
}

export = MCEInAppVideo;
