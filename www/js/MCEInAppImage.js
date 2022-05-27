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
var MCEInAppImage;
(function (MCEInAppImage) {
    document.addEventListener("deviceready", function () {
        MCEInAppPlugin_1.default.registerInAppTemplate(function (inAppMessage) {
            MCEInAppMedia_1.default.show(inAppMessage, function () {
                $(".mediaInApp").append("<img class='image' src='".concat(inAppMessage["content"]["image"], "' />"));
                $(".mediaInApp .image").click(function () {
                    MCEInAppPlugin_1.default.executeInAppAction(inAppMessage["content"]["action"]);
                    MCEInAppPlugin_1.default.deleteInAppMessage(inAppMessage["inAppMessageId"]);
                    MCEInAppMedia_1.default.hideMediaInApp();
                });
                var duration = inAppMessage["content"]["duration"];
                if (duration !== 0 && !duration)
                    duration = 5;
                var closeTimer;
                // Animate in
                $(".mediaInApp")
                    .animate({ top: 0 }, function () {
                    if (duration) {
                        closeTimer = setTimeout(function () {
                            if (MCEInAppMedia_1.default.autoDismiss) {
                                MCEInAppMedia_1.default.hideMediaInApp();
                            }
                        }, duration * 1000);
                    }
                });
                $(".mediaInApp").on("closeModal", function () {
                    clearTimeout(closeTimer);
                });
            });
        }, "image");
    });
})(MCEInAppImage || (MCEInAppImage = {}));
module.exports = MCEInAppImage;
