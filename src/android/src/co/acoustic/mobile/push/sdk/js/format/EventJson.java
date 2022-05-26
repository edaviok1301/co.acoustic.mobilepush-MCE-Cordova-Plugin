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
import co.acoustic.mobile.push.sdk.api.event.Event;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EventJson {
   public static enum Key {
        type, name, attribution, mailingId, timestamp, attributes
    }

    public static JSONObject toJSON(Event event) throws JSONException {
        JSONObject eventJSON = new JSONObject();
        eventJSON.put(Key.type.name(), event.getType());
        eventJSON.put(Key.name.name(), event.getName());
        eventJSON.put(Key.timestamp.name(), event.getTimestamp().getTime());
        eventJSON.putOpt(Key.attribution.name(), event.getAttribution());
        eventJSON.putOpt(Key.mailingId.name(), event.getMailingId());
        JSONObject attributesJSONDictionary = new JSONObject();
        if(event.getAttributes() != null) {
            attributesJSONDictionary = AttributeJson.toJSONDictionary(event.getAttributes());
        }
        eventJSON.putOpt(Key.attributes.name(), attributesJSONDictionary);
        return eventJSON;
    }

    public static Event fromJSON(JSONObject eventJSON) throws JSONException, ParseException {
        String type = eventJSON.getString(Key.type.name());
        String name = eventJSON.getString(Key.name.name());
        Date date = new Date(eventJSON.getLong(Key.timestamp.name()));
        String attribution = eventJSON.optString(Key.attribution.name());
        String mailingId = eventJSON.optString(Key.mailingId.name());
        List<Attribute> attributes = AttributeJson.fromJSONDictionary(eventJSON.optJSONObject(Key.attributes.name()));
        return new Event(type, name, date, attributes, attribution, mailingId);
    }

    public static JSONArray toJSONArray(List<Event> events) throws JSONException {
        if(events == null) {
            return null;
        }
        JSONArray eventsJSONArray = new JSONArray();
        for(Event event : events) {
            eventsJSONArray.put(toJSON(event));
        }
        return eventsJSONArray;
    }

    public static JSONArray toJSONArray(Event[] events) throws JSONException {
        if(events == null) {
            return null;
        }
        JSONArray eventsJSONArray = new JSONArray();
        for(Event event : events) {
            eventsJSONArray.put(toJSON(event));
        }
        return eventsJSONArray;
    }

    public static List<Event> fromJSONArray(JSONArray eventsJSONArray) throws JSONException, ParseException {
        if(eventsJSONArray == null) {
            return null;
        }
        List<Event> events = new ArrayList<Event>(eventsJSONArray.length());
        for(int i = 0 ; i < eventsJSONArray.length() ; ++i) {
            events.add(fromJSON(eventsJSONArray.getJSONObject(i)));
        }
        return events;
    }



}