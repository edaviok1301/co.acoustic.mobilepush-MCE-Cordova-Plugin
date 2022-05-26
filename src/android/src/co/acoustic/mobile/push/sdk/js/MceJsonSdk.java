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

import co.acoustic.mobile.push.sdk.api.OperationResult;
import co.acoustic.mobile.push.sdk.apiinternal.MceSdkInternal;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.OperationCallback;
import co.acoustic.mobile.push.sdk.api.attribute.AttributesOperation;
import co.acoustic.mobile.push.sdk.api.event.Event;
import co.acoustic.mobile.push.sdk.messaging.MessagingManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.concurrent.Executor;

public class MceJsonSdk {

   public static void updateUserAttributes(Context context, JSONObject attributesJsonDictionary) throws JSONException {
        MceSdk.getQueuedAttributesClient().updateUserAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary));
    }

    public static void deleteUserAttributes(Context context, JSONArray attributeKeys) throws JSONException {
        MceSdk.getQueuedAttributesClient().deleteUserAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys));
    }


    public static void updateChannelAttributes(Context context, JSONObject attributesJsonDictionary) throws JSONException {
        MceSdkInternal.getQueuedAttributesClient().updateChannelAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary));
    }

    public static void deleteChannelAttributes(Context context, JSONArray attributeKeys) throws JSONException {
        MceSdkInternal.getQueuedAttributesClient().deleteChannelAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys));
    }

    public static void updateUserAttributesNow(Context context, JSONObject attributesJsonDictionary, JsonCallback callback, Executor executor) throws JSONException {
        MceSdk.getAttributesClient(executor).updateUserAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary), new AttributesOperationJsonCallback(callback));
    }

    public static void deleteUserAttributesNow(Context context, JSONArray attributeKeys, JsonCallback callback, Executor executor) throws JSONException {
        MceSdk.getAttributesClient(executor).deleteUserAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys), new AttributesOperationJsonCallback(callback));
    }

    public static void updateChannelAttributesNow(Context context, JSONObject attributesJsonDictionary, JsonCallback callback, Executor executor) throws JSONException {
        MceSdkInternal.getAttributesClient(executor).updateChannelAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary), new AttributesOperationJsonCallback(callback));
    }

    public static void deleteChannelAttributesNow(Context context, JSONArray attributeKeys, JsonCallback callback, Executor executor) throws JSONException {
        MceSdkInternal.getAttributesClient(executor).deleteChannelAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys), new AttributesOperationJsonCallback(callback));
    }

    public static void updateUserAttributesNow(Context context, JSONObject attributesJsonDictionary, JsonCallback callback) throws JSONException {
        MceSdk.getAttributesClient(false).updateUserAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary), new AttributesOperationJsonCallback(callback));
    }

    public static void deleteUserAttributesNow(Context context, JSONArray attributeKeys, JsonCallback callback) throws JSONException {
        MceSdk.getAttributesClient(false).deleteUserAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys), new AttributesOperationJsonCallback(callback));
    }

    public static void updateChannelAttributesNow(Context context, JSONObject attributesJsonDictionary, JsonCallback callback) throws JSONException {
        MceSdkInternal.getAttributesClient(false).updateChannelAttributes(context, co.acoustic.mobile.push.sdk.js.format.AttributeJson.fromJSONDictionary(attributesJsonDictionary), new AttributesOperationJsonCallback(callback));
    }

    public static void deleteChannelAttributesNow(Context context, JSONArray attributeKeys, JsonCallback callback) throws JSONException {
        MceSdkInternal.getAttributesClient(false).deleteChannelAttributes(context, MessagingManager.StringJson.fromJSONArray(attributeKeys), new AttributesOperationJsonCallback(callback));
    }

    public static void addEvent(Context context, JSONObject event, boolean flush) throws JSONException, ParseException {
        MceSdk.getQueuedEventsClient().sendEvent(context, co.acoustic.mobile.push.sdk.js.format.EventJson.fromJSON(event), flush);
    }

    public static void sendEvent(Context context, JSONObject event, JsonCallback callback, Executor executor) throws JSONException, ParseException {
        MceSdk.getEventsClient(executor).sendEvent(context, co.acoustic.mobile.push.sdk.js.format.EventJson.fromJSON(event), new EventJsonCallback(callback));
    }

    public static void sendEvent(Context context, JSONObject event, JsonCallback callback) throws JSONException, ParseException {
        MceSdk.getEventsClient(false).sendEvent(context, co.acoustic.mobile.push.sdk.js.format.EventJson.fromJSON(event), new EventJsonCallback(callback));
    }

    private static class AttributesOperationJsonCallback implements OperationCallback<AttributesOperation> {

        private static final String TAG = "JsonAttributesOperationCallback";
        private JsonCallback callback;

        private AttributesOperationJsonCallback(JsonCallback callback) {
            this.callback = callback;
        }

        @Override
        public void onSuccess(AttributesOperation attributesOperation, OperationResult result) {
            callback.success(false);
        }

        @Override
        public void onFailure(AttributesOperation attributesOperation, OperationResult result) {
            callback.failure(result.getMessage(), false);

        }
    }

    private static class EventJsonCallback implements OperationCallback<Event> {

        private static final String TAG = "JsonAttributesOperationCallback";
        private JsonCallback callback;

        private EventJsonCallback(JsonCallback callback) {
            this.callback = callback;
        }

        @Override
        public void onSuccess(Event event, OperationResult result) {
            callback.success(false);
        }

        @Override
        public void onFailure(Event event, OperationResult result) {
            callback.failure(result.getMessage(), false);
        }
    }
}
