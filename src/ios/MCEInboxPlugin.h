/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import <Cordova/CDVPlugin.h>
#import <AcousticMobilePush/MCEInAppTemplateRegistry.h>

@interface MCEInboxPlugin : CDVPlugin {
    
}
@property NSString * inboxCallback;

- (void) fetchInboxMessageViaRichContentId:(CDVInvokedUrlCommand*)command;
- (void) readMessageId:(CDVInvokedUrlCommand*)command;
- (void) deleteMessageId:(CDVInvokedUrlCommand*)command;
- (void) executeInboxAction: (CDVInvokedUrlCommand*)command;
- (void) fetchInboxMessageId: (CDVInvokedUrlCommand*)command;
- (void) setInboxMessagesUpdateCallback: (CDVInvokedUrlCommand*)command;
-(void)clearExpiredMessages:(CDVInvokedUrlCommand*)command;

@end

