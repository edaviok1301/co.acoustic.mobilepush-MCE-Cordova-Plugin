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

import co.acoustic.mobile.push.sdk.util.Logger;

import java.util.List;

public class JsonCallbacksRegistry {

   private static final String TAG = "JsonCallbacksRegistry";

    public static void register(Context context, String callbackName, boolean success, String parameterAsString) {
        Logger.d(TAG, "Registering callback for "+callbackName+": "+parameterAsString + "("+success+")");
        JsonDbAdapter.registerCallback(context, new RegisteredCallback(callbackName, success, parameterAsString));
    }

    public static List<RegisteredCallback> getRegisteredCallbacks(Context context, String callbackName) {
        List<RegisteredCallback> registeredCallbacks = JsonDbAdapter.getRegisteredCallbacks(context, callbackName);
        return registeredCallbacks;
    }

    public static void deleteCallbacks(Context context, List<RegisteredCallback> callbacks) {
        Logger.d(TAG, "Deleting callbacks for "+callbacks.get(0).getName()+": "+callbacks.get(0).getParameterAsString() + "("+callbacks.get(0).isSuccess()+")");
        JsonDbAdapter.deleteCallbacks(context, callbacks);
    }

    public static class RegisteredCallback {
        private int id;
        private String  name;
        private boolean success;
        private String parameterAsString;

        public RegisteredCallback(int id, String name, boolean success, String parameterAsString) {
            this.id = id;
            this.name = name;
            this.success = success;
            this.parameterAsString = parameterAsString;
        }

        public RegisteredCallback(String name, boolean success, String parameterAsString) {
            this(-1, name, success, parameterAsString);
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getParameterAsString() {
            return parameterAsString;
        }
    }
}