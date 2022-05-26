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

import co.acoustic.mobile.push.sdk.api.attribute.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.*;

public class AttributeJson {
   public static enum Key {
        type, key, value, mcedate
    }

    private static Object toValue(Object value) {
        if(value instanceof Date) {
            return ((Date) value).getTime();
        } else {
            return value;
        }
    }

    public static JSONObject toJSON(Attribute attribute) throws JSONException {
        JSONObject attributeJSON = new JSONObject();
        attributeJSON.put(Key.type.name(), attribute.getType());
        attributeJSON.put(Key.key.name(), attribute.getKey());
        if(attribute.getValue() != null) {
            attributeJSON.put(Key.value.name(), toValue(attribute.getValue()));

        }
        return attributeJSON;
    }

    public static Attribute fromJSON(JSONObject attributeJSON) throws JSONException{
        String key = attributeJSON.getString(Key.key.name());
        String type = attributeJSON.getString(Key.type.name());
        if(StringAttribute.TYPE.equals(type)) {
            return new StringAttribute(key, attributeJSON.optString(Key.value.name()));
        } else if(BooleanAttribute.TYPE.equals(type)) {
            return new BooleanAttribute(key, attributeJSON.getBoolean(Key.value.name()));
        } else if(NumberAttribute.TYPE.equals(type)) {
            Number number = null;
            if (attributeJSON.has(Key.value.name())) {
                String valueStr = String.valueOf(attributeJSON.get(Key.value.name()));
                if (valueStr.indexOf('.') >= 0) {
                    number = Double.parseDouble(valueStr);
                } else {
                    number = Long.parseLong(valueStr);
                }
            }
            return new NumberAttribute(key, number);
        } else if(DateAttribute.TYPE.equals(type)) {
            return new DateAttribute(key, new Date(attributeJSON.getLong(Key.value.name())));
        } else {
            throw new JSONException("Unknown attribute type: "+type);
        }
    }

    public static JSONArray toJSONArray(List<Attribute> attributes) throws JSONException{
        if(attributes == null) {
            return new JSONArray();
        }
        JSONArray attributesJSONArray = new JSONArray();
        for (Attribute attribute : attributes) {
            attributesJSONArray.put(toJSON(attribute));
        }
        return attributesJSONArray;
    }

    public static JSONArray toJSONArray(Attribute[] attributes) throws JSONException{
        if(attributes == null) {
            return new JSONArray();
        }
        JSONArray attributesJSONArray = new JSONArray();
        for (Attribute attribute : attributes) {
            attributesJSONArray.put(attribute);
        }
        return attributesJSONArray;
    }

    public static JSONObject toJSONDictionary(List<Attribute> attributes) throws JSONException{
        if(attributes == null) {
            return new JSONObject();
        }
        JSONObject attributesJSONDictionary = new JSONObject();
        for (Attribute attribute : attributes) {
            if(DateAttribute.TYPE.equals(attribute.getType())) {
                JSONObject dateJSON = new JSONObject();
                dateJSON.put(Key.mcedate.name(), ((Date)attribute.getValue()).getTime());
                attributesJSONDictionary.put(attribute.getKey(), dateJSON);
            } else {
                attributesJSONDictionary.put(attribute.getKey(), attribute.getValue());
            }
        }
        return attributesJSONDictionary;
    }

    public static List<Attribute> fromJSONArray(JSONArray attributesJSONArray) throws JSONException {
        if(attributesJSONArray == null) {
            return new LinkedList<Attribute>();
        }
        List<Attribute> attributes = new ArrayList<Attribute>(attributesJSONArray.length());
        for(int i = 0 ; i < attributesJSONArray.length() ; ++i) {
            attributes.add(fromJSON(attributesJSONArray.getJSONObject(i)));
        }
        return attributes;
    }

    public static List<Attribute> fromJSONDictionary(JSONObject attributesJSONDictionary) throws JSONException {
        if(attributesJSONDictionary == null) {
            return new LinkedList<Attribute>();
        }
        List<Attribute> attributes = new LinkedList<Attribute>();
        Iterator<String> keys = attributesJSONDictionary.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            Object value = attributesJSONDictionary.get(key);
            if(value instanceof Number) {
                attributes.add(new NumberAttribute(key,(Number)value));
            } else if(value instanceof Boolean) {
                attributes.add(new BooleanAttribute(key, (Boolean)value));
            } else if(value instanceof JSONObject) {
                JSONObject dateJSON = (JSONObject)value;
                if(dateJSON.has(Key.mcedate.name())) {
                    attributes.add(new DateAttribute(key, new Date(dateJSON.getLong(Key.mcedate.name()))));
                } else {
                    attributes.add(new StringAttribute(key, value.toString()));
                }
            } else {
                attributes.add(new StringAttribute(key, value.toString()));
            }
        }
        return attributes;
    }
}
