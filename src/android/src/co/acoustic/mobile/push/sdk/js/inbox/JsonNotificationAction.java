/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

package co.acoustic.mobile.push.sdk.js.inbox;
import co.acoustic.mobile.push.sdk.js.JsonCallback;
import co.acoustic.mobile.push.sdk.js.JsonCallbacksRegistry;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessageAction;
import co.acoustic.mobile.push.sdk.api.MceApplication;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.notification.NotificationDetails;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationAction;
import co.acoustic.mobile.push.sdk.util.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import co.acoustic.mobile.push.sdk.js.MceJsonApi;

import java.util.Map;

public class JsonNotificationAction implements MceNotificationAction {

   private static final String TAG = "JsonNotificationAction";

    public static enum Key {
        type, name, attribution, mailingId, payload
    }

    private JsonCallback callback;

    public JsonNotificationAction(JsonCallback callback) {
        this.callback = callback;
    }

    public JsonCallback getCallback() {
        return callback;
    }

    @Override
    public void handleAction(Context context, String type, String name, String attribution, String mailingId, Map<String, String> payload, boolean fromNotification) {
        try {
            JSONObject actionJSON = new JSONObject();
            if(payload != null) {
                for(String key : payload.keySet()) {
                    Object value = payload.get(key);
                    if(value instanceof String) {
                        String valueStr = (String)value;
                        if(valueStr.startsWith("{") && valueStr.endsWith("}")) {
                            try {
                                value = new JSONObject(valueStr);
                            } catch(JSONException jsone) {}
                        }
                    }
                    actionJSON.put(key,value);
                }
            }
            actionJSON.put(Key.type.name(), type);
            actionJSON.put(Key.name.name(), name);
            if(attribution != null) {
                actionJSON.put(Key.attribution.name(), attribution);
            }
            if(mailingId != null) {
                actionJSON.put(Key.mailingId.name(), mailingId);
            }
            if(callback != null && MceJsonApi.running) {
                callback.success(actionJSON, true);
            } else {
                JsonCallbacksRegistry.register(context, "notification." + type, true, actionJSON.toString());
                Intent actionIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
                actionIntent.addFlags(MceSdk.getNotificationsClient().getNotificationsPreference().getFlags(context));
                Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
                context.sendBroadcast(it);
                context.startActivity(actionIntent);
            }

        } catch(JSONException jsone) {
            Logger.e(TAG, "Failed to construct action JSON", jsone);
        }
    }

    @Override
    public void init(Context context, JSONObject initOptions) {

    }

    @Override
    public void update(Context context, JSONObject updateOptions) {

    }

    @Override
    public boolean shouldDisplayNotification(final Context context, NotificationDetails notificationDetails, final Bundle sourceBundle) {
        if(notificationDetails.getAction().getType().equals("openInboxMessage"))
        {
            InboxMessageAction inboxMessageAction = new InboxMessageAction();
            return inboxMessageAction.shouldDisplayNotification(context, notificationDetails, sourceBundle);
        }
        return true;
    }

    @Override
    public boolean shouldSendDefaultEvent(Context context) {
        return true;
    }
}
