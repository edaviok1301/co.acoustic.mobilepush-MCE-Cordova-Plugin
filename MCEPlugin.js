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
@module MCEPlugin
*/

/**
@callback sdkVersionCallback
@param version {string} a short string representing SDK version
*/

/**  
Allow Cordova developer to get the current native SDK version in use
@param callback {sdkVersionCallback} The callback that handles the response
*/
exports.getSdkVersion = function(callback) {
    cordova.exec(callback, null, "MCEPlugin", "getSdkVersion", []);
};

/**  
Allow Cordova developer to get the current native SDK version in use
@param callback {sdkVersionCallback} The callback that handles the response
*/
exports.getPluginVersion = function(callback) {
    callback("3.8.0");
};

/**
@typedef Registration
@property userId {string} A short string identifying the user, possibly multiple devices
@property channelId {string} A short string identifying the channel or device
@property deviceToken {string} A medium string that represents the iOS device on APNS
@property registrationId {string} A medium string that represents the Android device on GCM
*/

/** 
@callback registrationCallback
@param registration {Registration} Registration Details
*/

/**
Allow Cordova developer to know when registration occurs.
This will only be called once when the application registers with the Acoustic servers.
If the application is not active when this happens the callback will be queued 
until the next time this method is called to register a callback handler
@param callback {registrationCallback} The callback that handles the response
*/
exports.setRegistrationCallback = function(callback) {
    pauseResumeCallback(function () {
        cordova.exec(callback, null, "MCEPlugin", "setRegistrationCallback", [false]);
    }, function () {
        cordova.exec(callback, null, "MCEPlugin", "setRegistrationCallback", [true]);
    });
}

/** 
@callback registeredActionCallback
@param actionPayload {Object} is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
@param payload {Object} Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125;
*/

/** 
Allow Cordova developer to handle custom actions
@param callback {registeredActionCallback} The callback that handles the response
@param type {string} Custom Action type from the "notification-action" or the "category-actions" section of the payload
*/
exports.setRegisteredActionCallback = function(callback, type) {
    pauseResumeCallback(function () {
        cordova.exec(callback, null, "MCEPlugin", "setRegisteredActionCallback", [type, false]);
    }, function () {
        cordova.exec(callback, null, "MCEPlugin", "setRegisteredActionCallback", [type, true]);
    });
};


/**
Allow Cordova developer to detect when a push action is not handled.
*/
exports.setActionNotRegisteredCallback = function (callback) {
    pauseResumeCallback(function () {
        cordova.exec(callback, null, "MCEPlugin", "setActionNotRegisteredCallback", [false]);
    }, function () {
        cordova.exec(callback, null, "MCEPlugin", "setActionNotRegisteredCallback", [true]);
    });
};

/**
Allow Cordova developer to detect when a push action is not handled, but was previously registered.
*/
exports.setActionNotYetRegisteredCallback = function (callback) {
    pauseResumeCallback(function () {
        cordova.exec(callback, null, "MCEPlugin", "setActionNotYetRegisteredCallback", [false]);
    }, function () {
        cordova.exec(callback, null, "MCEPlugin", "setActionNotYetRegisteredCallback", [true]);
    });
};


/** 
Allow Cordova developer to stop handling custom actions
@param type {string} Custom Action type from the "notification-action" or the "category-actions" section of the payload
*/
exports.unregisterActionCallback = function(type) {
    cordova.exec(null, null, "MCEPlugin", "unregisterActionCallback", [type]);
}

/**
@typedef Event
@property type {string} Event type, SDK automatically sends events of "simpleNotification" and "application" types
@property name {string} Event name, SDK automatically sends events of "sessionStart", "sessionEnd", "urlClicked", "appOpened", "phoneNumberClicked" names
@property timestamp {Date} Timestamp that event occurred
@property attributes {Object} Details about event, freeform key value pairs
@property attribution {string} campaign name associated with event, optional
*/

/**
@callback eventQueueFailureCallback
@param result {Object}
@param result.events {Array.<Event>} List of events that were sent
@param result.error {string} Description of the error
*/

/**
@callback eventQueueSuccessCallback
@param events {Array.<Event>} List of events that were sent
*/

/** 
Allow Cordova developer to know when events are sent to the server.
If the event is sent while the application is not active, the callback will be queued
until the next time this method is called to register a callback handler
    
@param successCallback {eventQueueSuccessCallback} The callback that handles the response
@param errorCallback {eventQueueFailureCallback} The callback that handles the response
*/

exports.setEventQueueCallbacks = function(successCallback, errorCallback) {
    var successCallbackWrapper = function (events) {
        successCallback(MCEPlugin.translateEvents(events));
    };

    var errorCallbackWrapper = function (eventsAndError) {
        errorCallback({ events: MCEPlugin.translateEvents(eventsAndError.events), error: eventsAndError.error});
    }

    pauseResumeCallback(function () {
        cordova.exec(successCallbackWrapper, errorCallbackWrapper, "MCEPlugin", "setEventQueueCallbacks", [false]);
    }, function () {
        cordova.exec(successCallbackWrapper, errorCallbackWrapper, "MCEPlugin", "setEventQueueCallbacks", [true]);
    });
}

function pauseResumeCallback(pauseFunction, resumeFunction) {
    resumeFunction();

    document.addEventListener("pause", function () {
        pauseFunction();
    }, false);

    document.addEventListener("resume", function () {
        resumeFunction();
    }, false);
}

exports.pauseResumeCallback = pauseResumeCallback;

/** 
Internal function to translate timestamps from integers or strings to JavaScript date objects
@param events {Array.<Event>} List of events to translate
@return {Array.<Event>} List of events translated
*/
exports.translateEvents = function(events) {
    for (index in events) {
        var event = events[index];
        event['timestamp'] = new Date(event['timestamp']);
        events[index] = event;
    }
    return events;
}

/**
@callback attributeQueueSuccessCallback
@param result {Object}
@param result.operation {string} Either "update" or "delete" depending on which method was called
@param result.domain {string} Either "channel" or "user" depending on which method was called
@param result.attributes {Object} Key value pairs that were updated if the operation was set or update
@param result.keys {Array} A list of keys that were deleted when the operation is delete
*/

/**
@callback attributeQueueFailureCallback
@param result {Object}
@param result.operation {string} Either "update" or "delete" depending on which method was called
@param result.domain {string} Either "channel" or "user" depending on which method was called
@param result.attributes {Object} Key value pairs that were updated if the operation was set or update
@param result.keys {Array} A list of keys that were deleted when the operation is delete
@param result.error {string} Description of the error
*/

/**
Allow Cordova developer to know when attributes are sent to the server.
If the attribute is sent while the application is not active, the callback will be
queued until the next time this method is called to register a callback handler
@param callback {attributeQueueSuccessCallback} The callback that handles the response
@param callback {attributeQueueFailureCallback} The callback that handles the response
*/

exports.setAttributeQueueCallbacks = function(successCallback, errorCallback) {
    var successCallbackWrapper = function (details) {
        details.attributes = MCEPlugin.translateAttributesCallback(details.attributes);
        successCallback(details);
    };
    var errorCallbackWrapper = function (details) {
        details.attributes = MCEPlugin.translateAttributesCallback(details.attributes);
        errorCallback(details);
    };
    pauseResumeCallback(function () {
        cordova.exec(successCallbackWrapper, errorCallbackWrapper, "MCEPlugin", "setAttributeQueueCallbacks", [false]);
    }, function () {
        cordova.exec(successCallbackWrapper, errorCallbackWrapper, "MCEPlugin", "setAttributeQueueCallbacks", [true]);
    });
}

/** 
Internal function to translate a dictionary of attributes with dates represented as integers back into JavaScript date objects
@param attributes {Array.<Object>} Attributes to be converted
@return {Array.<Object>}
*/
exports.translateAttributesCallback = function(attributes) {
    for (key in attributes) {
        var value = attributes[key]
        if (value["mcedate"]) {
            attributes[key] = new Date(value["mcedate"]);
        }
    }
    return attributes;
}

/**
@callback getBadgeCallback
@param badgeCount {integer}
*/

/**
Allow Cordova developer to get the current badge count
@param callback {getBadgeCallback} The callback that handles the response
*/
exports.getBadge = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getBadge", []);
}

/**
@callback registrationDetailsCallback
@param {Registration} Registration Details
*/

/**
Allow Cordova developer to get the current channelId, userId and deviceToken or registrationId
@param callback {registrationDetailsCallback} The callback that handles the response
*/
exports.getRegistrationDetails = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getRegistrationDetails", []);
}

/**
@callback appKeyCallback
@param appKey {string} A short string for identifying the app in co.acoustic.mobilepushs system
*/

/** 
Allow Cordova developer to get the current appKey
@param callback {appKeyCallback} The callback that handles the response
*/
exports.getAppKey = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "getAppKey", []);
}

/**
@callback registeredCallback
@param co.acoustic.mobilepushRegistered {boolean} will be either true or false and represents the device registering with the Acoustic infrastructure
@param providerRegistered {boolean} will be either true or false and represents the device registering the push provider system (APNS or GCM)
@param providerName {string} name of provider, eg "APNS" or "GCM"

/**
Allow Cordova developer to determine if the device has registered with the push provider's service and if it has registered with the Acoustic infrastructure
@param callback {registeredCallback} The callback that handles the response
*/
exports.isRegistered = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "isRegistered", []);
}

/** 
Internal function to translate a dictionary of attributes with dates into integers so they can be processed by SDK
@param attributes {Array.<Object>} Attributes to be converted
@return {Array.<Object>}
*/
exports.translateAttributes = function(attributes) {
    var toClass = {}.toString;
    for (key in attributes) {
        var value = attributes[key]
        if (toClass.call(value) == "[object Date]") {
            attributes[key] = { "mcedate": value.getTime() };
        }
    }
    return attributes;
}

/** 
Allow Cordova developer to update any user attributes while leaving the existing attributes alone
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Object} a list of attributes in key, value format
*/
exports.queueUpdateUserAttributes = function(attributes) {
    attributes = MCEPlugin.translateAttributes(attributes);
    cordova.exec(null, this.error, "MCEPlugin", "queueUpdateUserAttributes", [attributes]);
}

/** 
Allow Cordova developer to remove specific user attributes
This method also includes automatic retrying of failures
This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
@param attributes {Array} a list of attribute keys to be removed
*/
exports.queueDeleteUserAttributes = function(attributes) {
    cordova.exec(null, this.error, "MCEPlugin", "queueDeleteUserAttributes", [attributes]);
}

/**
@callback basicSuccessCallback
*/

/**
@callback basicFailureCallback
@param error {string} Description of the error
*/

/**
Allow Cordova developer to send an event to the Acoustic infrastructure.
Status will be reported to method registered via setEventQueueCallbacks
@param event {Event} Event to be sent to the server
@param flush {boolean} When this is true, the event is sent immediately and flushes the queue of events to be sent. When it is false, the event is queued and will be automatically sent when the queue is automatically flushed at a later date. This parameter is optional with the default value of true  
*/
exports.queueAddEvent = function(event, flush) {
    event['timestamp'] = event['timestamp'].getTime();
    cordova.exec(null, this.error, "MCEPlugin", "queueAddEvent", [event, flush]);
}

/**
Allow Cordova developer to set the badge count for the iOS homescreen
@param badge {integer} a new badge number
*/
exports.setBadge = function(badge) {
    cordova.exec(null, this.error, "MCEPlugin", "setBadge", [badge]);
}

/**
Allow Cordova developer to change the Android icon
@param drawableName {string} Name of a drawable image in app bundle
*/
exports.setIcon = function(drawableName) {
    // device.platform is not defined, but this is an Android-only function
    // if(device.platform == "Android") {
    cordova.exec(null, this.error, "MCEPlugin", "setIcon", [drawableName]);
    // }
}

/**
@callback categoryCallback
@param payload {Object} Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125;
@param identifier {string} String identifying button to JavaScript processing click of button
*/

/**
@typedef Action
@param destructive {boolean} When true the option shows in red
@param authentication {boolean} When true requires user to unlock device to execute action
@param name {string} String to display on button for user to select
@param identifier {string} String identifying button to JavaScript processing click of button
*/

/**
Allow Cordova developer to register and respond to iOS static categories
@param callback {categoryCallback} The callback that handles the response
@param categoryName {string} Name of category to respond to in iOS payload
@param actions {Array.<Action>} - an array of actions
*/
exports.setCategoryCallbacks = function(callback, categoryName, actions) {
    cordova.exec(callback, this.error, "MCEPlugin", "setCategoryCallbacksCommand", [categoryName, actions]);
}

/** 
Manually initialize SDK, is used to wait until an event occurs before beginning 
to interact with the Acoustic servers. For example, you might not want to create a 
userid/channelid until after a user logs into your system. Requires 
autoInitialize=FALSE MceConfig.plist flag.
 */
exports.manualInitialization = function() {
    cordova.exec(null, null, "MCEPlugin", "manualInitialization", []);
    cordova.plugins.permissions.hasPermission("android.permission.ACCESS_FINE_LOCATION",onSuccess,onFail);
    function onSuccess (data) {
        console.log(data);
        if(data.hasPermission==false){
            alert("hola te pedimos el accesoa  tu ubicacion para ....");
        }
    }
    function onFail (error) {
        console.log(error);
    }
}
/**
Console error reporting 
@param message {string} Error message
*/
exports.error = function(message) {
    console.log("Callback Error: " + message)
}

/**
Executes phone home request which may update the userId and channelId to match changes made on the server. Typically used after contact merge on Engage during user identification. This allows the inbox to be synchronized between multiple installations of the application on different devices for the same user. Note, phone home will execute once every 24 hours automatically without calling this API.
*/
exports.phoneHome = function() {
    cordova.exec(null, this.error, "MCEPlugin", "phoneHome", []);
}

/**
 * Get safe are insets for device.
 * @param {function} callback to retrieve safe area for device
 */
exports.safeAreaInsets = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "safeAreaInsets", []);
}

/**
 * Queries if user has been invalidated.
 * @param {function} callback to retrieve status of user.
 */
exports.userInvalidated = function(callback) {
    cordova.exec(callback, this.error, "MCEPlugin", "userInvalidated", []);
}


exports.append = function(src, addition) {
    var parts = src.split('.');
    var extension = parts.pop();
    if(['gif', 'png', 'jpg', 'jpeg'].includes(extension)) {
        parts[ parts.length-1 ] = parts[ parts.length-1 ] + addition;
        parts.push(extension);
        return parts.join('.');
    }
    
    return src;
}

exports.scaledImage = function(src) {
    if (window.devicePixelRatio > 2) {
        return MCEPlugin.append(src, "@3x");
    } else if (window.devicePixelRatio > 1) {
        return MCEPlugin.append(src, "@2x");
    }
    return src;
}

exports.themedImage = function(src) {
    if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return MCEPlugin.scaledImage(MCEPlugin.append(src, "-dark"));
    }
    return MCEPlugin.scaledImage(MCEPlugin.append(src, "-light"));
}

exports.imageCSS = function(image) {
    var modifier = 1;
    if (window.devicePixelRatio > 2) {
        modifier = 3;
    } else if (window.devicePixelRatio > 1) {
        modifier = 2;
    } else {
        return {};
    }

    return {width: Math.floor(image.width / modifier) + "px", height: Math.floor(image.height / modifier) + "px"}
}

exports.bestImage = function(originalSource, callback) {
    var newSource = MCEPlugin.themedImage(originalSource);
    var image = new Image();
    image.onerror = function (error) {
        newSource = MCEPlugin.scaledImage(originalSource);
        image = new Image();
        image.onload = function () {
            callback(image);
        }
        image.src = newSource;
    }
    image.onload = function () {
        callback(image);
    };
    image.src = newSource;
}

exports.replaceImages = function() {
    $('img').each(function (index, item) {
        var replaceImage = item;
        var originalSource = replaceImage.originalSource || replaceImage.src;

        MCEPlugin.bestImage(originalSource, function (image) {
            $(replaceImage).css(MCEPlugin.imageCSS(image));
            replaceImage.originalSource = originalSource;
            replaceImage.src = image.src;
        });
    });
}
