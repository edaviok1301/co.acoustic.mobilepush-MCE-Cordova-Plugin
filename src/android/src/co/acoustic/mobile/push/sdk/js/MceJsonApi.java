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

import co.acoustic.mobile.push.sdk.registration.PhoneHomeManager;
import co.acoustic.mobile.push.sdk.api.attribute.DateAttribute;
import co.acoustic.mobile.push.sdk.api.attribute.Attribute;
import co.acoustic.mobile.push.sdk.attributes.StoredAttributeDatabase;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationActionRegistry;
import co.acoustic.mobile.push.sdk.js.format.RegistrationDetailsJson;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.api.MceApplication;
import co.acoustic.mobile.push.sdk.util.Iso8601;
import co.acoustic.mobile.push.sdk.registration.RegistrationPreferences;
import co.acoustic.mobile.push.sdk.js.format.AttributeJson;
import co.acoustic.mobile.push.sdk.api.notification.DelayedNotificationAction;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;

import java.util.Iterator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executor;

public class MceJsonApi {
    public static boolean running;

   private static final String TAG = "MceJsonApi";

    public static boolean execute(String action, JSONArray parameters, Context context, JsonCallback callback, Executor executor) throws JSONException {
        try {
            if (Methods.SetActionNotYetRegisteredCallback.NAME.equals(action)) {
                setActionNotYetRegisteredCallback(context, callback);
            } else if (Methods.SetActionNotRegisteredCallback.NAME.equals(action)) {
                setActionNotRegisteredCallback(context, callback);
            } else if (Methods.ManualInitialization.NAME.equals(action)) {
                manualInitialization(context);
            } else if (Methods.SafeAreaInsets.NAME.equals(action)) {
                safeAreaInsets(context, callback);
            } else if (Methods.UserInvalidated.NAME.equals(action)) {
                userInvalidated(context, callback);
            } else if (Methods.PhoneHome.NAME.equals(action)) {
                phoneHome(context);
            } else if (Methods.SetRegistrationCallback.NAME.equals(action)) {
                setRegistrationCallback(context, callback, parameters);
            } else if (Methods.SetEventQueueCallbacks.NAME.equals(action)) {
                setEventQueueCallbacks(context, callback, parameters);
            } else if (Methods.SetAttributeQueueCallbacks.NAME.equals(action)) {
                setAttributeQueueCallbacks(context, callback, parameters);
            } else if (Methods.UnregisterActionCallback.NAME.equals(action)) {
                unregisterActionCallback(context, callback, parameters);
            } else if (Methods.SetActionCallback.NAME.equals(action)) {
                setActionCallback(context, callback, parameters);
            } else if (Methods.GetRegistrationDetails.NAME.equals(action)) {
                getRegistrationDetails(context, callback);
            } else if (Methods.GetAppKey.NAME.equals(action)) {
                getAppKey(context, callback);
            } else if (Methods.GetSdkVersion.NAME.equals(action)) {
                getSdkVersion(callback);
            } else if (Methods.IsSdkRegistered.NAME.equals(action)) {
                isSdkRegistered(context, callback);
            } else if (Methods.IsChannelRegistered.NAME.equals(action)) {
                isChannelRegistered(context, callback);
            } else if (Methods.QueueUpdateUserAttributes.NAME.equals(action)) {
                queueUpdateUserAttributes(context, parameters);
            } else if (Methods.QueueDeleteUserAttributes.NAME.equals(action)) {
                queueDeleteUserAttributes(context, parameters);
            } else if (Methods.AddEventQueue.NAME.equals(action)) {
                addEventQueue(context, parameters);
            } else if (Methods.SetIcon.NAME.equals(action)) {
                setIcon(context, parameters, callback);
            } else if (Methods.SetBadge.NAME.equals(action)) {
            } else if (Methods.SetCategoryCallbacks.NAME.equals(action)) {
            } else {
                return false;
            }
            return true;
        } catch(ParseException pe) {
            throw new JSONException(pe.getMessage());
        } catch (JSONException jsone) {
            Logger.e(TAG, "JSON ERROR", jsone);
            throw jsone;
        }
    }

    public static void setActionNotYetRegisteredCallback(Context context, JsonCallback callback) {
        JsonMceBroadcastReceiver.setActionNotYetRegisteredCallback(context, callback);
    }

    public static void setActionNotRegisteredCallback(Context context, JsonCallback callback) {
        JsonMceBroadcastReceiver.setActionNotRegisteredCallback(context, callback);
    }

    public static void manualInitialization(Context context) {

        MceApplication.firstInit(null);
    }

    public static void safeAreaInsets(Context context, JsonCallback callback) throws JSONException {
        JSONObject insets = new JSONObject();
        insets.put("top", 0);
        insets.put("bottom", 0);
        insets.put("left", 0);
        insets.put("right", 0);
        callback.success(insets, false);
    }

    public static void userInvalidated(Context context, JsonCallback callback) {
        callback.success(RegistrationPreferences.isSdkStopped(context), false);
    }

    public static void phoneHome(Context context) {
        PhoneHomeManager.phoneHome(context);
    }

    public static void setRegistrationCallback(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.SetRegistrationCallback.STATE_INDEX);
        Logger.d(TAG, "Callbacks Registration: SDK registration - " + state);
        if(state) {
            JsonMceBroadcastReceiver.setSdkRegisteredCallback(context, callback);
        } else {
            JsonMceBroadcastReceiver.setSdkRegisteredCallback(context, null);            
        }
    }

    public static void setEventQueueCallbacks(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.SetEventQueueCallbacks.STATE_INDEX);
        Logger.d(TAG, "Callbacks Registration: Event Queue registration - " + state);
        if(state) {
            JsonMceBroadcastReceiver.setSendEventCallback(context, callback);
        } else {
            JsonMceBroadcastReceiver.setSendEventCallback(context, null);
        }
    }

    public static void setAttributeQueueCallbacks(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.SetAttributeQueueCallbacks.STATE_INDEX);
        Logger.d(TAG, "Callbacks Registration: Attributes Queue registration - " + state);
        if(state) {
            JsonMceBroadcastReceiver.setAttributesOperationCallback(context, callback);
        } else {
            JsonMceBroadcastReceiver.setAttributesOperationCallback(context, null);
        }
    }

    public static void unregisterActionCallback(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        String type = parameters.getString(Methods.UnregisterActionCallback.TYPE_INDEX);
        Logger.d(TAG, "Callbacks Registration: Action registration: " + type + " setting to null");
        MceNotificationActionRegistry.registerNotificationAction(context, type, null);
    }

    public static void setActionCallback(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.SetActionCallback.STATE_INDEX);
        String type = parameters.getString(Methods.SetActionCallback.TYPE_INDEX);
        
        if(state) {
            Logger.d(TAG, "Callbacks Registration: Action registration: " + type + " setting to new action callback: " + callback );
            MceNotificationActionRegistry.registerNotificationAction(context, type, new JsonNotificationAction(callback));
        } else {
            Logger.d(TAG, "Callbacks Registration: Action registration: " + type + " setting to background handler");
            MceNotificationActionRegistry.registerNotificationAction(context, type, new DelayedNotificationAction());
        }
    }

    public static void getRegistrationDetails(Context context, JsonCallback callback) throws JSONException {
        callback.success(RegistrationDetailsJson.toJson(MceSdk.getRegistrationClient().getRegistrationDetails(context)), false);
    }

    public static void getAppKey(Context context, JsonCallback callback) {
        String appKey = MceSdk.getRegistrationClient().getAppKey(context);
        callback.success(appKey, false);
    }

    public static void getSdkVersion(JsonCallback callback) {
        String sdkVersion = MceSdk.getSdkVerNumber();
        callback.success(sdkVersion, false);
    }

    public static void isSdkRegistered(Context context, JsonCallback callback) {
        boolean registered = MceSdk.getRegistrationClient().getRegistrationDetails(context).getChannelId() != null;
        callback.success(registered, false);
    }

    public static void isChannelRegistered(Context context, JsonCallback callback) throws JSONException{
        callback.success(RegistrationDetailsJson.toIsRegisteredResponse(context, MceSdk.getRegistrationClient().getRegistrationDetails(context)), false);
    }

    private static void checkDuplicateSetAttribute(Context context, Boolean user, List<Attribute> attributes) throws JSONException {
        List<Attribute> duplicateAttributes = new LinkedList<Attribute>();
        StoredAttributeDatabase.Helper helper = StoredAttributeDatabase.getHelper(context);
        for(Attribute attribute: attributes) {
            if(!helper.isUpdated(attribute)) {
                duplicateAttributes.add(attribute);
            }
        }
        if(duplicateAttributes.size() > 0) {
            Logger.d(TAG, "Duplicate attributes found!");

            JSONObject attributesJson = new JSONObject();
            for(Attribute attribute: duplicateAttributes) {
                if(DateAttribute.TYPE.equals(attribute.getType())) {
                    long date;
                    Object obj = attribute.getValue();
                    if(obj instanceof String) {
                        try {
                            date = Iso8601.toDate(String.valueOf(obj)).getTime();
                        } catch (ParseException e) {
                            throw new JSONException("Failed to parse date "+obj+" "+e.getMessage());
                        }
                    } else {
                        date = (Long)obj;
                    }

                    JSONObject value = new JSONObject();
                    value.put("mcedate", date);
                    attributesJson.put(attribute.getKey(), value);
                } else {
                    attributesJson.put(attribute.getKey(), attribute.getValue());
                }
            }

            JSONObject response = new JSONObject();
            response.put("operation", "update");
            response.put("domain", user ? "user" : "channel");
            response.put("attributes", attributesJson);
            response.put("error", "The operation couldn’t be completed. (Duplicate " + (user ? "user" : "channel") + " attribute value updated error 101.)");
            JsonMceBroadcastReceiver.attributeCallbackFailure(context, response);
        }
    }

    public static void queueUpdateUserAttributes(Context context, JSONArray parameters) throws JSONException {
        JSONObject attributesJSONDictionary = parameters.getJSONObject(Methods.QueueUpdateUserAttributes.ATTRIBUTES_INDEX);

        List<Attribute> attributes = AttributeJson.fromJSONDictionary(attributesJSONDictionary);
        checkDuplicateSetAttribute(context, true, attributes);
        MceSdk.getQueuedAttributesClient().updateUserAttributes(context, attributes);
    }

    public static void queueDeleteUserAttributes(Context context, JSONArray parameters) throws JSONException {
        JSONArray attributeKeys = parameters.getJSONArray(Methods.QueueDeleteUserAttributes.ATTRIBUTE_KEYS_INDEX);
        MceJsonSdk.deleteUserAttributes(context, attributeKeys);
    }

    public static void addEventQueue(Context context, JSONArray parameters) throws JSONException, ParseException {
        JSONObject eventJSON = parameters.getJSONObject(Methods.AddEventQueue.EVENT_INDEX);
        boolean flush = true;
        if(parameters.length() > Methods.AddEventQueue.FLUSH_INDEX && parameters.get(Methods.AddEventQueue.FLUSH_INDEX) instanceof Boolean) {
            flush = parameters.getBoolean(Methods.AddEventQueue.FLUSH_INDEX);
        }
        MceJsonSdk.addEvent(context, eventJSON, flush);
    }

    public static void setIcon(Context context, JSONArray parameters, JsonCallback callback) throws JSONException{
        String iconName = parameters.getString(Methods.SetIcon.ICON_NAME_INDEX);
        int iconId = context
                .getResources()
                .getIdentifier(
                        iconName,
                        "drawable",
                        context.getPackageName());
        MceSdk.getNotificationsClient().getNotificationsPreference().setIcon(context, Integer.valueOf(iconId));
        callback.noResult();
    }

    public static interface Methods {
        public static interface SetActionNotYetRegisteredCallback {
            public static final String NAME="setActionNotYetRegisteredCallback";
        }

        public static interface SetActionNotRegisteredCallback {
            public static final String NAME="setActionNotRegisteredCallback";
        }

        public static interface ManualInitialization {
            public static final String NAME = "manualInitialization";
        }

        public static interface SafeAreaInsets {
            public static final String NAME = "safeAreaInsets";
        }

        public static interface UserInvalidated {
            public static final String NAME = "userInvalidated";
        }

        public static interface PhoneHome {
            public static final String NAME = "phoneHome";
        }

        public static interface SetRegistrationCallback {
            public static final String NAME = "setRegistrationCallback";
            public static final int STATE_INDEX = 0;
        }

        public static interface SetEventQueueCallbacks {
            public static final String NAME = "setEventQueueCallbacks";
            public static final int STATE_INDEX = 0;
        }

        public static interface SetAttributeQueueCallbacks {
            public static final String NAME = "setAttributeQueueCallbacks";
            public static final int STATE_INDEX = 0;
        }

        public static interface UnregisterActionCallback {
            public static final String NAME = "unregisterActionCallback";
            public static final int TYPE_INDEX = 0;
        }

        public static interface SetActionCallback {
            public static final String NAME = "setRegisteredActionCallback";
            public static final int TYPE_INDEX = 0;
            public static final int STATE_INDEX = 1;
        }

        public static interface GetRegistrationDetails {
            public static final String NAME = "getRegistrationDetails";
        }

        public static interface GetAppKey {
            public static final String NAME = "getAppKey";
        }

        public static interface GetSdkVersion {
            public static final String NAME = "getSdkVersion";
        }

        public static interface IsSdkRegistered {
            public static final String NAME = "isSdkRegistered";
        }

        public static interface IsChannelRegistered {
            public static final String NAME = "isChannelRegistered";
        }

        public static interface QueueUpdateUserAttributes {
            public static final String NAME = "queueUpdateUserAttributes";
            public static final int ATTRIBUTES_INDEX = 0;
        }

        public static interface QueueDeleteUserAttributes {
            public static final String NAME = "queueDeleteUserAttributes";
            public static final int ATTRIBUTE_KEYS_INDEX = 0;
        }

        public static interface Event {
            public static final int EVENT_INDEX = 0;
        }

        public static interface AddEventQueue extends Event {
            public static final String NAME = "queueAddEvent";
            public static final int FLUSH_INDEX = 1;
        }

        public static interface SetIcon {
            public static final String NAME = "setIcon";
            public static final int ICON_NAME_INDEX = 0;
        }

        public static interface SetBadge {
            public static final String NAME = "setBadge";
        }

        public static interface SetCategoryCallbacks {
            public static final String NAME = "setCategoryCallbacks";
        }
    }
}
