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

import co.acoustic.mobile.push.sdk.js.JsonCallback;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;

public class CordovaJsonCallback implements JsonCallback{
   protected CallbackContext callbackContext;

    public CordovaJsonCallback(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    @Override
    public void noResult() {
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(false);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(JSONObject jsonObject, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, jsonObject);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(JSONArray jsonArray, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, jsonArray);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(String s, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, s);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(Number number, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, number.intValue());
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void success(Boolean aBoolean, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.OK, aBoolean);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void failure(String s, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, s);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

    @Override
    public void failure(JSONObject jsonObject, boolean keep) {
        PluginResult result = new PluginResult(PluginResult.Status.ERROR, jsonObject);
        result.setKeepCallback(keep);
        callbackContext.sendPluginResult(result);
    }

}
