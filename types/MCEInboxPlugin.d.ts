import { InboxListCallback, InboxMessageCallback } from "./MCEInboxPluginTypes";
/**
Acoustic MCE Inbox Cordova Plugin
*/
declare namespace MCEInboxPlugin {
    /**
    Allow Cordova Inbox Plugin to respond to changes in the inbox list.
    @param {InboxListCallback} callback The callback that handles the response
    */
    const setInboxMessagesUpdateCallback: (callback: InboxListCallback) => void;
    /**
    Allows Cordova Inbox Plugin to initiate a sync with the server. Will execute function
    registered with setInboxMessagesUpdateCallback when complete.
    */
    const syncInboxMessages: () => void;
    /**
    Allows Cordova Inbox Plugin to get the inbox message by providing the inbox message id.
    @param {string} inboxMessageId Unique identifier for inbox message
    @param {InboxMessageCallback} callback  The callback that handles the response
    */
    const fetchInboxMessageId: (inboxMessageId: string, callback: InboxMessageCallback) => void;
    /**
    Allows Cordova Inbox Plugin to call out to action registry to handle rich message actions.
    @param {Object} action is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
    */
    const executeInboxAction: (action: StringObject, inboxMessageId: string) => void;
    /**
    Allows Cordova Inbox Plugin to delete a message from the database cache and server.
    @param {string} inboxMessageId Unique identifier for inbox message
    */
    const deleteMessageId: (inboxMessageId: string) => void;
    /**
    Allows Cordova Inbox Plugin to set the read status of a message in the database cache and server.
    @param {string} inboxMessageId Unique identifier for inbox message
    */
    const readMessageId: (inboxMessageId: string) => void;
    /**
    Allows Cordova Inbox Plugin to retrieve an inbox message by providing a richContentId.
    @param {string} richContentId Unique identifier for rich content
    @param {InboxMessageCallback} callback The callback that handles the response
    */
    const fetchInboxMessageViaRichContentId: (richContentId: string, callback: InboxMessageCallback) => void;
    /**
    Allows Cordova Inbox Plugin to immediately remove expired messages from the inbox database
    */
    const clearExpiredMessages: () => void;
}
export = MCEInboxPlugin;
