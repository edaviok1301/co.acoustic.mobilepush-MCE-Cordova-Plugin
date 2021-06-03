/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import "MCEEventCallbackQueue.h"

@interface MCEEventCallbackQueue()
@property NSOperationQueue *serialQueue;
@end

@implementation MCEEventCallbackQueue

+ (instancetype)sharedInstance
{
    static id sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

-(instancetype)init
{
    if(self=[super init])
    {
        self.serialQueue = [[NSOperationQueue alloc] init];
        [self.serialQueue setMaxConcurrentOperationCount:1];
    }
    return self;
}

-(void) queueEvents: (NSArray*)events error: (NSString*)error
{
    [self.serialQueue addOperationWithBlock:^{
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        NSMutableArray * eventCallbackQueue = [[defaults objectForKey:@"eventCallbackQueue"] mutableCopy];
        
        NSMutableArray * dictionaryEvents = [NSMutableArray array];
        for (MCEEvent * event in events)
        {
            [dictionaryEvents addObject:[event toDictionary]];
        }
        
        NSMutableDictionary * item = [NSMutableDictionary dictionary];
        item[@"events"] = dictionaryEvents;
        if(error)
        {
            item[@"error"]=error;
        }
        
        [defaults setObject:eventCallbackQueue forKey:@"eventCallbackQueue"];
        [defaults synchronize];
    }];
}

-(void) queueEvents: (NSArray*)events
{
    [self queueEvents:events error:nil];
}

-(void) dequeueWithCallback: (void (^)(NSArray * events, NSString * error))callbackBlock
{
    [self.serialQueue addOperationWithBlock:^{
        NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
        NSMutableArray * eventCallbackQueue = [[defaults objectForKey:@"eventCallbackQueue"] mutableCopy];
        NSDictionary * item = [eventCallbackQueue lastObject];
        
        NSMutableArray * events = [NSMutableArray array];
        for(NSDictionary * eventDict in item[@"events"])
        {
            MCEEvent * event = [[MCEEvent alloc]init];
            [event fromDictionary:eventDict];
            [events addObject:event];
        }
        callbackBlock(events, item[@"error"]);
        
        [eventCallbackQueue removeLastObject];
        [defaults setObject:eventCallbackQueue forKey:@"eventCallbackQueue"];
        [defaults synchronize];
    }];
}

@end
