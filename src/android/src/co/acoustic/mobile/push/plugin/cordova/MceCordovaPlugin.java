/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

package co.acoustic.mobile.push.plugin.cordova;

import co.acoustic.mobile.push.sdk.js.JsonMceBroadcastReceiver;
import co.acoustic.mobile.push.sdk.js.MceJsonApi;
import co.acoustic.mobile.push.sdk.js.MceJsonApplication;
import co.acoustic.mobile.push.sdk.util.Logger;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;

public class MceCordovaPlugin extends CordovaPlugin {
   private static final String PREFS_NAME = "mcecordova";
    private static final String FIRST_LOAD = "firstload";

    private static final String TAG = "MceCordovaPlugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        start();
        CordovaJsonCallback callback = null;
        if(callbackContext != null) {
            Logger.d(TAG, "Setting callback context to " + callbackContext.getCallbackId());
            callback = new CordovaJsonCallback(callbackContext);
        }

        boolean executed = MceJsonApi.execute(action, args, this.cordova.getActivity().getApplicationContext(), callback, cordova.getThreadPool());
        if(!executed) {
            PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, action);
            callbackContext.sendPluginResult(result);
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void onStop() {
        Logger.d(TAG, "onStop");
        MceJsonApi.running = false;
        super.onStop();
    }

    @Override
    public void onStart() {
        Logger.d(TAG, "onStart");
        super.onStart();
        start();
    }

    void start() {
        MceJsonApi.running = true;
        Context context = this.cordova.getActivity().getApplicationContext();
        boolean firstLoad = context.getSharedPreferences(PREFS_NAME, 0).getBoolean(FIRST_LOAD,
                true);
        if(firstLoad) {
            context.getSharedPreferences(PREFS_NAME, 0).edit().putBoolean(FIRST_LOAD, false).commit();
        } else {
            JsonMceBroadcastReceiver.sendRegisteredCallbacks(cordova.getActivity().getApplicationContext());
            MceJsonApplication.sendRegisteredActionCallbacks(cordova.getActivity().getApplicationContext());
        }

    }
}
