/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

@import AcousticMobilePush;
#import "MCEInAppPlugin.h"
#import <Cordova/CDVCommandDelegate.h>
#import "MCEEventCallbackQueue.h"

@interface MCEInAppPlugin ()
@property NSMutableDictionary * inAppCallbacks;
@end

@implementation MCEInAppPlugin

- (void) syncInAppMessages: (CDVInvokedUrlCommand*)command {
    [NSNotificationCenter.defaultCenter addObserverForName:@"MCESyncDatabase" object:nil queue: NSOperationQueue.mainQueue usingBlock:^(NSNotification * _Nonnull note) {
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:result callbackId: command.callbackId];
    }];

    [[MCEInboxQueueManager sharedInstance] syncInbox];
}

// Only needed so we can conform to the MCEInAppTemplate protocol
+(void) registerTemplate { }

- (void) addInAppMessage: (CDVInvokedUrlCommand*)command {
    NSDictionary * inAppMessage = [command argumentAtIndex:0];
    [MCEInAppManager.sharedInstance processPayload: @{ @"inApp": inAppMessage }];
}

-(NSDictionary*)packageInAppMessage: (MCEInAppMessage*)inAppMessage
{
    return @{
             @"inAppMessageId": inAppMessage.inAppMessageId,
             @"maxViews": @(inAppMessage.maxViews),
             @"numViews": @(inAppMessage.numViews),
             @"template": inAppMessage.templateName,
             @"content": inAppMessage.content,
             @"triggerDate": @( [inAppMessage.triggerDate timeIntervalSince1970]*1000 ),
             @"expirationDate": @([inAppMessage.expirationDate timeIntervalSince1970]*1000 ),
             @"rules": inAppMessage.rules};
}

-(void)displayInAppMessage:(MCEInAppMessage*)message
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString * callback = self.inAppCallbacks[message.templateName];
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInAppMessage: message] ];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:callback];
    });
}

-(void)deleteInAppMessage: (CDVInvokedUrlCommand*)command
{
    NSString * inAppMessageId = [command argumentAtIndex:0];
    MCEInAppMessage * inAppMessage = [MCEInAppManager.sharedInstance inAppMessageById: inAppMessageId];
    [[MCEInAppManager sharedInstance] disable: inAppMessage];
}

-(void)registerInAppTemplate: (CDVInvokedUrlCommand*)command
{
    NSString * template = [command argumentAtIndex:0];
    [[MCEInAppTemplateRegistry sharedInstance] registerTemplate:template hander: self];
    self.inAppCallbacks[template] = command.callbackId;
}

-(void)executeInAppRule: (CDVInvokedUrlCommand*)command
{
    NSArray * rules = [command argumentAtIndex:0];
    [[MCEInAppManager sharedInstance] executeRule:rules];
}

-(void)executeInAppAction: (CDVInvokedUrlCommand*)command
{
    NSDictionary * action = [command argumentAtIndex:0];
    [[MCEActionRegistry sharedInstance] performAction:action forPayload:nil source: InAppSource];
}

- (void) sendMessageOpenedEvent: (CDVInvokedUrlCommand*)command
{
    NSString * inAppMessageId = [command argumentAtIndex:0];
    MCEInAppMessage * inAppMessage = [MCEInAppManager.sharedInstance inAppMessageById: inAppMessageId];
    if (inAppMessage != nil && inAppMessage.attribution != nil) {
        [[MCEEventService sharedInstance] recordViewForInAppMessage:inAppMessage attribution:inAppMessage.attribution mailingId:inAppMessage.mailingId];
    }
}

- (void)pluginInitialize
{
    self.inAppCallbacks = [NSMutableDictionary dictionary];
}

@end

