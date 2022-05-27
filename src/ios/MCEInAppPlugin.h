/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import <Cordova/CDVPlugin.h>
#import <AcousticMobilePush/MCEInAppTemplateRegistry.h>

@interface MCEInAppPlugin : CDVPlugin <MCEInAppTemplate> {
    
}

- (void) deleteInAppMessage: (CDVInvokedUrlCommand*)command;
- (void) executeInAppAction: (CDVInvokedUrlCommand*)command;
- (void) registerInAppTemplate: (CDVInvokedUrlCommand*)command;
- (void) executeInAppRule:(CDVInvokedUrlCommand*)command;
- (void) addInAppMessage: (CDVInvokedUrlCommand*)command;
- (void) syncInAppMessages: (CDVInvokedUrlCommand*)command;
- (void) sendMessageOpenedEvent: (CDVInvokedUrlCommand*)command;
@end
