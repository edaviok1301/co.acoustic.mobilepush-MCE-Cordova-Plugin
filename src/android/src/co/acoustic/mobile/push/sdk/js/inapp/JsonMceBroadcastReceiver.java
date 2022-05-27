/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

package co.acoustic.mobile.push.sdk.js.inapp;

import co.acoustic.mobile.push.sdk.js.JsonCallback;

import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;

import co.acoustic.mobile.push.sdk.location.MceLocation;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppManager;
import co.acoustic.mobile.push.sdk.api.MceBroadcastReceiver;
import co.acoustic.mobile.push.sdk.api.attribute.AttributesOperation;
import co.acoustic.mobile.push.sdk.api.event.Event;
import co.acoustic.mobile.push.sdk.api.notification.NotificationDetails;
import co.acoustic.mobile.push.sdk.util.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.HashMap;

import java.util.Date;
import java.util.List;

public class JsonMceBroadcastReceiver extends MceBroadcastReceiver{

   private static final String TAG = "JsonMceBroadcastReceiver";

    private static final String SEND_INAPP_NAME = "sendInAppCallback";

    private static HashMap<String, JsonCallback> inAppTemplate = new HashMap<String, JsonCallback>();

    public static void registerInAppTemplate(JsonCallback inAppTemplate, String template) {
        JsonMceBroadcastReceiver.inAppTemplate.put(template, inAppTemplate);
    }

    public static void sendInAppTemplate(JSONObject message, String template) {
        JsonCallback callback = JsonMceBroadcastReceiver.inAppTemplate.get(template);
        if(callback != null) {
            synchronized (SEND_INAPP_NAME) {
                callbackSuccess(callback, message);
            }
        }
    }

    @Override
    public void onSdkRegistered(Context context) {
    
    }
    
    @Override
    public void onMessagingServiceRegistered(Context context) {
    
    }

    @Override
    public void onSdkRegistrationChanged(Context context) {
    
    }

    @Override
    public void onSdkRegistrationUpdated(Context context) {

    }

    @Override
    public void onC2dmError(Context context, String error) {

    }

    @Override
    public void onSessionStart(Context context, Date date) {

    }

    @Override
    public void onSessionEnd(Context context, Date date, long l) {

    }

    @Override
    public void onAttributesOperation(Context context, AttributesOperation attributesOperation) {

    }

    @Override
    public void onNotificationAction(Context context, Date date, String type, String name, String value) {

    }

    @Override
    public void onMessage(Context context, NotificationDetails notificationDetails, Bundle bundle) {
        if(notificationDetails != null) {
            Logger.i(TAG, "-- SDK delivery channel message received");
            Logger.i(TAG, "Subject is: " + notificationDetails.getSubject());
            Logger.i(TAG, "Message is: " + notificationDetails.getMessage());
        }
        String attribution = null;
        if(notificationDetails != null && notificationDetails.getMceNotificationPayload() != null) {
            attribution = notificationDetails.getMceNotificationPayload().getAttribution();
        }
        String mailingId = null;
        if(notificationDetails != null && notificationDetails.getMceNotificationPayload() != null) {
            mailingId = notificationDetails.getMceNotificationPayload().getMailingId();
        }
        Logger.i(TAG, "Sending to InAppManager");
        InAppManager.handleNotification(context, bundle, attribution, mailingId);
    }

    @Override
    public void onEventsSend(Context context, List<Event> events) {
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
    public void onLocationUpdate(Context context, Location location) {

    }

    @Override
    public void onActionNotYetRegistered(Context context, String actionType) {
    }

    @Override
    public void onActionNotRegistered(Context context, String actionType) {
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

}
