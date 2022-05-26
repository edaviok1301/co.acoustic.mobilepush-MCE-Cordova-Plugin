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

import android.content.Context;

import co.acoustic.mobile.push.sdk.messaging.MessagingManager;
import co.acoustic.mobile.push.sdk.api.registration.RegistrationDetails;

import org.json.JSONException;
import org.json.JSONObject;

public class RegistrationDetailsJson {

   public static enum Key {
        userId, channelId, registrationId, ibmRegistered, providerRegistered, providerName
    }

    public static JSONObject toJson(RegistrationDetails registrationDetails) throws JSONException {
        JSONObject registrationDetailsJson = new JSONObject();
        if(registrationDetails.getChannelId() != null) {
            registrationDetailsJson.put(Key.channelId.name(), registrationDetails.getChannelId());
            if (registrationDetails.getUserId() != null) {
                registrationDetailsJson.put(Key.userId.name(), registrationDetails.getUserId());
            }
            if (registrationDetails.getPushToken() != null) {
                registrationDetailsJson.put(Key.registrationId.name(), registrationDetails.getPushToken());
            }
        }
        return registrationDetailsJson;
    }

    public static JSONObject toIsRegisteredResponse(Context context, RegistrationDetails registrationDetails) throws JSONException {
        JSONObject isRegisteredResponse = new JSONObject();
        isRegisteredResponse.put(Key.ibmRegistered.name(), registrationDetails.getChannelId() != null);
        isRegisteredResponse.put(Key.providerRegistered.name(), registrationDetails.getPushToken() != null);
        isRegisteredResponse.put(Key.providerName.name(), MessagingManager.getServiceName(context));
        return isRegisteredResponse;
    }
}
