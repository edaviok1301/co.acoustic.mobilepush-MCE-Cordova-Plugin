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

@class MCEResultSet;

/** The MCEInAppMessage class represents a single in app message. */
@interface MCEInAppMessage : NSObject

/** The inAppMessageId property is a unique identifier for in app messages. */
@property NSString * inAppMessageId;

/** The maxViews property defines the maxiumum number of times a message can be viewed, after which it is deleted. */
@property NSInteger maxViews;

/** The numViews property defines the current view count for a message. */
@property NSInteger numViews;

/** The template property defines the registered template that displays this message. */
@property NSString * templateName;

/** The content property defines the content of the message. Its structure and values are defined by the developer of the template that displays the message. */
@property NSDictionary * content;

/** The triggerDate property defines when the message can be initially displayed to the user. After this date, the message is displayed in listings of available messages. Before this date, the message is not displayed in listings of available messages. */
@property NSDate * triggerDate;

/** The expirationDate property defines the availability end date for displaying the message. After the date, the message is not displayed in listings of available messages. */
@property NSDate * expirationDate;

/** The rules property defines the specific keyword rules that contain this message. */
@property NSArray * rules;

/** The attribution property represents the attribution from the original push message. */
@property NSString * attribution;

/** The mailingId property represents the mailingId from the original push message. */
@property id mailingId;

/** The inAppMessageFromResultSet: method allocates and constructs a MCEInAppMessage object from a database result set. 
 
 @param resultSet The resultSet parameter is a database result set object from the inAppMessage table.
 @return Returns a fully allocated and initialized MCEInAppMessage object.
 */
+ (instancetype) inAppMessageFromResultSet: (MCEResultSet*) resultSet;

/** The initFromResultSet: method constructs a MCEInAppMessage object from a database result set. 
 
 @param resultSet The resultSet parameter is a database result set object from the inAppMessage table.
 @return Returns a fully initialized MCEInAppMessage object.
 */
- (instancetype) initFromResultSet: (MCEResultSet*) resultSet;

/** The inAppMessageWithPayload: method allocates and constructs a MCEInAppMessage object from a APNS payload. 
 
 @param payload An APNS payload containing an MCEInAppMessage definition.
 @return Returns a fully allocatated and initialized MCEInAppMessage object.
 */
+ (instancetype) inAppMessageWithPayload: (NSDictionary*) payload;

/** The initWithPayload: method constructs a MCEInAppMessage object from a APNS payload. 

 @param payload An APNS payload containing an MCEInAppMessage definition.
 @return Returns a fully initialized MCEInAppMessage object.
 */
- (instancetype) initWithPayload: (NSDictionary*) payload;

/** The rulesData method returns the rules property as an NSData object for archiving. 
 
 @return Returns an NSData object representing the rules array.
 */
- (NSData*) rulesData;

/** The contentData method returns the content property as an NSData object for archiving. 

 @return Returns an NSData object representing the content dictionary.
 */
- (NSData*) contentData;

/** The execute method queries the MCEInAppTemplateRegistry for a template to display the in-app message and tells the template object to display the message. It returns TRUE if it is finds a template object to display the message and FALSE otherwise. */
- (BOOL) execute;

/** The isExpired method returns TRUE if the current date is greater than the expirationDate property value and FALSE otherwise. */
- (BOOL) isExpired;

/** The isOverViewed method returns TRUE if the numViews property is larger or equal to the maxViews property and FALSE otherwise. */
- (BOOL) isOverViewed;

/** The isTriggered method returns TRUE if the current date is greater than the triggerDate property value and FALSE otherwise. */
- (BOOL) isTriggered;

@end
