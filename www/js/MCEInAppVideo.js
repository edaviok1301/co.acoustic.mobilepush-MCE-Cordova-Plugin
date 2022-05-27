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
var MCEInAppMedia_1 = __importDefault(require("./MCEInAppMedia"));
var MCEInAppPlugin_1 = __importDefault(require("./MCEInAppPlugin"));
var MCEInAppVideo;
(function (MCEInAppVideo) {
    document.addEventListener("deviceready", function () {
        MCEInAppPlugin_1.default.registerInAppTemplate(function (inAppMessage) {
            MCEInAppMedia_1.default.show(inAppMessage, function () {
                $(".mediaInApp").append("<video id='video' playsinline webkit-playsinline><source src=" +
                    inAppMessage["content"]["video"] +
                    ">Your browser does not support the video tag.</video>");
                $(".mediaInApp .text div").prepend("<progress id='videoProgress'></progress>");
                $("#inApp .text div").css({ "border-top": "0" });
                var progress = $("#videoProgress");
                progress.attr("max", "1");
                progress.attr("min", "0");
                progress.attr("value", "0");
                // This requires <preference name="AllowInlineMediaPlayback" value="true"/> in config.xml
                // App Transport Security can also block videos from playing.
                $("#video")
                    .on("click", function () {
                    MCEInAppPlugin_1.default.executeInAppAction(inAppMessage["content"]["action"]);
                    MCEInAppPlugin_1.default.deleteInAppMessage(inAppMessage["inAppMessageId"]);
                    MCEInAppMedia_1.default.hideMediaInApp();
                })
                    .on("timeupdate", function () {
                    var video = this;
                    progress.attr("value", "".concat(video.currentTime / video.duration));
                })
                    .on("ended", function () {
                    if (MCEInAppMedia_1.default.autoDismiss)
                        MCEInAppMedia_1.default.hideMediaInApp();
                });
                // Animate in
                $(".mediaInApp")
                    .animate({ top: 0 }, function () {
                    $("#video")
                        .get(0)
                        .play();
                });
            });
        }, "video");
    });
})(MCEInAppVideo || (MCEInAppVideo = {}));
module.exports = MCEInAppVideo;
