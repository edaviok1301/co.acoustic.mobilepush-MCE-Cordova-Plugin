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
@import Foundation;
#else
#import <Foundation/Foundation.h>
#endif

@class MCETaskQueue;
@class MCEEvent;
@class MCEInboxMessage;
@class MCEInAppMessage;

/** The MCEEventService class allows the developer to queue events to the server. If errors occur the update will retry automatically and back-off as needed. */

@interface MCEEventService : NSObject

/** This method returns the singleton object of this class. */
@property(class, nonatomic, readonly) MCEEventService * _Nonnull sharedInstance NS_SWIFT_NAME(shared);

/** The addEvent:immediate: method is used to add an event to the event queue and optionally flush the queue.
 
 @param event An instance of MCEEvent to be added to the event queue
 @param immediate When set to TRUE, the queue is flushed immediately, sending all events queued.
*/
- (void) addEvent: (MCEEvent * _Nonnull) event immediate:(BOOL) immediate;

/** The sendEvents method flushes the queue to the server on demand. */
- (void) sendEvents;

/** Record a view of an inbox message
 @param inboxMessage An MCEInboxMessage object to record view for
 @param attribution A string representing the campaign name or attribution of the push message associated with the view event.
 
 Please note that recordViewForInboxMessage:attribution: is deprecated, please use recordViewForInboxMessage:attribution:mailingId: instaed.
 */
-(void)recordViewForInboxMessage:(MCEInboxMessage * _Nonnull)inboxMessage attribution: (NSString * _Nullable)attribution __attribute__ ((deprecated));

/** Record a view of an inbox message including a mailing id
 @param inboxMessage An MCEInboxMessage object to record view for
 @param attribution A string representing the campaign name or attribution of the push message associated with the view event.
 @param mailingId A string representing the mailing id of the push message associated with the view event.
 */
-(void)recordViewForInboxMessage:(MCEInboxMessage * _Nonnull)inboxMessage attribution: (NSString * _Nullable)attribution mailingId: (NSNumber * _Nullable)mailingId;

/** Record a view of an inApp message
 @param inboxMessage An MCEInAppMessage object to record view for
 @param attribution A string representing the campaign name or attribution of the push message associated with the view event.
 
 Please note that recordViewForInboxMessage:attribution: is deprecated, please use recordViewForInboxMessage:attribution:mailingId: instaed.
 */
-(void)recordViewForInAppMessage:(MCEInAppMessage * _Nonnull)inAppMessage attribution: (NSString * _Nullable)attribution __attribute__ ((deprecated));

/** Record a view of an inApp message including a mailing id
 @param inAppMessage An MCEInAppMessage object to record view for
 @param attribution A string representing the campaign name or attribution of the push message associated with the view event.
 @param mailingId A string representing the mailing id of the push message associated with the view event.
 */
-(void)recordViewForInAppMessage:(MCEInAppMessage * _Nonnull)inAppMessage attribution: (NSString * _Nullable)attribution mailingId: (NSNumber * _Nullable)mailingId;

#if TARGET_OS_WATCH == 0
/** Record if push is enabled or disabled */
-(void) sendPushEnabledEvent;
#endif

@end
