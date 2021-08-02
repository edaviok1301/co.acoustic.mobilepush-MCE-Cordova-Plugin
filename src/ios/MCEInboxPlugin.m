/*
 * Copyright © 2015, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import "MCEInboxPlugin.h"
#import <AcousticMobilePush/AcousticMobilePush.h>
#import <Cordova/CDVCommandDelegate.h>
#import <AcousticMobilePush/MCEInboxDatabase.h>

@implementation MCEInboxPlugin

-(void)executeInboxAction: (CDVInvokedUrlCommand*)command
{
    NSDictionary * action = [command argumentAtIndex:0];
    NSString * inboxMessageId = [command argumentAtIndex:1];
    MCEInboxMessage *inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    NSDictionary * payload = @{@"mce":@{@"attribution":inboxMessage.attribution}};
    NSDictionary * attributes = @{@"richContentId": inboxMessage.richContentId, @"inboxMessageId": inboxMessage.inboxMessageId} ;
    [[MCEActionRegistry sharedInstance] performAction:action forPayload:payload source: InboxSource attributes:attributes];
}

-(void)setInboxMessagesUpdateCallback: (CDVInvokedUrlCommand*)command
{
    self.inboxCallback = command.callbackId;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(retrieveInboxMessages:) name:@"MCESyncDatabase" object:nil];
    [self retrieveInboxMessages: command];
}

-(void)fetchInboxMessageId: (CDVInvokedUrlCommand*)command
{
    NSString* inboxMessageId = [command argumentAtIndex:0];
    
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    if(inboxMessage)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInboxMessage: inboxMessage] ];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        });
    }
    else
    {
        [MCEInboxQueueManager.sharedInstance getInboxMessageId: inboxMessageId completion:^(MCEInboxMessage *message, NSError *error) {
            if(message)
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: [self packageInboxMessage: message] ];
                    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
                });
            }
        }];
    }
}

-(NSDictionary*)packageInboxMessage:(MCEInboxMessage*)message
{
    NSMutableDictionary * dictionary = [@{ @"inboxMessageId": message.inboxMessageId, @"isRead": @(message.isRead), @"isDeleted": @(message.isDeleted), @"expirationDate": @([message.expirationDate timeIntervalSince1970]*1000),  @"sendDate": @([message.sendDate timeIntervalSince1970]*1000), @"template": message.templateName, @"content": message.content } mutableCopy];
    
    if(message.richContentId) {
        dictionary[@"richContentId"] = message.richContentId;
    }
    if(message.attribution) {
        dictionary[@"attribution"] = message.attribution;
    }
    if(message.mailingId) {
        dictionary[@"mailingId"] = message.mailingId;
    }
    return dictionary;
}

-(void)fetchInboxMessageViaRichContentId:(CDVInvokedUrlCommand*)command;
{
    NSString* richContentId = [command argumentAtIndex:0];
    
    MCEInboxMessage *inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithRichContentId:richContentId];
    if(!inboxMessage)
    {
        NSLog(@"An error occured while getting the rich content");
        return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self packageInboxMessage:inboxMessage]];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    });
}

-(void)readMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    inboxMessage.isRead=TRUE;
}
-(void)deleteMessageId:(CDVInvokedUrlCommand*)command
{
    NSString * inboxMessageId = [command argumentAtIndex:0];
    MCEInboxMessage * inboxMessage = [[MCEInboxDatabase sharedInstance] inboxMessageWithInboxMessageId:inboxMessageId];
    inboxMessage.isDeleted=TRUE;
}

-(void)sendInboxMessages:(NSArray*)messages
{
    NSMutableArray * simpleMessages = [NSMutableArray array];
    for (MCEInboxMessage * message in messages) {
        [simpleMessages addObject: [self packageInboxMessage: message]];
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult * result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:simpleMessages];
        result.keepCallback = @TRUE;
        [self.commandDelegate sendPluginResult:result callbackId:self.inboxCallback];
    });
}

-(void)syncInboxMessages:(CDVInvokedUrlCommand*)command
{
    [[MCEInboxQueueManager sharedInstance] syncInbox];
}

-(void)retrieveInboxMessages:(CDVInvokedUrlCommand*)command
{
    NSArray * inboxMessages = [[MCEInboxDatabase sharedInstance] inboxMessagesAscending:TRUE];
    if(!inboxMessages)
    {
        NSLog(@"Could not fetch inbox messages");
        return;
    }
    [self sendInboxMessages:inboxMessages];
}

-(void)clearExpiredMessages:(CDVInvokedUrlCommand*)command {
    [MCEInboxDatabase.sharedInstance clearExpiredMessages];
}

@end

