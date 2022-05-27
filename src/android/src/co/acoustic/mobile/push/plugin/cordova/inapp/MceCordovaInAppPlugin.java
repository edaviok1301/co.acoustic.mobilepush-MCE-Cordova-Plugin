/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

package co.acoustic.mobile.push.plugin.cordova.inapp;

import co.acoustic.mobile.push.plugin.cordova.CordovaJsonCallback;
import co.acoustic.mobile.push.sdk.js.inapp.MceJsonApi;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class MceCordovaInAppPlugin extends CordovaPlugin {
   @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        CordovaJsonCallback callback = new CordovaJsonCallback(callbackContext);
        boolean executed = MceJsonApi.execute(action, args, this.cordova.getActivity().getApplicationContext(), callback, cordova.getThreadPool());
        if(!executed) {
            PluginResult result = new PluginResult(PluginResult.Status.INVALID_ACTION, action);
            callbackContext.sendPluginResult(result);
            return false;
        } else {
            return true;
        }
    }

}
