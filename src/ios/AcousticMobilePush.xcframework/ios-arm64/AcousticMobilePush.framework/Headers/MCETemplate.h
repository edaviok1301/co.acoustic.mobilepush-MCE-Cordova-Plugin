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

@class MCEInboxMessage;

/** The MCETemplateDisplay protocol must be implemented by UIViewControllers to display full page content of inbox messages. */
@protocol MCETemplateDisplay

/** This object is assigned to the inboxMessage that should be displayed by the inbox template */
@property MCEInboxMessage * inboxMessage;

/** Update the view to show the MCEInboxMessage assigned.
 */
-(void)setContent;

/** The setLoading method is used to empty the view controller's display and enable any sort of activity indicators until the message content is delivered. */
-(void)setLoading;

@end

/** The MCETemplatePreview protocol must be implemented by UITableViewCells to display the preview content of an inbox message. UITableViewCells should also implement prepareForReuse and awakeFromNib methods to clear their contents before the message contents are available. */
@protocol MCETemplatePreview

/** The setRichContent:inboxMessage: method is used to set the current rich content and inbox message values that the UITableViewCell should display.
 
 @param inboxMessage The MCEInboxMessage object that represents a single message in the inbox.
 */

-(void)setInboxMessage:(MCEInboxMessage *)inboxMessage;

@end

/** The MCETemplate protocol is required to implement the template class. It provides the UIViewController and UITableViewCells to display the content of inbox messages. */
@protocol MCETemplate

/** The displayViewController method returns a UIViewController that implements the MCETemplateDisplay protocol that displays a single message on a full screen.
 
 @return Returns a UIViewController that implements the MCETemplateDisplay protocol that displays a single message on a full screen.
 */
-(id<MCETemplateDisplay>)displayViewController;

/** The shouldDisplayInboxMessage: method determines that a message can be opened. This is typically used to disallow expired messages from being opened but can also be used for other criteria.
 
 @param inboxMessage A MCEInboxMessage object.
 @return TRUE if the message can be opened, FALSE otherwise.
 */
-(BOOL)shouldDisplayInboxMessage: (MCEInboxMessage*)inboxMessage;

-(UITableViewCell *) cellForTableView: (UITableView*)tableView inboxMessage:(MCEInboxMessage *)inboxMessage indexPath:(NSIndexPath*)indexPath;

/** Provides a method for changing the height of the UITableView content preview cells.
 
 @return height in points.
 */
-(float)tableView: (UITableView*)tableView heightForRowAtIndexPath: (NSIndexPath*)indexPath inboxMessage: (MCEInboxMessage*)message;

@end

