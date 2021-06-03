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
@import UIKit;
#else
#import <UIKit/UIKit.h>
#endif

/** This protocol defines the optional method that is used to configure alert fields in text entry actions. */
@protocol MCEActionProtocol <NSObject>
@optional

/** This method defines the optional method that is used to configure alert fields in text entry actions.
@param textField The UITextField object to be configured.
 */
-(void)configureAlertTextField:(UITextField*)textField;
@end

/** The MCEActionRegistry class is used to register and perform actions in the "notification-action" and "category-actions" sections of the APNS payload.
 */
@interface MCEActionRegistry : NSObject

/** This method returns the singleton object of this class. */
@property(class, nonatomic, readonly) MCEActionRegistry * sharedInstance NS_SWIFT_NAME(shared);

/** Method is deprecated, please do not use.
 
 This method returns true if the action registered for the specified action type expects user text input.
 @param action The name of the action registered.
 @return TRUE or FALSE depending if the action expects user text input.
 */
-(BOOL)actionIncludesUserText:(NSString*)action __attribute__((deprecated));

/** Method is deprecated, please do not use.
 
 This method calls the registered action handler's configureAlertTextField method.
 @param textField The UITextField object to be configured
 @param action The name of the action registered.
 */
-(void)configureAlertTextField:(UITextField*)textField forAction:(NSString*)action __attribute__((deprecated));

/** This method is used to register an object to receive action messages for a specified action type name.
 
 @param target the object that will accept action messages
 @param selector a selector that processes the action, can either take one or two arguments. The first argument is always the action payload and the second, if included is the full APNS payload.
 @param type action the specified action type name to be used in the APNS payload as the type value
 
 @return TRUE or FALSE depending if the registration was successful or not.
 
 */
-(BOOL)registerTarget:(NSObject <MCEActionProtocol> *)target withSelector:(SEL)selector forAction:(NSString*)type;

/** This method removes the registration for handling a specified action type name.
 
 @param type action the specified action type name to be used in the APNS payload as the type value
 */
-(void)unregisterAction:(NSString*)type;

/** Method is deprecated, please use -performAction:forPayload:source:attributes:userText: instead. */
-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source __attribute__((deprecated));

/** Method is deprecated, please use -performAction:forPayload:source:attributes:userText: instead. */
-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source attributes: (NSDictionary*)attributes __attribute__((deprecated));

/** Method is deprecated, please use -performAction:forPayload:source:attributes:userText: instead. */
-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source userText: (NSString*)userText __attribute__((deprecated));

/** This method performs the registered specified action for the APNS payload.
 
 @param action the action dictionary to be executed. (either the "notification-action" or one of the "category-actions")
 @param payload the full APNS payload
 @param source the event type value to report
 @param attributes Additional attributes for event payload
 @param userText Text entered by the user
 */

-(void)performAction:(NSDictionary*)action forPayload:(NSDictionary*)payload source: (NSString*) source attributes:(NSDictionary*)attributes userText: (NSString*)userText;

/** Method is deprecated, please do not use. 
 
 This method allows the action plugins to specifiy if they want the user prompted for text input if it isn't provided by the standard text input push method.
 
 @param action the action dictionary to be evaluated. (either the "notification-action" or one of the "category-actions")
 
 @return TRUE or FALSE depending if the action plugin wants the user to be prompted for text input if it wasn't provided otherwise.
*/
-(BOOL)actionExpectsUserText:(NSDictionary*)action __attribute__((deprecated));

@end
