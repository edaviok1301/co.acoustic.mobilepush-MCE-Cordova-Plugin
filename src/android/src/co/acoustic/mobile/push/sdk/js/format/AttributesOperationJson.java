/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */
package co.acoustic.mobile.push.sdk.js.format;

import co.acoustic.mobile.push.sdk.api.attribute.Attribute;
import co.acoustic.mobile.push.sdk.api.attribute.DateAttribute;
import co.acoustic.mobile.push.sdk.api.attribute.AttributesOperation;
import co.acoustic.mobile.push.sdk.messaging.MessagingManager;
import co.acoustic.mobile.push.sdk.util.Logger;
import co.acoustic.mobile.push.sdk.util.Iso8601;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.*;
import java.text.ParseException;

public class AttributesOperationJson {
    static final String TAG = "AttributesOperationJson";
   public static enum Key {
        operation, domain, attributes, keys
    }

    public static enum Operation {
        update, delete
    }

    public static enum Domain {
        channel, user
    }

    public static Operation getOperation(AttributesOperation.Type operationType) {
        switch (operationType) {
            case updateAttributes:
                return Operation.update;
            case deleteAttributes:
                return Operation.delete;
        }
        return null;
    }

    public static JSONObject toJSON(AttributesOperation attributesOperation) throws JSONException {
        JSONObject attributesOperationJSON = new JSONObject();
        Operation operation = getOperation(attributesOperation.getType());
        attributesOperationJSON.put(Key.operation.name(), operation.name());
        attributesOperationJSON.put(Key.domain.name(), (attributesOperation.isChannel() ? Domain.channel : Domain.user).name());
        switch (operation) {
            case update:
                attributesOperationJSON.put(Key.attributes.name(), co.acoustic.mobile.push.sdk.attributes.AttributeJson.toJSONArray(attributesOperation.getAttributes()));
                break;
            case delete:
                attributesOperationJSON.put(Key.keys.name(), MessagingManager.StringJson.toJSONArray(attributesOperation.getAttributeKeys()));
        }
        return attributesOperationJSON;
    }

    public static JSONObject toCordovaJSON(AttributesOperation attributesOperation) throws JSONException {
        JSONObject attributesOperationJSON = new JSONObject();
        Operation operation = getOperation(attributesOperation.getType());
        attributesOperationJSON.put(Key.operation.name(), operation.name());
        attributesOperationJSON.put(Key.domain.name(), (attributesOperation.isChannel() ? Domain.channel : Domain.user).name());
        switch (operation) {
            case update:
                JSONObject attributes = new JSONObject();
                for(Attribute attribute: attributesOperation.getAttributes()) {
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
                        attributes.put(attribute.getKey(), value);
                    } else {
                        attributes.put(attribute.getKey(), attribute.getValue());
                    }
                }
                attributesOperationJSON.put(Key.attributes.name(), attributes);
                break;
            case delete:
                attributesOperationJSON.put(Key.keys.name(), MessagingManager.StringJson.toJSONArray(attributesOperation.getAttributeKeys()));
        }
        Logger.d(TAG, "Done " + attributesOperationJSON.toString() );
        return attributesOperationJSON;
    }
}
