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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var inAppMediaElement;
var MCEInAppMedia;
(function (MCEInAppMedia) {
    MCEInAppMedia.autoDismiss = false;
    MCEInAppMedia.hideMediaInApp = function () {
        $(".mediaInApp").animate({ top: window.innerHeight + "px" }, function () {
            $(".mediaInApp").trigger("closeModal");
            $(".mediaInApp").remove();
        });
    };
    MCEInAppMedia.show = function (inAppMessage, completion) {
        MCEPlugin.safeAreaInsets(function (insets) {
            return __awaiter(this, void 0, void 0, function () {
                var close, handle, closeElement, handleElement, textElement, expanded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cordova.exec(null, null, "MCEInAppPlugin", "sendMessageOpenedEvent", [inAppMessage.inAppMessageId]);
                            return [4 /*yield*/, MCEPlugin.bestImage("images/inApp/dismiss.png")];
                        case 1:
                            close = _a.sent();
                            return [4 /*yield*/, MCEPlugin.bestImage("images/inApp/handle.png")];
                        case 2:
                            handle = _a.sent();
                            $("#inApp").remove();
                            closeElement = $("<div class='close'><img src='" + close + "'></div>");
                            handleElement = $("<div class='handle' style='top: ".concat(insets.top, "px'><img src='").concat(handle, "'></div>"));
                            textElement = $("<div class='text'><b>" +
                                inAppMessage["content"]["title"] +
                                "</b><div>" +
                                inAppMessage["content"]["text"] +
                                "</div>");
                            inAppMediaElement = $("<div id='inApp' class='mediaInApp'></div>");
                            inAppMediaElement
                                .append(closeElement)
                                .append(handleElement)
                                .append(textElement);
                            inAppMediaElement.css("padding-top", "".concat(insets.top, "px"));
                            inAppMediaElement.css("padding-bottom", "".concat(insets.bottom, "px"));
                            $("body").append(inAppMediaElement);
                            closeElement.click(function (e) {
                                e.stopPropagation();
                                MCEInAppMedia.hideMediaInApp();
                            });
                            expanded = false;
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
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
})(MCEInAppMedia || (MCEInAppMedia = {}));
module.exports = MCEInAppMedia;
