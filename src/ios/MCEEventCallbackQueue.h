/*
 * Copyright © 2011, 2019 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 */

#import <AcousticMobilePush/AcousticMobilePush.h>

@interface MCEEventCallbackQueue : NSObject

+ (instancetype)sharedInstance;
-(void) queueEvents: (NSArray*)events error: (NSString*)error;
-(void) queueEvents: (NSArray*)events;
-(void) dequeueWithCallback: (void (^)(NSArray * events, NSString * error))callbackBlock;
    
@end
