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

import android.content.ContentProvider;
import android.content.ContentUris;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;

import co.acoustic.mobile.push.sdk.api.db.SdkDatabase;
import co.acoustic.mobile.push.sdk.api.db.SdkDatabaseException;
import co.acoustic.mobile.push.sdk.api.db.SdkDatabaseQueryBuilder;
import co.acoustic.mobile.push.sdk.util.Logger;

import java.util.Arrays;

public class Provider extends ContentProvider {
   private static final String TAG = "Provider";
    private JsonDbAdapter.DatabaseHelper _dbHelper;
    private JsonDbAdapter.ContentUriData _uriData;

    public JsonDbAdapter.DatabaseHelper getDbHelper() {
        if(_dbHelper == null) {
            _dbHelper = new JsonDbAdapter.DatabaseHelper(getContext());
        }
        return _dbHelper;
    }

    public JsonDbAdapter.ContentUriData getUriData() {
        if(_uriData == null) {
            _uriData = new JsonDbAdapter.ContentUriData(getContext());
        }
        return _uriData;
    }

    @Override
    public boolean onCreate() {
        return true;
    }


    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        String tableName = JsonDbAdapter.CALLBACKS_TABLE;
        SdkDatabase db = getfailSafeWritableDatabase(getDbHelper());
        if (db != null) {
            int count = db.delete(tableName, selection, selectionArgs);
            getContext().getContentResolver().notifyChange(uri, null);
            return (count);
        } else {
            return 0;
        }
    }

    @Override
    public String getType(Uri uri) {
        return ("vnd.ibm.mce.cursor.dir/"+JsonDbAdapter.CALLBACKS_TABLE);
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        Logger.d(TAG, "insert(uri=" + uri + ", values=" + values.toString() + ")");

        SdkDatabase db = getfailSafeWritableDatabase(getDbHelper());
        if (db != null) {
            long rowId = db.insert(JsonDbAdapter.CALLBACKS_TABLE ,null, values);
            Uri  contentUri = getUriData().getCallbacksURI();
            if (rowId > 0) {
                Uri uriWithId = ContentUris.withAppendedId(contentUri, rowId);
                getContext().getContentResolver().notifyChange(uriWithId, null);
                return (uriWithId);
            }
            throw new SdkDatabaseException("Failed to insert row into " + uri);
        } else {
            return null;
        }
    }


    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        Logger.d(TAG, "query(uri=" + uri + ", proj=" + Arrays.toString(projection) + ")");
        SdkDatabaseQueryBuilder qb = getDbHelper().createQueryBuilder();
        qb.setTables(JsonDbAdapter.CALLBACKS_TABLE);
        SdkDatabase db = getfailSafeWritableDatabase(getDbHelper());
        if (db != null) {
            Cursor cur = qb.query(db, projection, selection, selectionArgs, null, null, null);
            cur.setNotificationUri(getContext().getContentResolver(), uri);
            return cur;
        }
        return null;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        Logger.d(TAG, "update(uri=" + uri + ", values=" + values.toString() + ")");
        String tableName = JsonDbAdapter.CALLBACKS_TABLE;
        SdkDatabase db = getfailSafeWritableDatabase(getDbHelper());
        if (db != null) {
            int count = db.update(tableName, values, selection, selectionArgs);
            getContext().getContentResolver().notifyChange(uri, null);
            return (count);
        } else {
            return 0;
        }
    }

    private SdkDatabase getfailSafeWritableDatabase(JsonDbAdapter.DatabaseHelper dbHelper) {

        if (getDbHelper() != null) {
            try {
                return getDbHelper().getWritableDatabase();
            } catch (Exception ex) {
                Logger.e(TAG, "Error while getting writableDataBase");
            }

        }
        return null;
    }



}
