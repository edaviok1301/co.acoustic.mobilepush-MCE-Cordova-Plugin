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

import android.content.Context;
import android.os.Bundle;
import android.annotation.TargetApi;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

import co.acoustic.mobile.push.sdk.api.MceApplication;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationAction;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationActionRegistry;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.api.notification.NotificationsPreference;
import co.acoustic.mobile.push.sdk.api.MceSdk;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

public class MceJsonApplication extends MceApplication {

    private static final String TAG = "MceJsonApplication";

    private static Set<String> registeredCustomActions = new HashSet<String>();

    @TargetApi(26)
    private static void createNotificationChannel(Context context, CharSequence name, String description, String channel_id) {
        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel channel = notificationManager.getNotificationChannel(channel_id);
        if(channel == null) {
            int importance = NotificationManager.IMPORTANCE_HIGH;
            channel = new NotificationChannel(channel_id, name, importance);
            channel.setDescription(description);
            NotificationsPreference notificationsPreference = MceSdk.getNotificationsClient().getNotificationsPreference();
            notificationsPreference.setNotificationChannelId(context, channel_id);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public void handleMetadata(Bundle metadata) {
        super.handleMetadata(metadata);

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = metadata.getString("channelName");
            String description = metadata.getString("channelDescription");
            String channel_id = metadata.getString("channelId");
            createNotificationChannel(getApplicationContext(), name, description, channel_id);
        }
    }

    public static void sendRegisteredActionCallbacks(Context context) {
        for(String customAction : registeredCustomActions) {
            List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = JsonCallbacksRegistry.getRegisteredCallbacks(context, "notification." + customAction);
            Logger.d(TAG, "Auto registration: Action registration: " + customAction + " Found " + registeredCallbacks.size() + " registered callbacks");
            List<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacksForDelete = new LinkedList<JsonCallbacksRegistry.RegisteredCallback>();
            for (JsonCallbacksRegistry.RegisteredCallback regCallback : registeredCallbacks) {
                if (regCallback.isSuccess()) {
                    MceNotificationAction action = MceNotificationActionRegistry.getNotificationAction(context, customAction);
                    if(action instanceof JsonNotificationAction) {
                        JsonNotificationAction jsonNotificationAction = (JsonNotificationAction)action;
                        JsonCallback callback = jsonNotificationAction.getCallback();
                        if(callback != null) {
                            try {
                                Logger.d(TAG, "Auto Registration: Action registration: " + customAction + "invoking callback with " + regCallback.getParameterAsString());
                                JSONObject actionJSON = new JSONObject(regCallback.getParameterAsString());
                                callback.success(actionJSON, true);
                                registeredCallbacksForDelete.add(regCallback);
                            } catch (JSONException jsone) {
                                Logger.e(TAG, "Failed to generate action JSON", jsone);
                            }
                        }
                    }

                }
            }
            if(!registeredCallbacksForDelete.isEmpty()) {
                JsonCallbacksRegistry.deleteCallbacks(context, registeredCallbacksForDelete);
            }
        }
    }


}
