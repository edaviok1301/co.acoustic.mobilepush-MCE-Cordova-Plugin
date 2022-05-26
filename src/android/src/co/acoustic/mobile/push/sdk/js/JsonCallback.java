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

import org.json.JSONArray;
import org.json.JSONObject;

public interface JsonCallback {
   public void noResult();
    public void success(boolean keep);
    public void success(JSONObject response, boolean keep);
    public void success(JSONArray response, boolean keep);
    public void success(String response, boolean keep);
    public void success(Number response, boolean keep);
    public void success(Boolean response, boolean keep);
    public void failure(String message, boolean keep);
    public void failure(JSONObject message, boolean keep);
}
