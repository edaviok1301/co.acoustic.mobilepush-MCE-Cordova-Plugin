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

import android.content.ContentValues;
import android.content.Context;

import android.database.Cursor;
import android.net.Uri;

import co.acoustic.mobile.push.sdk.api.db.SdkDatabase;
import co.acoustic.mobile.push.sdk.api.db.SdkDatabaseOpenHelper;
import co.acoustic.mobile.push.sdk.api.db.SdkDatabaseQueryBuilder;
import co.acoustic.mobile.push.sdk.db.DbAdapter;
import co.acoustic.mobile.push.sdk.util.Logger;

import java.util.LinkedList;
import java.util.List;

public class JsonDbAdapter {
   private static final String TAG = "JsonDbAdapter";
    private static final int DATABASE_VERSION = 2;
    private static final String DATABASE_NAME = "json";

    public static final String CALLBACKS_TABLE = "callbacks";
    private static final String CALLBACK_ID_COL = "idcol";
    private static final String CALLBACK_NAME_COL = "name";
    private static final String CALLBACK_SUCCESS_COL = "success";
    private static final String CALLBACK_PARAMETER_COL = "parameter";

    private static final String CALLBACKS_TABLE_CREATE = "create table if not exists "+CALLBACKS_TABLE+" ("+CALLBACK_ID_COL+" integer primary key autoincrement, "+CALLBACK_NAME_COL+" text not null, "+CALLBACK_SUCCESS_COL+" integer, "+CALLBACK_PARAMETER_COL+" text)";




    private static DatabaseHelper instance;


    private static synchronized DatabaseHelper getHelper(Context context) {
        if (instance == null) {
            try {
                instance = new DatabaseHelper(context);
            } catch (Exception e) {
                Logger.e(TAG, "Failed to create json database helper", e);
                instance = null;
            }
        }
        return instance;
    }



    public static SdkDatabase getSQLiteDb(Context context)  {
        return getHelper(context).getWritableDatabase();
    }

    private JsonDbAdapter() {
    }

    public static class DatabaseHelper {
        protected SdkDatabaseOpenHelper databaseHelper;

        DatabaseHelper(Context context) {
            databaseHelper = DbAdapter.getDatabaseImpl(context).createOpenHelper(context, DATABASE_NAME, DATABASE_VERSION, new SdkDatabaseOpenHelper.LifeCycleListener() {
                @Override
                public void onCreate(SdkDatabase database) {
                    Logger.d(TAG, "Creating JSON database");
                    database.execSQL(CALLBACKS_TABLE_CREATE); // Create notification table
                }

                @Override
                public void onUpgrade(SdkDatabase database, int oldVersion, int newVersion) {
                    Logger.w(TAG, "Upgrading JSON database from version " + oldVersion + " to " + newVersion + ", which will destroy all old data");
                    database.execSQL("DROP TABLE IF EXISTS "+CALLBACKS_TABLE);
                    onCreate(database);
                }

                @Override
                public void onDowngrade(SdkDatabase database, int oldVersion, int newVersion) {

                }

                @Override
                public void onConfigure(SdkDatabase database) {

                }
            });
        }

        public SdkDatabase getWritableDatabase() {
            return databaseHelper.getWritableDatabase();
        }

        public SdkDatabaseQueryBuilder createQueryBuilder() {
            return databaseHelper.createQueryBuilder();
        }

    }

    static class ContentUriData {
        private final String authority;
        private static final String authoritySuffix = ".MCE_JSON_PROVIDER";

        ContentUriData(Context context) {
            authority = context.getPackageName() + authoritySuffix;
        }



        Uri getCallbacksURI() {
            return Uri.parse("content://" + authority + "/"+CALLBACKS_TABLE);
        }

        public String getAuthority() {
            return authority;
        }
    }

    public static void registerCallback(Context context, JsonCallbacksRegistry.RegisteredCallback callback) {
        try {
            Logger.d(TAG, "Adding callback {"+callback.getName()+", "+callback.isSuccess()+", "+callback.getParameterAsString()+"} to db");
            ContentValues values = new ContentValues();
            values.put(CALLBACK_NAME_COL, callback.getName());
            values.put(CALLBACK_SUCCESS_COL, callback.isSuccess() ? 1 : 0);
            values.put(CALLBACK_PARAMETER_COL, callback.getParameterAsString());

            context.getContentResolver().insert(new ContentUriData(context).getCallbacksURI(), values);
        } catch (Throwable th) {
            Logger.e(TAG,"Adding callback for "+callback.getName()+" to db failed",th);
        }
    }

    public static List<JsonCallbacksRegistry.RegisteredCallback> getRegisteredCallbacks(Context context, String name) {
        try {
            Logger.d(TAG, "Retrieving all callbacks for "+name+" from db");
            Cursor cursor = context.getContentResolver().query(
                    new ContentUriData(context).getCallbacksURI(),
                            new String[] { CALLBACK_ID_COL, CALLBACK_NAME_COL, CALLBACK_SUCCESS_COL, CALLBACK_PARAMETER_COL}, CALLBACK_NAME_COL+ "=?", new String[] {name}, null);
            if (cursor != null) {
                LinkedList<JsonCallbacksRegistry.RegisteredCallback> registeredCallbacks = new LinkedList<JsonCallbacksRegistry.RegisteredCallback>();
                cursor.moveToFirst();
                if (cursor.getCount() > 0) {
                    cursor.moveToFirst();
                    while (cursor.isAfterLast() == false) {
                        JsonCallbacksRegistry.RegisteredCallback callbak = new JsonCallbacksRegistry.RegisteredCallback(
                                cursor.getInt(0), // id
                                cursor.getString(1), // name
                                cursor.getInt(2) > 0, // success
                                cursor.getString(3) // parameter
                        );

                        registeredCallbacks.add(callbak);
                        cursor.moveToNext();
                    }
                }
                cursor.close();
                Logger.d(TAG, "All callbacks for "+name+" were retrieved successfully from db: "+registeredCallbacks.size());
                return registeredCallbacks;
            }
        } catch (Throwable th) {
            Logger.e(TAG,"Retrieving all callbacks for "+name+" from db failed",th);
        }
        return new LinkedList<JsonCallbacksRegistry.RegisteredCallback>();
    }

    public static void deleteCallbacks(Context context, List<JsonCallbacksRegistry.RegisteredCallback> callbacks) {
        try {
            Logger.d(TAG, "Retrieving "+callbacks.size()+" callbacks of "+callbacks.get(0).getName()+" from db");
            String inIdsCondition = CALLBACK_ID_COL+" IN (" + new String(new char[callbacks.size()-1]).replace("\0", "?,") + "?)";
            String[] ids = new String[callbacks.size()];
            for(int i=0; i<ids.length; ++i) {
                ids[i] = String.valueOf(callbacks.get(i).getId());
            }
            int deleted = context.getContentResolver().delete(new ContentUriData(context).getCallbacksURI(), inIdsCondition, ids);
            Logger.d(TAG, "Deleting " + deleted + " callbacks of " + callbacks.get(0).getName() + " from db succeeded");
        } catch (Throwable th) {
            Logger.e(TAG,"Deleting callbacks of "+callbacks.get(0).getName()+" from db failed",th);
        }

    }

}
