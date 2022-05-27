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

import co.acoustic.mobile.push.sdk.api.message.MessageSync;
import co.acoustic.mobile.push.sdk.plugin.inbox.InboxMessagesClient;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppPlugin;
import co.acoustic.mobile.push.sdk.js.JsonCallback;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppEvents;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppMessageProcessor;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppPayload;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppStorage;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppStorage.KeyName;
import co.acoustic.mobile.push.sdk.api.attribute.Attribute;
import co.acoustic.mobile.push.sdk.api.attribute.StringAttribute;
import co.acoustic.mobile.push.sdk.api.message.MessageProcessor;
import co.acoustic.mobile.push.sdk.api.message.MessageProcessorRegistry;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationAction;
import co.acoustic.mobile.push.sdk.api.OperationCallback;
import co.acoustic.mobile.push.sdk.api.OperationResult;
import co.acoustic.mobile.push.sdk.api.MceSdk;
import co.acoustic.mobile.push.sdk.api.notification.MceNotificationActionRegistry;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.api.event.Event;
import co.acoustic.mobile.push.sdk.notification.MceNotificationActionImpl;
import co.acoustic.mobile.push.sdk.plugin.inapp.InAppManager;
import co.acoustic.mobile.push.sdk.plugin.inbox.RichContent;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Bundle;
import android.content.Context;

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
        try {
            if (Methods.AddInAppMessage.NAME.equals(action)) {
                addInAppMessage(context, parameters);
            } else if (Methods.SyncInAppMessages.NAME.equals(action)) {
                syncInAppMessages(context, callback);
            } else if (Methods.ExecuteInAppRule.NAME.equals(action)) {
                executeInAppRule(context, parameters);
            } else if (Methods.RegisterInAppTemplate.NAME.equals(action)) {
                registerInAppTemplate(context, callback, parameters);
            } else if (Methods.ExecuteInAppAction.NAME.equals(action)) {
                executeInAppAction(context, parameters);            
            } else if (Methods.DeleteInAppMessage.NAME.equals(action)) {
                deleteInAppMessage(context, parameters);
            } else if (Methods.Initialize.NAME.equals(action)) {
                initialize();
            } else if (Methods.SendMessageOpenedEvent.NAME.equals(action)) {
                // Not implemented on Android
                return true;
            } else {
                return false;
            }
            return true;
        } catch (JSONException jsone) {
            Logger.e(TAG, "JSON ERROR", jsone);
            throw jsone;
        }
    }

    public static void addInAppMessage(Context context, JSONArray parameters) throws JSONException {
        JSONObject inAppMessage = parameters.getJSONObject(Methods.AddInAppMessage.MESSAGE_INDEX);
        Bundle extras = new Bundle();
        extras.putString("inApp", inAppMessage.toString());
        InAppManager.handleNotification(context, extras, null, null);
    }

    public static void executeInAppRule(Context context, JSONArray parameters) throws JSONException {
        JSONArray rules = parameters.getJSONArray(Methods.ExecuteInAppRule.RULES_INDEX);

        List<String> values = new LinkedList();
        for(int i = 0; i<rules.length(); i++)
        {
            String rule = rules.getString(i);
            Logger.v(TAG, "Adding Rule: " + rule);
            values.add(rule);
        }
        InAppPayload inAppMessage = InAppStorage.findFirst(context, KeyName.RULE, values);
        if(inAppMessage == null) return;

        String template = inAppMessage.getTemplateName();
        JsonMceBroadcastReceiver.sendInAppTemplate(packageInApp(inAppMessage), template);
    
        InAppEvents.sendInAppMessageOpenedEvent(context, inAppMessage);
        InAppStorage.updateMaxViews(context, inAppMessage);
        if(inAppMessage.isFromPull()) {
            InAppPlugin.updateInAppMessage(context, inAppMessage);
        }
    }
    
    private static JSONObject packageInApp(InAppPayload message) throws JSONException
    {
        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put("triggerDate", message.getTriggerDate().getTime() ); 
        jsonMessage.put("expirationDate", message.getExpirationDate().getTime() );
        
        JSONArray rules = new JSONArray();
        for(String rule : message.getRules())
        {
            rules.put(rule);
        }
        
        jsonMessage.put("rules", rules);
        jsonMessage.put("maxViews", message.getMaxViews() );
        //jsonMessage.put("numViews", message.getNumViews() ); // Missing in android
        jsonMessage.put("template", message.getTemplateName() );
        jsonMessage.put("content", message.getTemplateContent() );
        jsonMessage.put("inAppMessageId", message.getId() );
        
        return jsonMessage;
    }
    public static void registerInAppTemplate(Context context, JsonCallback callback, JSONArray parameters) throws JSONException {
        boolean state = parameters.getBoolean(Methods.RegisterInAppTemplate.STATE_INDEX);
        String template = parameters.getString(Methods.RegisterInAppTemplate.TEMPLATE_NAME_INDEX);

        Logger.d(TAG, "Callbacks Registration: InApp Template - " + template + " - " + state);
        if(state) {
            JsonMceBroadcastReceiver.registerInAppTemplate(callback, template);
        } else {
            JsonMceBroadcastReceiver.registerInAppTemplate(callback, null);
        }
    }

    public static void deleteInAppMessage(final Context context, JSONArray parameters) throws JSONException
    {
        String messageId = parameters.getString(Methods.DeleteInAppMessage.MESSAGE_ID_INDEX);
        InAppManager.delete(context, messageId);
    }
    
    public static void syncInAppMessages(final Context context, final JsonCallback callback) throws JSONException {

        MessageSync.syncMessages(context, new OperationCallback<MessageSync.SyncReport>() {
            @Override
            public void onSuccess(MessageSync.SyncReport syncReport, OperationResult result) {
                if(callback != null) {
                    callback.success(true);
                }
            }

            @Override
            public void onFailure(MessageSync.SyncReport syncReport, OperationResult result) {
                if(callback != null) {
                    String message = syncReport == null ? "Failure, no sync result, probably sync too soon" : syncReport.getFailureCause().name();
                    callback.failure(message, true);
                }
            }
        });
//        InboxMessagesClient.loadInboxMessages(context, new OperationCallback<List<RichContent>>() {
//            @Override
//            public void onSuccess(List<RichContent> newRichContents, OperationResult result) {
//                if(callback != null) {
//                    callback.success(true);
//                }
//            }
//
//            @Override
//            public void onFailure(List<RichContent> richContents, OperationResult result) {
//                if(callback != null) {
//                    callback.failure("", true);
//                }
//            }
//        });
    }

    public static void executeInAppAction(final Context context, JSONArray parameters) throws JSONException {
        JSONObject action = parameters.getJSONObject(Methods.ExecuteInAppAction.ACTION_INDEX);
        String actionType = action.getString("type");
                
        MceNotificationAction actionImpl = MceNotificationActionRegistry.getNotificationAction(context, actionType);
        if (actionImpl != null) {
            HashMap<String, String> payload = new HashMap<String, String>();
            for(Iterator<String> iter = action.keys();iter.hasNext();) 
            {
                String key = iter.next();
                payload.put(key, action.getString(key));
            }

            actionImpl.handleAction(context, actionType, null, null,null, payload, false);

            List<Attribute> eventAttributes = new LinkedList<Attribute>();
            eventAttributes.add(new StringAttribute("actionTaken", actionType));

            String name = actionType;
            MceNotificationActionImpl.ClickEventDetails clickEventDetails = MceNotificationActionImpl.getClickEventDetails(actionType);
            if(clickEventDetails != null) {
                name = clickEventDetails.eventName;
                String value = action.getString("value");
                eventAttributes.add(new StringAttribute(clickEventDetails.valueName, value));
            } else {
                for(String key : payload.keySet()) {
                    eventAttributes.add(new StringAttribute(key, action.getString(key)));
                }
            }
            
            Event event = new Event("inAppMessage", name, new Date(), eventAttributes, null, null);
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

    public static void initialize() {
        MessageProcessor inApp = MessageProcessorRegistry.getMessageProcessor("inAppMessages");
        if(inApp == null) {
            MessageProcessorRegistry.registerMessageProcessor("inAppMessages", new InAppMessageProcessor());
        }
    }

    public static interface Methods {

        public static interface AddInAppMessage {
            public static final String NAME = "addInAppMessage";
            public static final int MESSAGE_INDEX = 0;
        }

        public static interface SyncInAppMessages {
            public static final String NAME = "syncInAppMessages";
        }

        public static interface ExecuteInAppRule {
            public static final String NAME = "executeInAppRule";
            public static final int RULES_INDEX = 0;
        }

        public static interface DeleteInAppMessage {
            public static final String NAME = "deleteInAppMessage";
            public static final int MESSAGE_ID_INDEX = 0;
        }

        public static interface RegisterInAppTemplate {
            public static final String NAME = "registerInAppTemplate";
            public static final int TEMPLATE_NAME_INDEX = 0;
            public static final int STATE_INDEX = 1;
        }

        public static interface ExecuteInAppAction {
            public static final String NAME = "executeInAppAction";
            public static final int ACTION_INDEX = 0;
        }

        public static interface Initialize {
            public static final String NAME = "initialize";
        }

        public static interface SendMessageOpenedEvent {
            public static final String NAME = "sendMessageOpenedEvent";
        }
    }
}
