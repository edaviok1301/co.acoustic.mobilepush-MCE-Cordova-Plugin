/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import "MCEPlugin.h"
#import <AcousticMobilePush/AcousticMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import "AppDelegate+MCE.h"
#import "MCEEventCallbackQueue.h"

@interface MCEPlugin ()
@property CLLocationManager * locationManager;
@property NSMutableDictionary * actionCallbacks;
@property NSMutableDictionary * categoryCallbacks;
@property MCEAttributesQueueManager * attributeQueue;
@property NSDateFormatter *rfc3339DateFormatter;
@end

@implementation MCEPlugin

- (void) setActionNotRegisteredCallback:(CDVInvokedUrlCommand*)command {
    NSNumber * state = [command argumentAtIndex:0];
    if([state boolValue]) {
        self.actionNotRegistered = command.callbackId;
    } else {
        self.actionNotRegistered = nil;
    }
}

- (void) setActionNotYetRegisteredCallback:(CDVInvokedUrlCommand*)command {
    NSNumber * state = [command argumentAtIndex:0];
    if([state boolValue]) {
        self.actionNotYetRegistered = command.callbackId;
    } else {
        self.actionNotYetRegistered = nil;
    }
}

- (void) sendActionNotYetRegistered:(NSDictionary*)details {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: @[ details[@"type"] ] ];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.actionNotYetRegistered];
}

- (void) sendActionNotRegistered:(NSDictionary*)details {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: @[ details[@"type"] ] ];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.actionNotRegistered];
}

-(void) manualInitialization:(CDVInvokedUrlCommand*)command
{
    [MCESdk.sharedInstance manualInitialization];  
    self.locationManager = [[CLLocationManager alloc]init];  
    [self.locationManager  requestAlwaysAuthorization];
    [self.locationManager requestWhenInUseAuthorization];
    //[self.locationManager startUpdatingLocation];
}

- (void) phoneHome: (CDVInvokedUrlCommand*)command;
{
    [MCEPhoneHomeManager forcePhoneHome];
}

-(NSArray*)packageEvents: (NSArray*)events
{
    NSMutableArray * results = [NSMutableArray array];
    for (MCEEvent * event in events) {
        NSMutableDictionary * eventDictionary = [[event toDictionary] mutableCopy];
        eventDictionary[@"timestamp"] = [self.rfc3339DateFormatter stringFromDate: eventDictionary[@"timestamp"]];
        [results addObject: eventDictionary];
    }
    return results;
}

-(void)sendRegistration
{
    [self sendRegistrationDetails:self.registrationCallbacks];
}

-(void)sendAttributeSuccess:(NSDictionary*)dictionary
{
    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.attributeCallback];
}

-(void)sendAttributeFailure: (NSDictionary*)dictionary
{
    NSMutableDictionary * mutableDict = [dictionary mutableCopy];
    NSError * error = mutableDict[@"error"];
    if(error && [error isKindOfClass:NSError.class]) {
        mutableDict[@"error"] = [error localizedDescription];
    }
    
    mutableDict[@"attributes"] = [mutableDict[@"attributes"] mutableCopy];
    for(NSString * key in mutableDict[@"attributes"]) {
        NSDate * value = mutableDict[@"attributes"][key];
        if(value && [value isKindOfClass:NSDate.class]) {
            mutableDict[@"attributes"][key] = @{ @"mcedate": @( value.timeIntervalSince1970 * 1000 ) };
        }
    }
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:mutableDict];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.attributeCallback];
}

-(void)sendEventSuccess:(NSArray*)events
{
    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:[self packageEvents: events]];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.eventCallback];
}

-(void)sendEventFailure:(NSArray*)events error: (NSString*)error
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:@{@"events":[self packageEvents: events], @"error":error}];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:self.eventCallback];
}

- (void)pluginInitialize
{
    [super pluginInitialize];
    self.actionCallbacks = [NSMutableDictionary dictionary];
    self.categoryCallbacks = [NSMutableDictionary dictionary];
    self.attributeQueue = [[MCEAttributesQueueManager alloc] init];
    
    self.rfc3339DateFormatter = [[NSDateFormatter alloc] init];
    NSLocale *enUSPOSIXLocale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"];
    
    [self.rfc3339DateFormatter setLocale:enUSPOSIXLocale];
    [self.rfc3339DateFormatter setDateFormat:@"yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'SSS'Z'"];
    [self.rfc3339DateFormatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];
    
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    [appDelegate setPlugin:self];
}


-(void)dealloc
{
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    [appDelegate setPlugin:nil];
}
-(BOOL)executeCategoryCallback:(NSDictionary*)response
{
    NSString * categoryName = response[@"payload"][@"aps"][@"category"];
    NSString * callback = self.categoryCallbacks[categoryName];
    NSLog(@"category callback: %@", callback);
    if(callback)
    {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:response];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
        
        return TRUE;
    }
    return FALSE;
}

// arguments categoryName, arrayOfActions
// arrayOfActions contains objects in format {"destructive":true/false, "authentication":true/false, "name": "the button string", "identifier": "an identifier for later use"}
-(void)setCategoryCallbacksCommand: (CDVInvokedUrlCommand*)command
{
    Class MutableUserNotificationAction = NSClassFromString(@"UIMutableUserNotificationAction");
    Class MutableUserNotificationCategory = NSClassFromString(@"UIMutableUserNotificationCategory");
    
    if(!MutableUserNotificationAction)
    {
        return;
    }
    
    // Register category name in user defaults
    NSString * categoryName = [command argumentAtIndex:0];
    NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
    NSMutableSet * categoryRegistry = [NSMutableSet setWithArray: [defaults arrayForKey: @"categoryRegistry"]];
    if(!categoryRegistry)
        categoryRegistry = [NSMutableSet set];
    [categoryRegistry addObject:categoryName];
    [defaults setObject:[categoryRegistry allObjects] forKey:@"categoryRegistry"];
    
    // Register callback in callbacks mapping
    self.categoryCallbacks[categoryName] = command.callbackId;
    
    // Register Category with OS
    UIUserNotificationSettings * currentSettings = [[UIApplication sharedApplication] currentUserNotificationSettings];
    NSMutableSet * categories = [currentSettings.categories mutableCopy];
    UIUserNotificationCategory * removeCategory = nil;
    for (UIUserNotificationCategory * category in categories) {
        if([category.identifier isEqual: categoryName])
        {
            removeCategory = category;
        }
    }
    if(removeCategory)
    {
        [categories removeObject:removeCategory];
    }
    
    id mceTempCategory = [[MutableUserNotificationCategory alloc] init];
    [mceTempCategory setIdentifier: categoryName];
    
    NSArray * actionDicts = [command argumentAtIndex:1];
    NSMutableArray * actions = [NSMutableArray array];
    for (NSDictionary * actionDict in actionDicts) {
        id action = [[MutableUserNotificationAction alloc] init];
        if(!actionDict[@"destructive"] || ![actionDict[@"destructive"] isKindOfClass:[NSNumber class]])
        {
            NSLog(@"Undefined destructive flag for action %@", actionDict);
            return;
        }
        [action setDestructive:[actionDict[@"destructive"] boolValue] ];
        
        if(!actionDict[@"authentication"] || ![actionDict[@"authentication"] isKindOfClass:[NSNumber class]])
        {
            NSLog(@"Undefined authentication flag for action %@", actionDict);
            return;
        }
        [action setAuthenticationRequired: [actionDict[@"authentication"] boolValue]];
        
        [action setActivationMode: UIUserNotificationActivationModeForeground];
        [action setTitle: actionDict[@"name"]];
        [action setIdentifier: actionDict[@"identifier"]];
        [actions addObject: action];
    }
    [mceTempCategory setActions:actions forContext:UIUserNotificationActionContextDefault];
    [mceTempCategory setActions:actions forContext:UIUserNotificationActionContextMinimal];
    
    [categories addObject: mceTempCategory];
    UIUserNotificationSettings * newSettings = [UIUserNotificationSettings settingsForTypes:currentSettings.types categories:categories];
    [[UIApplication sharedApplication] registerUserNotificationSettings: newSettings];
    
    // Look for backlog of callbacks
    [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"queuedCategories" withBlock:^(NSArray*responses, NSArray*ids){
        NSLog(@"%lu queued Categories", (unsigned long)[responses count]);
        if([responses count])
        {
            NSMutableArray * deleteIds = [NSMutableArray array];
            for(int i=0; i<[responses count];i++)
            {
                NSDictionary * response = responses[i];
                if([response[@"payload"][@"aps"][@"category"] isEqual: categoryName])
                {
                    [self executeCategoryCallback: response];
                    [deleteIds addObject: ids[i]];
                }
                
            }
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:deleteIds];
            });
        }
    }];
}

// Arguments: type
-(void)setRegisteredActionCallback:(CDVInvokedUrlCommand*)command {
    // replacing NSUserDefaults actionRegistry
    NSString * type = [command argumentAtIndex:0];
    NSNumber * state = [command argumentAtIndex:1];
    
    AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
    if([state boolValue]) {
        self.actionCallbacks[type] = command.callbackId;
        [[MCEActionRegistry sharedInstance] registerTarget:appDelegate withSelector:@selector(action:payload:) forAction:type];
    } else {
        [self.actionCallbacks removeObjectForKey: type];
        [[MCEActionRegistry sharedInstance] registerTarget:nil withSelector:nil forAction:type];
    }
}

-(void)unregisterActionCallback:(CDVInvokedUrlCommand*)command {
    // replacing NSUserDefaults actionRegistry
    NSString * type = [command argumentAtIndex:0];
    
    [[MCEActionRegistry sharedInstance] unregisterAction: type];
    [self.actionCallbacks removeObjectForKey:type];
}

-(BOOL)executeActionCallback:(NSDictionary*)action payload: (NSDictionary*)payload
{
    NSString * type = action[@"type"];
    NSString * callback = self.actionCallbacks[type];
    if(callback)
    {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:@[action, payload]];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
        
        return TRUE;
    }
    return FALSE;
}

// Arguments: successCallback, errorCallback
- (void)setRegistrationCallback:(CDVInvokedUrlCommand*)command
{
    NSNumber * state = [command argumentAtIndex:0];
    
    if([state boolValue]) {
        self.registrationCallbacks = command.callbackId;
        
        AppDelegate * appDelegate = [[UIApplication sharedApplication]delegate];
        if([appDelegate needsRegistration])
        {
            [self sendRegistration];
            [appDelegate setNeedsRegistration:FALSE];
        }
    } else {
        self.registrationCallbacks = nil;
    }
}

// Arguments: successCallback, errorCallback
- (void)setEventQueueCallbacks:(CDVInvokedUrlCommand*)command
{
    NSNumber * state = [command argumentAtIndex:0];
    
    if([state boolValue]) {
        self.eventCallback = command.callbackId;
        
        [[MCEEventCallbackQueue sharedInstance] dequeueWithCallback: ^(NSArray * events, NSString * error){
            if(error) {
                [self sendEventFailure:events error: error];
            } else {
                [self sendEventSuccess:events];
            }
        }];
    } else {
        self.eventCallback = nil;
    }
}

// Arguments: successCallback, errorCallback
- (void)setAttributeQueueCallbacks:(CDVInvokedUrlCommand*)command
{
    NSNumber * state = [command argumentAtIndex:0];
    if([state boolValue]) {
        self.attributeCallback = command.callbackId;
        
        [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"attributeSuccess" withBlock:^(NSArray*dictionaries, NSArray*ids){
            if([dictionaries count])
            {
                for (NSDictionary * dictionary in dictionaries) {
                    [self sendAttributeSuccess: dictionary];
                }
                dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                    [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:ids];
                });
            }
        }];
        
        [[MCECallbackDatabaseManager sharedInstance] selectCallbacks: @"attributeFailure" withBlock:^(NSArray*dictionaries, NSArray*ids){
            if([dictionaries count])
            {
                for (NSDictionary * dictionary in dictionaries) {
                    [self sendAttributeFailure: dictionary];
                }
                dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                    [[MCECallbackDatabaseManager sharedInstance] deleteCallbacksById:ids];
                });
            }
        }];
    } else {
        self.attributeCallback = nil;
    }
}

- (void)getSdkVersion:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[[MCESdk sharedInstance] sdkVersion]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getBadge:(CDVInvokedUrlCommand*)command
{
    NSInteger badge = [[UIApplication sharedApplication] applicationIconBadgeNumber];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)badge];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getRegistrationDetails:(CDVInvokedUrlCommand*)command
{
    [self sendRegistrationDetails:command.callbackId];
}

- (void)sendRegistrationDetails:(id)callbackId
{
    NSMutableDictionary * details = [NSMutableDictionary dictionary];
    if(MCERegistrationDetails.sharedInstance.userId)
    {
        details[@"userId"] = MCERegistrationDetails.sharedInstance.userId;
    }
    if(MCERegistrationDetails.sharedInstance.channelId)
    {
        details[@"channelId"] = MCERegistrationDetails.sharedInstance.channelId;
    }
    if(MCERegistrationDetails.sharedInstance.pushToken)
    {
        details[@"deviceToken"] = [MCEApiUtil deviceToken: MCERegistrationDetails.sharedInstance.pushToken];
    }
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: details ];
    result.keepCallback = @TRUE;
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

- (void)getAppKey:(CDVInvokedUrlCommand*)command
{
    MCEConfig * config = [[MCESdk sharedInstance] config];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:config.appKey];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isRegistered:(CDVInvokedUrlCommand*)command
{
    NSNumber * acousticRegistered = [NSNumber numberWithBool: MCERegistrationDetails.sharedInstance.mceRegistered];
    NSNumber * providerRegistered = [NSNumber numberWithBool: MCERegistrationDetails.sharedInstance.apsRegistered];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsMultipart:@[ acousticRegistered, providerRegistered, @"APNS"]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(NSDictionary *)checkForDateAttribute:(CDVInvokedUrlCommand*)command {
    NSMutableDictionary * attributes = [[command argumentAtIndex:0] mutableCopy];
    for (NSString * key in attributes) {
        NSDictionary * value = attributes[key];
        if(value && [value isKindOfClass:NSDictionary.class]) {
            NSNumber * mceDate = value[@"mcedate"];
            if(mceDate && [mceDate respondsToSelector:@selector(integerValue)]) {
                attributes[key] = [NSDate dateWithTimeIntervalSince1970:[mceDate integerValue] / 1000];
            }
        }
    }
    return attributes;
}


// Arguments attributeKeysArray
- (void)queueDeleteUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSArray * keys = [command argumentAtIndex:0];
    [self.attributeQueue deleteUserAttributes: keys];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments attributesArray
- (void)queueUpdateUserAttributes:(CDVInvokedUrlCommand*)command
{
    NSDictionary * attributes = [self checkForDateAttribute: command];
    [self.attributeQueue updateUserAttributes: attributes];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments: type, name, timestamp, attributes, attribution, immediate
- (void)queueAddEvent:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary * eventDictionary = [[command argumentAtIndex:0] mutableCopy];
    if(eventDictionary[@"timestamp"])
        eventDictionary[@"timestamp"] = [NSDate dateWithTimeIntervalSince1970: [eventDictionary[@"timestamp"] doubleValue]/1000];;
    
    MCEEvent * event = [[MCEEvent alloc]init];
    [event fromDictionary:eventDictionary];
    
    NSNumber * immediate = [command argumentAtIndex:1];
    if(!immediate)
        immediate=@YES;
    [[MCEEventService sharedInstance] addEvent: event immediate: [immediate boolValue]];
}

// Arguments badge
- (void)setBadge:(CDVInvokedUrlCommand*)command
{
    id version = [command argumentAtIndex: 0];
    int intVersion = [version intValue];
    UIApplication * app = [UIApplication sharedApplication];
    app.applicationIconBadgeNumber = intVersion;
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

// Arguments icon
- (void)setIcon:(CDVInvokedUrlCommand*)command
{
    NSLog(@"setIcon unimplemented in iOS");
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"unimplemented in iOS"];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) safeAreaInsets: (CDVInvokedUrlCommand*)command {
    if (@available(iOS 11.0, *)) {
        UIEdgeInsets insets = UIApplication.sharedApplication.keyWindow.safeAreaInsets;
        NSNumber * topInset = insets.top > 20 ? @(insets.top) : @20;
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{@"top": topInset, @"bottom": @(insets.bottom), @"left": @(insets.left), @"right": @(insets.right)}];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    } else {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: @{@"top": @20, @"bottom": @0, @"left": @0, @"right": @0}];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }
}

- (void) userInvalidated: (CDVInvokedUrlCommand*)command {
    BOOL userInvalidated = MCERegistrationDetails.sharedInstance.userInvalidated;
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool: userInvalidated];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end

void sendAttributeCallback(NSString* callback, NSError*error, id <CDVCommandDelegate> delegate)
{
    if(callback)
    {
        CDVPluginResult* result = nil;
        if(error)
        {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString: error.description];
        }
        else
        {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }
        result.keepCallback = @TRUE;
        [delegate sendPluginResult:result callbackId:callback];
    }
}


