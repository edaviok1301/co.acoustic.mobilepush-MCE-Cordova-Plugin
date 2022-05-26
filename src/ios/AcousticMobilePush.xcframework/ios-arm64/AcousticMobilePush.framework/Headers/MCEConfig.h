/*
 * Copyright © 2014, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */


#if __has_feature(modules)
@import CoreLocation;
#else
#import <CoreLocation/CoreLocation.h>
#endif

/** MCEConfig provides the current configuration of the SDK. */
@interface MCEConfig : NSObject

/** This method returns the singleton object of this class. */
@property(class, nonatomic, readonly) MCEConfig * _Nonnull sharedInstance NS_SWIFT_NAME(shared);

/** This method allows you to configure the app with a NSDicionary instead of a MceConfig.json file */
+ (instancetype _Nonnull )sharedInstanceWithDictionary:(NSDictionary*_Nullable)dictionary;

/** sessionTimeout specifies how long sessions last. It can be specified in the MceConfig.json file. If it is not specified, it is 20 minutes by default. */
@property NSInteger sessionTimeout;

/** baseUrl specifies where the SDK connects to. It can be specified in the MceConfig.json file. If it is not specified, it is https://api.ibm.com by default. */
@property NSURL* _Nullable baseUrl;

/** appKey specifies the appKey that is currently in use. A devAppKey and prodAppKey can be specified in the MceConfig.json file and are automatically determined on launch, depending on the environment the app is running in.
 
 Note: This value may not be correct on Apple Watch, please use MCERegistrationDetails.sharedInstance.appKey instead.
 */
@property NSString* _Nullable appKey;

/** autoInitializeFlag specifies if the SDK should initialize itself automatically or wait until the MCESdk manualInitialization method is called. This could be helpful if you want to limit the registered users and channels in your database. If not specified, this value is TRUE. */
@property BOOL autoInitializeFlag;

/** autoInitializeLocationFlag specifies if the SDK should initialize the location services at first launch or wait until the MCESdk manualLocationInitialization method is called. */
@property BOOL autoInitializeLocationFlag;

/** appDelegateClass specifies the class that app delegate calls are forwarded to if you use the easy integration method. By default, it is not specified and does not forward calls that are not present in MceConfig.json. */
@property Class _Nullable appDelegateClass;

/** locationSyncRadius specifies the size of the reference region to sync from the server to the device. */
@property int locationSyncRadius;

/** locationSyncTimeout specifies the minimum frequently that the deivce can sync locations from the server. */
@property int locationSyncTimeout;

/** geofenceEnabled specifies if geofences are enabled in the config file. */
@property BOOL geofenceEnabled;

/** Are beacons enabled or not */
@property BOOL beaconEnabled;

/** Beacon UUID to search for */
@property NSUUID * _Nullable beaconUUID;

/** Location accuracy to set for location manager object */
@property CLLocationAccuracy geofenceAccuracy;

/** Name of user activity handoff activity name, used when the Apple Watch hands off actions to the iPhone paired with it. **/
@property NSString * _Nullable handoffUserActivityName;

/** Name of the interface controller used to let the user know that they will need to continue the action on their iPhone. **/
@property NSString * _Nullable handoffInterfaceController;

/** The name of the action cateory that is used to display dynamic watch notifications to the user. **/
@property NSString * _Nullable watchCategory;

/** A configuration flag that resets the userId and channelId to new values on reinstallation. **/
@property BOOL invalidateExistingUser;

/** A configuration flag writes databases to the iTunes file sharing location instead of private storage */
@property BOOL privateDatabaseStorage;

/** A configuration flag that determines if the databases are encrypted or not, the default value is true. */
@property BOOL databaseEncryption;

/** Database encryption key rotation frequency in day, the default value is 30 days. */
@property int databaseKeyRotationDays;

/** This configuration flag allows the SDK to register with the server when the registration has been invalidated when it is set to true. When it is false, the application should check the MCERegistrationDetails.sharedInstance.userInvalidated response and when true execute MCESdk.sharedInstance's manualInitialization method in order to register with the server again. */
@property BOOL autoReinitialize;

/** This configuration flag allows jailbroken devices to continue to initialize the SDK. If it is set to false, jailbroken devices will not be allowed. The default value is true. */
@property BOOL allowJailbrokenDevices;

@end

