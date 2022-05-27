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

import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessageProcessor;
import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessageReference;
import co.acoustic.mobile.push.sdk.api.message.MessageSync;
import co.acoustic.mobile.push.sdk.js.JsonCallback;
import co.acoustic.mobile.push.sdk.api.attribute.Attribute;
import co.acoustic.mobile.push.sdk.api.attribute.StringAttribute;
import co.acoustic.mobile.push.sdk.api.message.MessageProcessor;
import co.acoustic.mobile.push.sdk.api.message.MessageProcessorRegistry;
import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessageProcessor;
import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessagesClient;
import co.acoustic.mobile.push.sdk.plugin.inbox.RichContentDatabaseHelper;
import co.acoustic.mobile.push.sdk.plugin.inbox.RichContentDatabaseHelper.MessageCursor;
import co.acoustic.mobile.push.sdk.plugin.inbox.RichContent;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationAction;
import co.acoustic.mobile.push.sdk.api.OperationCallback;
import co.acoustic.mobile.push.sdk.api.OperationResult;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationActionRegistry;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.api.event.Event;
import co.acoustic.mobile.push.sdk.notification.MceNotificationActionImpl;

import android.content.Context;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.HashMap;

public class MceJsonApi {

    private static final String TAG = "MceJsonApi";

    private static final String SEND_MESSAGES_NAME = "sendMessagesCallback";

    public static boolean execute(String action, JSONArray parameters, Context context, JsonCallback callback, Executor executor) throws JSONException {
        Logger.d(TAG, "will execute action: " + action);
        try {
            if (Methods.SetInboxMessagesUpdateCallback.NAME.equals(action)) {
                setInboxMessagesUpdateCallback(context, callback, parameters);
            } else if (Methods.SyncInboxMessages.NAME.equals(action)) {
                syncInboxMessages(context);
            } else if (Methods.FetchInboxMessageId.NAME.equals(action)) {
                fetchInboxMessageId(context, callback, parameters);
            } else if (Methods.ExecuteInboxAction.NAME.equals(action)) {
                executeInboxAction(context, parameters);
            } else if (Methods.DeleteMessageId.NAME.equals(action)) {
                deleteMessageId(context, parameters);
            } else if (Methods.ReadMessageId.NAME.equals(action)) {
                readMessageId(context, parameters);
            } else if (Methods.FetchInboxMessageViaRichContentId.NAME.equals(action)) {
                fetchInboxMessageViaRichContentId(context, callback, parameters);
            } else if (Methods.ClearExpiredMessages.NAME.equals(action)) {
                clearExpiredMessages(context);
            } else if (Methods.Initialize.NAME.equals(action)) {
                initialize();
            } else {
                return false;
            }
            return true;
        } catch (JSONException jsone) {
            Logger.e(TAG, "JSON ERROR", jsone);
            throw jsone;
        }
    }

    public static void clearExpiredMessages(Context context) {
        RichContentDatabaseHelper.getRichContentDatabaseHelper(context).clearDeletedMessages();
    }

    private static BroadcastReceiver inboxUpdaterReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Logger.e(TAG, "TEMP onReceive = " + intent.getAction());
            MceJsonApi.syncInboxMessages(context);
        }
    };

    public static void setInboxMessagesUpdateCallback(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.SetInboxMessagesUpdateCallback.STATE_INDEX);
        context.registerReceiver(inboxUpdaterReceiver, new IntentFilter(InboxMessagesClient.INBOX_UPDATE_ACTION));

        Logger.d(TAG, "Callbacks Registration: Inbox Update - " + state);
        if (state) {
            inboxMessagesUpdateCallback = callback;
            syncInboxMessages(context);
        } else {
            inboxMessagesUpdateCallback = null;
        }
    }

    public static void syncInboxMessages(final Context context) {
        MessageSync.syncMessages(context, new OperationCallback<MessageSync.SyncReport>() {
            @Override
            public void onSuccess(MessageSync.SyncReport syncReport, OperationResult result) {
                try {
                    JSONArray messages = new JSONArray();
                    Logger.d(TAG, "Accessug message cursor from RichContentDataBaseHelper... RUNTIME ERROR prone ");
                    MessageCursor messageCursor = RichContentDatabaseHelper.getRichContentDatabaseHelper(context).getMessages();
                    while (messageCursor.moveToNext()) {
                        RichContent message = messageCursor.getRichContent();
                        messages.put(packageInboxMessage(message));
                    }
                    if (inboxMessagesUpdateCallback != null) {
                        synchronized (SEND_MESSAGES_NAME) {
                            callbackSuccess(inboxMessagesUpdateCallback, messages);
                        }
                    }
                } catch (JSONException jsone) {
                    Logger.e(TAG, "Failed to generate sync JSON", jsone);
                }
            }

            @Override
            public void onFailure(MessageSync.SyncReport syncReport, OperationResult result) {

            }
        });
    }

    public static void fetchRichContentId(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        String richContentId = parameters.getString(Methods.FetchRichContentId.RICH_CONTENT_ID_INDEX);

        MessageCursor messageCursor = RichContentDatabaseHelper.getRichContentDatabaseHelper(context).getMessagesByContentId(richContentId);
        messageCursor.moveToFirst();
        callbackRichContent(messageCursor, callback);
    }

    private static void callbackRichContent(MessageCursor messageCursor, JsonCallback callback) throws JSONException {
        RichContent message = messageCursor.getRichContent();
        if (message == null) {
            throw new JSONException("Rich Content not found in database");
        }

        callback.success(packageInboxMessage(message), true);
    }

    private static JSONObject packageInboxMessage(RichContent message) throws JSONException {
        JSONObject richContentJSON = new JSONObject();
        richContentJSON.put("inboxMessageId", message.getMessageId());
        richContentJSON.put("richContentId", message.getContentId());
        richContentJSON.put("content", message.getContent());

        richContentJSON.put("template", message.getTemplate());
        richContentJSON.put("attribution", message.getAttribution());
        richContentJSON.put("sendDate", message.getSendDate().getTime());
        richContentJSON.put("expirationDate", message.getExpirationDate().getTime());
        richContentJSON.put("isDeleted", message.getIsDeleted());
        richContentJSON.put("isRead", message.getIsRead());
        return richContentJSON;
    }

    private static void callbackInboxMessage(MessageCursor messageCursor, JsonCallback callback) throws JSONException {
        RichContent message = messageCursor.getRichContent();
        if (message == null) {
            throw new JSONException("Inbox Message not found in database");
        }

        callback.success(packageInboxMessage(message), true);
    }

    public static void fetchInboxMessageId(final Context context, final JsonCallback callback, JSONArray parameters) throws JSONException {
        final String inboxMessageId = parameters.getString(Methods.FetchInboxMessageId.INBOX_MESSAGE_ID_INDEX);
        final JsonCallback fcallback = callback;
        final Context fcontext = context;

        MessageCursor messageCursor = RichContentDatabaseHelper.getRichContentDatabaseHelper(fcontext).getMessagesByMessageId(inboxMessageId);
        if (messageCursor.getCount() == 0) {
            InboxMessageReference messageReference = new InboxMessageReference(null, inboxMessageId);
            Toast.makeText(context, "[Merge issue] - dev ", Toast.LENGTH_LONG).show();
            Logger.e("INBOX", new Exception("fetch inbox message id ERROR").getMessage());

            InboxMessageProcessor.addMessageToLoad(messageReference);

            MessageSync.syncMessages(context, new OperationCallback<MessageSync.SyncReport>() {
                @Override
                public void onSuccess(MessageSync.SyncReport syncReport, OperationResult result) {
                    MessageCursor messageCursor1 = RichContentDatabaseHelper.getRichContentDatabaseHelper(context).getMessagesByMessageId(inboxMessageId);
                    if (messageCursor1.getCount() == 0) {
                        fcallback.failure("Messages empty", false);
                    } else {
                        messageCursor1.moveToFirst();
                        try {
                            callbackInboxMessage(messageCursor1, callback);
                        } catch (JSONException e) {
                            Logger.e(TAG, "Exception while feedbacking js " + e.getMessage());
                            fcallback.failure("Messages empty", false);
                        }
                    }
                }

                @Override
                public void onFailure(MessageSync.SyncReport syncReport, OperationResult result) {
                    Logger.e(TAG, "Failed to sync messages " + syncReport.getFailureCause().name());
                }
            });
        } else {
            messageCursor.moveToFirst();
            callbackInboxMessage(messageCursor, fcallback);
        }
    }

    public static void executeInboxAction(final Context context, JSONArray parameters) throws JSONException {
        JSONObject action = parameters.getJSONObject(Methods.ExecuteInboxAction.ACTION_INDEX);
        String inboxMessageId = parameters.getString(Methods.ExecuteInboxAction.INBOX_MESSAGE_ID_INDEX);
        MessageCursor messageCursor = RichContentDatabaseHelper.getRichContentDatabaseHelper(context).getMessagesByMessageId(inboxMessageId);
        messageCursor.moveToFirst();
        RichContent message = messageCursor.getRichContent();
        String richContentId = message.getContentId();
        String attribution = message.getAttribution();

        // get richContentId and attribution
        // put in event
        String actionType = action.getString("type");

        MceNotificationAction actionImpl = MceNotificationActionRegistry.getNotificationAction(context, actionType);
        if (actionImpl != null) {
            HashMap<String, String> payload = new HashMap<String, String>();
            for (Iterator<String> iter = action.keys(); iter.hasNext(); ) {
                String key = iter.next();
                payload.put(key, action.getString(key));
            }

            actionImpl.handleAction(context, actionType, null, null, null, payload, false);

            List<Attribute> eventAttributes = new LinkedList<Attribute>();
            eventAttributes.add(new StringAttribute("richContentId", richContentId));
            eventAttributes.add(new StringAttribute("inboxMessageId", inboxMessageId));
            eventAttributes.add(new StringAttribute("actionTaken", actionType));

            String name = actionType;
            MceNotificationActionImpl.ClickEventDetails clickEventDetails = MceNotificationActionImpl.getClickEventDetails(actionType);
            if (clickEventDetails != null) {
                name = clickEventDetails.eventName;
                String value = action.getString("value");
                eventAttributes.add(new StringAttribute(clickEventDetails.valueName, value));
            } else {
                for (String key : payload.keySet()) {
                    eventAttributes.add(new StringAttribute(key, action.getString(key)));
                }
            }

            Event event = new Event("inboxMessage", name, new Date(), eventAttributes, attribution, null);

            MceSdk.getEventsClient(false).sendEvent(context, event, new OperationCallback<Event>() {
                @Override
                public void onSuccess(Event event, OperationResult result) {

                }

                @Override
                public void onFailure(Event event, OperationResult result) {
                    MceSdk.getQueuedEventsClient().sendEvent(context, event);
                }
            });

        }
    }

    public static void deleteMessageId(Context context, JSONArray parameters) throws JSONException {
        String inboxMessageId = parameters.getString(Methods.DeleteMessageId.INBOX_MESSAGE_ID_INDEX);
        InboxMessagesClient.deleteMessageById(context, inboxMessageId);
        // Not sending an event since the server is not expecting an event to be sent.
    }

    public static void readMessageId(Context context, JSONArray parameters) throws JSONException {
        String inboxMessageId = parameters.getString(Methods.ReadMessageId.INBOX_MESSAGE_ID_INDEX);
        InboxMessagesClient.setMessageReadById(context, inboxMessageId);
        // Not sending an event since the server is not expecting an event to be sent.
    }

    public static void fetchInboxMessageViaRichContentId(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {

        String richContentId = parameters.getString(Methods.FetchInboxMessageViaRichContentId.RICH_CONTENT_ID_INDEX);

        MessageCursor messageCursor = RichContentDatabaseHelper.getRichContentDatabaseHelper(context).getMessagesByContentId(richContentId);
        messageCursor.moveToFirst();
        callbackInboxMessage(messageCursor, callback);
    }
    
    public static void initialize() {
        MessageProcessor inApp = MessageProcessorRegistry.getMessageProcessor("messages");
        if(inApp == null) {
            MessageProcessorRegistry.registerMessageProcessor("messages", new InboxMessageProcessor());
        }
    }

    private static JsonCallback inboxMessagesUpdateCallback;

    public static interface Methods {
        public static interface SetInboxMessagesUpdateCallback {
            public static final String NAME = "setInboxMessagesUpdateCallback";
            public static final int STATE_INDEX = 0;
        }

        public static interface SyncInboxMessages {
            public static final String NAME = "syncInboxMessages";
        }

        public static interface FetchRichContentId {
            public static final String NAME = "fetchRichContentId";
            public static final int RICH_CONTENT_ID_INDEX = 0;
        }

        public static interface FetchInboxMessageId {
            public static final String NAME = "fetchInboxMessageId";
            public static final int INBOX_MESSAGE_ID_INDEX = 0;
        }

        public static interface ExecuteInboxAction {
            public static final String NAME = "executeInboxAction";
            public static final int ACTION_INDEX = 0;
            public static final int INBOX_MESSAGE_ID_INDEX = 1;
        }

        public static interface DeleteMessageId {
            public static final String NAME = "deleteMessageId";
            public static final int INBOX_MESSAGE_ID_INDEX = 0;
        }

        public static interface ReadMessageId {
            public static final String NAME = "readMessageId";
            public static final int INBOX_MESSAGE_ID_INDEX = 0;
        }

        public static interface FetchInboxMessageViaRichContentId {
            public static final String NAME = "fetchInboxMessageViaRichContentId";
            public static final int RICH_CONTENT_ID_INDEX = 0;
        }

        public static interface ClearExpiredMessages {
            public static final String NAME = "clearExpiredMessages";
        }

        public static interface Initialize {
            public static final String NAME = "initialize";
        }
    }

    private static void callbackSuccess(JsonCallback callback) {
        if (callback != null) {
            callback.success(true);
        }
    }

    private static void callbackSuccess(JsonCallback callback, JSONObject response) {
        if (callback != null) {
            callback.success(response, true);
        }
    }

    private static void callbackSuccess(JsonCallback callback, JSONArray response) {
        if (callback != null) {
            callback.success(response, true);
        }
    }

    private static void callbackFailure(JsonCallback callback, String errorMessage) {
        if (callback != null) {
            callback.failure(errorMessage, true);
        }
    }
}
