/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */
/**
  Acoustic MCE Cordova Plugin
  */

import {
    Action,
    ActionCallback,
    Event,
    AppKeyCallback,
    AttributeQueueCallback,
    BooleanCallback,
    CategoryCallback,
    CordovaCallback,
    EventQueueFailureCallback,
    EventQueueSuccessCallback,
    GetBadgeCallback,
    ImageCallback,
    RegisteredActionCallback,
    RegisteredCallback,
    RegistrationCallback,
    SafeAreaCallback,
    SdkVersionCallback,
} from "./MCEPluginTypes";

namespace MCEPlugin {
    /**
  Allow Cordova developer to get the current native SDK version in use
  @param {SdkVersionCallback} callback  The callback that handles the response
  */
    export const getSdkVersion = function (callback: SdkVersionCallback) {
        cordova.exec(callback, null, "MCEPlugin", "getSdkVersion", []);
    };

    /**
  Allow Cordova developer to get the current native SDK version in use
  @param {SdkVersionCallback} callback The callback that handles the response
  */
    export const getPluginVersion = function (callback: SdkVersionCallback) {
        callback("3.8.5");
    };

    /**
  Allow Cordova developer to know when registration occurs.
  This will only be called once when the application registers with the Acoustic servers.
  If the application is not active when this happens the callback will be queued
  until the next time this method is called to register a callback handler
  @param {RegistrationCallback} callback The callback that handles the response
  */
    export const setRegistrationCallback = function (
        callback: RegistrationCallback
    ) {
        pauseResumeCallback(
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setRegistrationCallback",
                    [false]
                );
            },
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setRegistrationCallback",
                    [true]
                );
            }
        );
    };

    /**
  Allow Cordova developer to handle custom actions
  @param callback The callback that handles the response
  @param type Custom Action type from the "notification-action" or the "category-actions" section of the payload
  */
    export const setRegisteredActionCallback = function (
        callback: RegisteredActionCallback,
        type: string
    ) {
        pauseResumeCallback(
            function () {
                cordova.exec(
                    callback as CordovaCallback,
                    null,
                    "MCEPlugin",
                    "setRegisteredActionCallback",
                    [type, false]
                );
            },
            function () {
                cordova.exec(
                    callback as CordovaCallback,
                    null,
                    "MCEPlugin",
                    "setRegisteredActionCallback",
                    [type, true]
                );
            }
        );
    };

    /**
      Allow Cordova developer to detect when a push action is not handled.
      */
    export const setActionNotRegisteredCallback = function (
        callback: ActionCallback
    ) {
        pauseResumeCallback(
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setActionNotRegisteredCallback",
                    [false]
                );
            },
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setActionNotRegisteredCallback",
                    [true]
                );
            }
        );
    };

    /**
      Allow Cordova developer to detect when a push action is not handled, but was previously registered.
      */
    export const setActionNotYetRegisteredCallback = function (
        callback: ActionCallback
    ) {
        pauseResumeCallback(
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setActionNotYetRegisteredCallback",
                    [false]
                );
            },
            function () {
                cordova.exec(
                    callback,
                    null,
                    "MCEPlugin",
                    "setActionNotYetRegisteredCallback",
                    [true]
                );
            }
        );
    };

    /**
      Allow Cordova developer to stop handling custom actions
      @param {string} type Custom Action type from the "notification-action" or the "category-actions" section of the payload
      */
    export const unregisterActionCallback = function (type: string) {
        cordova.exec(null, null, "MCEPlugin", "unregisterActionCallback", [
            type,
        ]);
    };

    /**
      Allow Cordova developer to know when events are sent to the server.
      If the event is sent while the application is not active, the callback will be queued
      until the next time this method is called to register a callback handler

      @param {EventQueueSuccessCallback} successCallback The callback that handles the response
      @param {EventQueueFailureCallback} errorCallback The callback that handles the response
      */
    export const setEventQueueCallbacks = function (
        successCallback: EventQueueSuccessCallback,
        errorCallback: EventQueueFailureCallback
    ) {
        var successCallbackWrapper = function (events) {
            successCallback(MCEPlugin.translateEvents(events));
        };

        var errorCallbackWrapper = function (eventsAndError) {
            errorCallback({
                events: MCEPlugin.translateEvents(eventsAndError.events),
                error: eventsAndError.error,
            });
        };

        pauseResumeCallback(
            function () {
                cordova.exec(
                    successCallbackWrapper,
                    errorCallbackWrapper,
                    "MCEPlugin",
                    "setEventQueueCallbacks",
                    [false]
                );
            },
            function () {
                cordova.exec(
                    successCallbackWrapper,
                    errorCallbackWrapper,
                    "MCEPlugin",
                    "setEventQueueCallbacks",
                    [true]
                );
            }
        );
    };

    export const pauseResumeCallback = function (
        pauseFunction: VoidFunction,
        resumeFunction: VoidFunction
    ) {
        resumeFunction();

        document.addEventListener(
            "pause",
            function () {
                pauseFunction();
            },
            false
        );

        document.addEventListener(
            "resume",
            function () {
                resumeFunction();
            },
            false
        );
    };

    /**
     Internal function to translate timestamps from integers or strings to JavaScript date objects
    @param {Array.<Event>} events List of events to translate
    @return {Array.<Event>} List of events translated
    */
    export const translateEvents = function (events: Event[]): Event[] {
        for (const index in events) {
            var event = events[index];
            event["timestamp"] = new Date(event["timestamp"]);
            events[index] = event;
        }
        return events;
    };

    /**
    Allow Cordova developer to know when attributes are sent to the server.
    If the attribute is sent while the application is not active, the callback will be
    queued until the next time this method is called to register a callback handler
    @param {AttributeQueueCallback} successCallback The callback that handles the response
    @param {AttributeQueueCallback} errorCallback The callback that handles the response
    */
    export const setAttributeQueueCallbacks = function (
        successCallback: AttributeQueueCallback,
        errorCallback: AttributeQueueCallback
    ) {
        var successCallbackWrapper = function (details) {
            details.attributes = MCEPlugin.translateAttributesCallback(
                details.attributes
            );
            successCallback(details);
        };
        var errorCallbackWrapper = function (details) {
            details.attributes = MCEPlugin.translateAttributesCallback(
                details.attributes
            );
            errorCallback(details);
        };
        pauseResumeCallback(
            function () {
                cordova.exec(
                    successCallbackWrapper,
                    errorCallbackWrapper,
                    "MCEPlugin",
                    "setAttributeQueueCallbacks",
                    [false]
                );
            },
            function () {
                cordova.exec(
                    successCallbackWrapper,
                    errorCallbackWrapper,
                    "MCEPlugin",
                    "setAttributeQueueCallbacks",
                    [true]
                );
            }
        );
    };

    /**
     Internal function to translate a dictionary of attributes with dates represented as integers back into JavaScript date objects
     @param {Object[]} attributes Attributes to be converted
     @return {Object[]}
    */
    export const translateAttributesCallback = function (
        attributes: Object[]
    ): Object[] {
        for (const key in attributes) {
            var value = attributes[key];
            if (value["mcedate"]) {
                attributes[key] = new Date(value["mcedate"]);
            }
        }
        return attributes;
    };

    /**
      Allow Cordova developer to get the current badge count
      @param {GetBadgeCallback} callback The callback that handles the response
      */
    export const getBadge = function (callback: GetBadgeCallback) {
        cordova.exec(callback, MCEPlugin.error, "MCEPlugin", "getBadge", []);
    };

    /**
     Allow Cordova developer to get the current channelId, userId and deviceToken or registrationId
    @param {RegistrationCallback} callback The callback that handles the response
    */
    export const getRegistrationDetails = function (
        callback: RegistrationCallback
    ) {
        cordova.exec(
            callback,
            MCEPlugin.error,
            "MCEPlugin",
            "getRegistrationDetails",
            []
        );
    };

    /**
      Allow Cordova developer to get the current appKey
      @param {AppKeyCallback} callback The callback that handles the response
      */
    export const getAppKey = function (callback: AppKeyCallback) {
        cordova.exec(callback, MCEPlugin.error, "MCEPlugin", "getAppKey", []);
    };

    /**
      Allow Cordova developer to determine if the device has registered with the push provider's service and if it has registered with the Acoustic infrastructure
      @param {RegisteredCallback} callback The callback that handles the response
      */
    export const isRegistered = function (callback: RegisteredCallback) {
        cordova.exec(
            callback as CordovaCallback,
            MCEPlugin.error,
            "MCEPlugin",
            "isRegistered",
            []
        );
    };

    /**
    Internal function to translate a dictionary of attributes with dates into integers so they can be processed by SDK
    @param {Array.<Object>} attributes Attributes to be converted
    @return {Array.<Object>}
    */
    export const translateAttributes = function (attributes: any[]): any[] {
        var toClass = {}.toString;
        for (const key in attributes) {
            var value = attributes[key];
            if (toClass.call(value) == "[object Date]") {
                attributes[key] = { mcedate: value.getTime() };
            }
        }
        return attributes;
    };

    /**
      Allow Cordova developer to update any user attributes while leaving the existing attributes alone
      This method also includes automatic retrying of failures
      This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
      @param {Object} attributes a list of attributes in key, value format
      */
    export const queueUpdateUserAttributes = function (attributes: any) {
        attributes = MCEPlugin.translateAttributes(attributes);
        cordova.exec(
            null,
            MCEPlugin.error,
            "MCEPlugin",
            "queueUpdateUserAttributes",
            [attributes]
        );
    };

    /**
      Allow Cordova developer to remove specific user attributes
      This method also includes automatic retrying of failures
      This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
      @param {Array} attributes a list of attribute keys to be removed
      */
    export const queueDeleteUserAttributes = function (attributes: any[]) {
        cordova.exec(
            null,
            MCEPlugin.error,
            "MCEPlugin",
            "queueDeleteUserAttributes",
            [attributes]
        );
    };

    /**
      Allow Cordova developer to send an event to the Acoustic infrastructure.
      Status will be reported to method registered via setEventQueueCallbacks
      @param {Event} event Event to be sent to the server
      @param {boolean} flush When this is true, the event is sent immediately and flushes the queue of events to be sent. When it is false, the event is queued and will be automatically sent when the queue is automatically flushed at a later date. This parameter is optional with the default value of true
      */
    export const queueAddEvent = function (event: Event, flush?: boolean) {
        const temp = { ...event, timestamp: event.timestamp.getTime() };
        cordova.exec(null, MCEPlugin.error, "MCEPlugin", "queueAddEvent", [
            temp,
            flush ?? true,
        ]);
    };

    /**
      Allow Cordova developer to set the badge count for the iOS homescreen
      @param {integer} badge a new badge number
      */
    export const setBadge = function (badge: number) {
        cordova.exec(null, MCEPlugin.error, "MCEPlugin", "setBadge", [badge]);
    };

    /**
      Allow Cordova developer to change the Android icon
      @param {string} drawableName Name of a drawable image in app bundle
      */
    export const setIcon = function (drawableName: string) {
        // device.platform is not defined, but this is an Android-only function
        // if(device.platform == "Android") {
        cordova.exec(null, MCEPlugin.error, "MCEPlugin", "setIcon", [drawableName]);
        // }
    };

    /**
      Allow Cordova developer to register and respond to iOS static categories
      @param {CategoryCallback} callback The callback that handles the response
      @param {string} categoryName Name of category to respond to in iOS payload
      @param {Array.<Action>} actions - an array of actions
      */
    export const setCategoryCallbacks = function (
        callback: CategoryCallback,
        categoryName: string,
        actions: Action[]
    ) {
        cordova.exec(
            callback as CordovaCallback,
            MCEPlugin.error,
            "MCEPlugin",
            "setCategoryCallbacksCommand",
            [categoryName, actions]
        );
    };

    /**
      Manually initialize SDK, is used to wait until an event occurs before beginning
      to interact with the Acoustic servers. For example, you might not want to create a
      userid/channelid until after a user logs into your system. Requires
      autoInitialize=FALSE MceConfig.plist flag.
       */
    export const manualInitialization = function () {
        cordova.exec(null, null, "MCEPlugin", "manualInitialization", []);
    };

    /**
      Console error reporting
      @param {string} message Error message
      */
    export const error = function (message: string) {
        console.log("Callback Error: " + message);
    };

    /**
      Executes phone home request which may update the userId and channelId to match changes made on the server. Typically used after contact merge on Engage during user identification. This allows the inbox to be synchronized between multiple installations of the application on different devices for the same user. Note, phone home will execute once every 24 hours automatically without calling this API.
      */
    export const phoneHome = function () {
        cordova.exec(null, MCEPlugin.error, "MCEPlugin", "phoneHome", []);
    };

    /**
     * Get safe are insets for device.
     * @param {SafeAreaCallback} callback to retrieve safe area for device
     */
    export const safeAreaInsets = function (callback: SafeAreaCallback) {
        cordova.exec(callback, MCEPlugin.error, "MCEPlugin", "safeAreaInsets", []);
    };

    /**
     * Queries if user has been invalidated.
     * @param {BooleanCallback} callback to retrieve status of user.
     */
    export const userInvalidated = function (callback: BooleanCallback) {
        cordova.exec(callback, MCEPlugin.error, "MCEPlugin", "userInvalidated", []);
    };

    export const append = function (src: string, addition: string) {
        var parts = src.split(".");
        var extension = parts.pop();
        if (["gif", "png", "jpg", "jpeg"].includes(extension)) {
            parts[parts.length - 1] = parts[parts.length - 1] + addition;
            parts.push(extension);
            return parts.join(".");
        }

        return src;
    };

    export const scaledImage = function (src: string) {
        if (window.devicePixelRatio > 2) {
            return MCEPlugin.append(src, "@3x");
        } else if (window.devicePixelRatio > 1) {
            return MCEPlugin.append(src, "@2x");
        }
        return src;
    };

    export const themedImage = function (src: string) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return MCEPlugin.scaledImage(MCEPlugin.append(src, "-dark"));
        }
        return MCEPlugin.scaledImage(MCEPlugin.append(src, "-light"));
    };

    export const imageCSS = function (image: HTMLImageElement) {
        var modifier = 1;
        if (window.devicePixelRatio > 2) {
            modifier = 3;
        } else if (window.devicePixelRatio > 1) {
            modifier = 2;
        } else {
            return {};
        }

        return {
            width: Math.floor(image.width / modifier) + "px",
            height: Math.floor(image.height / modifier) + "px",
        };
    };

    export const bestImage = function (
        originalSource: string,
        callback?: ImageCallback
    ) {
        const promise: Promise<string> = new Promise((resolve) => {
            var newSource = MCEPlugin.themedImage(originalSource);
            var image = new Image();
            image.onerror = function (error) {
                newSource = MCEPlugin.scaledImage(originalSource);
                image = new Image();
                image.onload = function () {
                    resolve(image.src);

                    if (callback) {
                        callback(image);
                    }
                };
                image.src = newSource;
            };
            image.onload = function () {
                resolve(image.src);

                if (callback) {
                    callback(image);
                }
            };
            image.src = newSource;
        });

        return promise;
    };

    export const replaceImages = function () {
        $("img").each(function (index, item) {
            var replaceImage = item as HTMLImageElement;
            var originalSource =
                replaceImage.getAttribute("originalSource") || replaceImage.src;

            MCEPlugin.bestImage(originalSource, (image) => {
                $(replaceImage).css(MCEPlugin.imageCSS(image));
                replaceImage.setAttribute("originalSource", originalSource);
                replaceImage.src = image.src;
            });
        });
    };
}

export = MCEPlugin;
