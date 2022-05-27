"use strict";
/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MCEInAppPlugin_1 = __importDefault(require("./MCEInAppPlugin"));
var MCEInAppBanner;
(function (MCEInAppBanner) {
    var inAppBannerElement;
    var bannerInAppHidden;
    var bannerInAppShown;
    var timer;
    document.addEventListener("deviceready", function () {
        MCEInAppPlugin_1.default.registerInAppTemplate(function (inAppMessage) {
            MCEPlugin.safeAreaInsets(function (insets) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var close, icon, styles, closeElement, iconElement, textElement, duration;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                cordova.exec(null, null, "MCEInAppPlugin", "sendMessageOpenedEvent", [inAppMessage.inAppMessageId]);
                                return [4 /*yield*/, MCEPlugin.bestImage("images/inApp/cancel.png")];
                            case 1:
                                close = _c.sent();
                                icon = undefined;
                                if (!inAppMessage["content"]["icon"]) return [3 /*break*/, 3];
                                return [4 /*yield*/, MCEPlugin.bestImage("images/inApp/" +
                                        inAppMessage["content"]["icon"] +
                                        ".png")];
                            case 2:
                                icon = _c.sent();
                                _c.label = 3;
                            case 3:
                                styles = "";
                                if (inAppMessage["content"]["orientation"] == "top") {
                                    styles = "padding-top: " + insets.top + "px;";
                                }
                                else {
                                    styles = "padding-bottom: " + insets.bottom + "px;";
                                }
                                if ((_a = inAppMessage["content"]["mainImage"]) === null || _a === void 0 ? void 0 : _a.startsWith("http")) {
                                    styles +=
                                        "background-image: url(" +
                                            inAppMessage["content"]["mainImage"] +
                                            ");";
                                    styles += "background-size: cover;";
                                }
                                else if ((_b = inAppMessage["content"]["color"]) === null || _b === void 0 ? void 0 : _b.startsWith("#"))
                                    styles +=
                                        "background-color: " +
                                            MCEInAppPlugin_1.default.processColor(inAppMessage["content"]["color"], "RGBA(18,84,189,1)") +
                                            ";";
                                else
                                    styles += "background-color: RGBA(18,84,189,1);";
                                styles +=
                                    "color: " +
                                        MCEInAppPlugin_1.default.processColor(inAppMessage["content"]["foreground"], "white") +
                                        ";";
                                $("#inApp").remove();
                                closeElement = $("<img class='close' src='" + close + "'>");
                                iconElement = $("<img class='icon' src='" + icon + "'>");
                                inAppBannerElement = $("<div style='" +
                                    styles +
                                    "' id='inApp' class='bannerInApp'></div>");
                                if (icon) {
                                    inAppBannerElement.append(iconElement);
                                }
                                textElement = $("<div class='text'>" +
                                    inAppMessage["content"]["text"] +
                                    " </div>");
                                inAppBannerElement.append(textElement);
                                inAppBannerElement.append(closeElement);
                                $("body").append(inAppBannerElement);
                                iconElement.click(function () {
                                    MCEInAppPlugin_1.default.executeInAppAction(inAppMessage["content"]["action"]);
                                    MCEInAppPlugin_1.default.deleteInAppMessage(inAppMessage["inAppMessageId"]);
                                    hideBannerInApp();
                                });
                                textElement.click(function () {
                                    MCEInAppPlugin_1.default.executeInAppAction(inAppMessage["content"]["action"]);
                                    MCEInAppPlugin_1.default.deleteInAppMessage(inAppMessage["inAppMessageId"]);
                                    hideBannerInApp();
                                });
                                closeElement.click(function (e) {
                                    hideBannerInApp();
                                    e.stopPropagation();
                                });
                                if (inAppMessage["content"]["orientation"] == "top") {
                                    bannerInAppHidden = { top: -44 - insets.top + "px" };
                                    bannerInAppShown = { top: "0px" };
                                }
                                else {
                                    bannerInAppHidden = { bottom: "-44px" };
                                    bannerInAppShown = { bottom: "0px" };
                                }
                                duration = inAppMessage["content"]["duration"];
                                if (duration !== 0 && !duration)
                                    duration = 5;
                                // Animate in
                                inAppBannerElement
                                    .css(bannerInAppHidden)
                                    .animate(bannerInAppShown, function () {
                                    if (duration) {
                                        timer = setTimeout(hideBannerInApp, duration * 1000);
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }, "default");
    });
    function hideBannerInApp() {
        // Animate Out
        inAppBannerElement.animate(bannerInAppHidden, function () {
            // Complete
            inAppBannerElement.remove();
            clearTimeout(timer);
        });
    }
})(MCEInAppBanner || (MCEInAppBanner = {}));
module.exports = MCEInAppBanner;
