/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

package co.acoustic.mobile.push.sdk.js;

import android.content.pm.PackageManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.location.Location;
import android.content.pm.ResolveInfo;

import co.acoustic.mobile.push.sdk.api.attribute.StringAttribute;
import co.acoustic.mobile.push.sdk.api.attribute.Attribute;
import co.acoustic.mobile.push.sdk.api.MceApplication;
import co.acoustic.mobile.push.sdk.api.MceBroadcastReceiver;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.attribute.AttributesOperation;
import co.acoustic.mobile.push.sdk.api.event.Event;
import co.acoustic.mobile.push.sdk.api.notification.NotificationDetails;
import co.acoustic.mobile.push.sdk.js.format.AttributesOperationJson;
import co.acoustic.mobile.push.sdk.js.format.EventJson;
import co.acoustic.mobile.push.sdk.js.format.RegistrationDetailsJson;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.apiinternal.MceSdkInternal;
import co.acoustic.mobile.push.sdk.location.MceLocation;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.LinkedList;
import java.util.Date;
import java.util.List;

public class JsonMceBroadcastReceiver extends MceBroadcastReceiver {

   private static final String TAG = "JsonMceBroadcastReceiver";

    private static final String ACTION_NOT_YET_REGISTERED_NAME = "setActionNotYetRegisteredCallback";
    private static final String ACTION_NOT_REGISTERED_NAME = "setActionNotRegisteredCallback";

    private static final String SDK_REGISTERED_CALLBACK_NAME = "setSdkRegisteredCallback";
    private static final String ATTRIBUTES_OPERATION_CALLBACK_NAME = "attributesOperationCallback";
    private static final String SEND_EVENT_CALLBACK_NAME = "sendEventCallback";

    private static JsonCallback sdkRegisteredCallback;
    private static JsonCallback messagingServiceRegisteredCallback;
    private static JsonCallback attributesOperationCallback;
    private static JsonCallback sendEventCallback;
    private static JsonCallback actionNotYetRegisteredCallback;
    private static JsonCallback actionNotRegisteredCallback;

    public static void attributeCallbackFailure(Context context, JSONObject response) {
        if(attributesOperationCallback != null && MceJsonApi.running) {
            callbackFailure(attributesOperationCallback, response);
        } else {
            synchronized (ATTRIBUTES_OPERATION_CALLBACK_NAME) {
                JsonCallbacksRegistry.register(context, ATTRIBUTES_OPERATION_CALLBACK_NAME, false, response.toString());
            }
        }
    }

    // Other Methods
    public static void setActionNotRegisteredCallback(Context context, JsonCallback callback) {
        actionNotRegisteredCallback = callback;
        sendActionNotRegisteredCallback(context);
    }

    public static void setActionNotYetRegisteredCallback(Context context, JsonCallback callback) {
        actionNotYetRegisteredCallback = callback;
        sendActionNotYetRegisteredCallback(context);
    }

    private static void sendActionNotRegisteredCallback(Context context) {
        if(actionNotRegisteredCallback != null) {
            synchronized (ACTION_NOT_REGISTERED_NAME) {
                List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, ACTION_NOT_REGISTERED_NAME);
                if(!registeredCallbacks.isEmpty()) {
                    for (JsonCallbacksRegistry.RegisteredCallback callback : registeredCallbacks) {
                        if (callback.isSuccess()) {
                            try {
                                JSONObject value = new JSONObject(callback.getParameterAsString());
                                callbackSuccess(actionNotRegisteredCallback, value);
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate action not registered JSON", jsone);
                            }
                        } else {
                            callbackFailure(actionNotRegisteredCallback, callback.getParameterAsString());
                        }
                    }
                    JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacks);
                }
            }
        }
    }

    private static void sendActionNotYetRegisteredCallback(Context context) {
        if(actionNotYetRegisteredCallback != null) {
            synchronized (ACTION_NOT_YET_REGISTERED_NAME) {
                List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, ACTION_NOT_YET_REGISTERED_NAME);
                if(!registeredCallbacks.isEmpty()) {
                    for (JsonCallbacksRegistry.RegisteredCallback callback : registeredCallbacks) {
                        if (callback.isSuccess()) {
                            try {
                                JSONObject value = new JSONObject(callback.getParameterAsString());
                                callbackSuccess(actionNotYetRegisteredCallback, value);
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate action not registered JSON", jsone);
                            }
                        } else {
                            callbackFailure(actionNotYetRegisteredCallback, callback.getParameterAsString());
                        }
                    }
                    JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacks);
                }
            }
        }
    }

    public static void setSdkRegisteredCallback(Context context, JsonCallback callback) {
        JsonMceBroadcastReceiver.sdkRegisteredCallback = callback;
        sendSdkRegisteredRegisteredCallbacks(context);
    }

    @Override
    public void onActionNotYetRegistered(Context context, String actionType) {
        if(actionNotYetRegisteredCallback != null) {
            synchronized (ACTION_NOT_YET_REGISTERED_NAME) {
                JSONArray json = new JSONArray();
                json.put(actionType);
                callbackSuccess(actionNotYetRegisteredCallback, json);
            }
        }
    }

    @Override
    public void onActionNotRegistered(Context context, String actionType) {
        if(actionNotRegisteredCallback != null) {
            synchronized (ACTION_NOT_REGISTERED_NAME) {
                JSONArray json = new JSONArray();
                json.put(actionType);
                callbackSuccess(actionNotRegisteredCallback, json);
            }
        }
    }

    @Override
    public void onLocationUpdate(Context context, Location location)
    {
    }

    private static void sendSdkRegisteredRegisteredCallbacks(Context context) {
        if(sdkRegisteredCallback != null) {
            synchronized (SDK_REGISTERED_CALLBACK_NAME) {
                List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, SDK_REGISTERED_CALLBACK_NAME);
                if(!registeredCallbacks.isEmpty()) {
                    for (JsonCallbacksRegistry.RegisteredCallback callback : registeredCallbacks) {
                        if (callback.isSuccess()) {
                            try {
                                callbackSuccess(sdkRegisteredCallback, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)));
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate sdk registered JSON", jsone);
                            }
                        } else {
                            callbackFailure(sdkRegisteredCallback, callback.getParameterAsString());
                        }
                    }
                    JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacks);
                }
            }
        }
    }

    public static void setMessagingServiceRegisteredCallback(JsonCallback messagingServiceRegisteredCallback) {
        JsonMceBroadcastReceiver.messagingServiceRegisteredCallback = messagingServiceRegisteredCallback;
    }

    public static void setAttributesOperationCallback(Context context, JsonCallback attributesOperationCallback) {
        JsonMceBroadcastReceiver.attributesOperationCallback = attributesOperationCallback;
        sendRegisteredAttributeOperationsCallbacks(context);
    }

    public static void sendRegisteredCallbacks(Context context) {
        sendSdkRegisteredRegisteredCallbacks(context);
        sendRegisteredAttributeOperationsCallbacks(context);
        sendRegisteredEventCallbacks(context);
    }

    private static void sendRegisteredAttributeOperationsCallbacks(Context context) {
        if(attributesOperationCallback != null) {
            synchronized (ATTRIBUTES_OPERATION_CALLBACK_NAME) {
                List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, ATTRIBUTES_OPERATION_CALLBACK_NAME);
                if(!registeredCallbacks.isEmpty()) {
                    for (JsonCallbacksRegistry.RegisteredCallback callback : registeredCallbacks) {
                        if (callback.isSuccess()) {
                            try {
                                JSONObject attributesOperation = new JSONObject(callback.getParameterAsString());
                                callbackSuccess(attributesOperationCallback, attributesOperation);
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate attributes operation JSON", jsone);
                            }
                        } else {
                            callbackFailure(attributesOperationCallback, callback.getParameterAsString());
                        }
                    }
                    JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacks);
                }
            }
        }
    }

    public static void setSendEventCallback(Context context, JsonCallback sendEventCallback) {
        JsonMceBroadcastReceiver.sendEventCallback = sendEventCallback;
        sendRegisteredEventCallbacks(context);
    }

    private static void sendRegisteredEventCallbacks(Context context) {
        if(sendEventCallback != null) {
            synchronized (SEND_EVENT_CALLBACK_NAME) {
                List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, SEND_EVENT_CALLBACK_NAME);
                if(!registeredCallbacks.isEmpty()) {
                    for (JsonCallbacksRegistry.RegisteredCallback callback : registeredCallbacks) {
                        if (callback.isSuccess()) {
                            try {
                                JSONArray events = new JSONArray(callback.getParameterAsString());
                                callbackSuccess(sendEventCallback, events);
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate events JSON", jsone);
                            }
                        } else {
                            callbackFailure(sendEventCallback, callback.getParameterAsString());
                        }
                    }
                    JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacks);
                }
            }
        }
    }

    @Override
    public void onSdkRegistered(Context context) {
        sendCordovaChannelAttribute(context);
        try {
            if(sdkRegisteredCallback != null && MceJsonApi.running) {
                callbackSuccess(sdkRegisteredCallback, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)));
            } else {
                synchronized (SDK_REGISTERED_CALLBACK_NAME) {
                    JsonCallbacksRegistry.register(context, SDK_REGISTERED_CALLBACK_NAME, true, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)).toString());
                }
            }
        } catch(JSONException jsone) {
            Logger.e(TAG, "Failed to generate sdk registered JSON");
        }
    }

    void sendCordovaChannelAttribute(Context context) {
        List<Attribute> attributes = new LinkedList<Attribute>();
        attributes.add(new StringAttribute("sdk", "cordova"));
        attributes.add(new StringAttribute("cordova", MceSdk.getSdkVerNumber() ));
        try {
            Logger.d(TAG, "Sending cordova channel attribute");
            MceSdkInternal.getQueuedAttributesClient().updateChannelAttributes(context, attributes);
        } catch (JSONException jsone) {
            Logger.d(TAG, "Couldn't create channel attribute");
        }
    }

    @Override
    public void onSdkRegistrationChanged(Context context) {
        sendCordovaChannelAttribute(context);
        try {
            if(sdkRegisteredCallback != null && MceJsonApi.running) {
                callbackSuccess(sdkRegisteredCallback, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)));
            } else {
                synchronized (SDK_REGISTERED_CALLBACK_NAME) {
                    JsonCallbacksRegistry.register(context, SDK_REGISTERED_CALLBACK_NAME, true, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)).toString());
                }
            }
        } catch(JSONException jsone) {
            Logger.e(TAG, "Failed to generate sdk registered JSON");
        }
    }

    @Override
    public void onSdkRegistrationUpdated(Context context) {
        sendCordovaChannelAttribute(context);
        try {
            if(sdkRegisteredCallback != null && MceJsonApi.running) {
                callbackSuccess(sdkRegisteredCallback, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)));
            } else {
                synchronized (SDK_REGISTERED_CALLBACK_NAME) {
                    JsonCallbacksRegistry.register(context, SDK_REGISTERED_CALLBACK_NAME, true, RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)).toString());
                }
            }
        } catch(JSONException jsone) {
            Logger.e(TAG, "Failed to generate sdk registered JSON");
        }
    }

    @Override
    public void onMessagingServiceRegistered(Context context) {
        callbackSuccess(messagingServiceRegisteredCallback);
    }

    @Override
    public void onMessage(Context context, NotificationDetails notificationDetails, Bundle bundle) {

    }

    @Override
    public void onC2dmError(Context context, String error) {
        callbackFailure(messagingServiceRegisteredCallback, error);
    }

    @Override
    public void onSessionStart(Context context, Date date) {
        sendCordovaChannelAttribute(context);
    }

    @Override
    public void onSessionEnd(Context context, Date date, long l) {

    }

    @Override
    public void onNotificationAction(Context context, Date date, String type, String name, String value) {
    }
    
    @Override
    public void onAttributesOperation(Context context, AttributesOperation attributesOperation) {
        try {
            if(attributesOperationCallback != null && MceJsonApi.running) {
                callbackSuccess(attributesOperationCallback, AttributesOperationJson.toCordovaJSON(attributesOperation));
            } else {
                synchronized (ATTRIBUTES_OPERATION_CALLBACK_NAME) {
                    JsonCallbacksRegistry.register(context, ATTRIBUTES_OPERATION_CALLBACK_NAME, true, AttributesOperationJson.toCordovaJSON(attributesOperation).toString());
                }
            }
        } catch (JSONException jsone) {
            Logger.e(TAG, "Failed to generate attributes operation JSON");
        }
    }

    @Override
    public void onEventsSend(Context context, List<Event> events) {
        try{
            if(sendEventCallback != null && MceJsonApi.running) {
                callbackSuccess(sendEventCallback, EventJson.toJSONArray(events));
            } else {
                synchronized (SEND_EVENT_CALLBACK_NAME) {
                    JsonCallbacksRegistry.register(context, SEND_EVENT_CALLBACK_NAME, true, EventJson.toJSONArray(events).toString());
                }
            }
        } catch (JSONException jsone) {
            Logger.e(TAG, "Failed to generate eventsn JSON");
        }
    }

    @Override
    public void onIllegalNotification(Context context, Intent intent) {

    }

    @Override
    public void onNonMceBroadcast(Context context, Intent intent) {

    }

    @Override
    public void onLocationEvent(Context context, MceLocation location, LocationType locationType, LocationEventType locationEventType) {
    }

    @Override
    public void onInboxCountUpdate(Context context) {
    }

    private static void callbackSuccess(JsonCallback callback) {
        if(callback != null) {
            callback.success(true);
        }
    }

    private static void callbackSuccess(JsonCallback callback, JSONObject response) {
        if(callback != null) {
            callback.success(response, true);
        }
    }

    private static void callbackSuccess(JsonCallback callback, JSONArray response) {
        if(callback != null) {
            callback.success(response, true);
        }
    }

    private static void callbackFailure(JsonCallback callback, String errorMessage) {
        if(callback != null) {
            callback.failure(errorMessage, true);
        }
    }

    private static void callbackFailure(JsonCallback callback, JSONObject response) {
        if(callback != null) {
            callback.failure(response, true);
        }
    }
}
