import { StringObject } from "co.acoustic.mobile.push.sdk";

export interface InboxMessage {
    /** Unique identifier for inbox message */
    inboxMessageId: string;
    /** Unique identifier for rich content */
    richContentId: string;
    /** Expiration of message in seconds since epoch */
    expirationDate: number;
    /** Message sent date in seconds since epoch */
    sendDate: number;
    /** Template name that handles display of this message */
    template: string;
    /** Campaign name message was sent with */
    attribution: string;
    /** True for message read, false for message unread */
    isRead: boolean;
    /** True for message deleted, false for message not deleted */
    isDeleted: boolean;
    mailingId?: string;
}

/**
@callback InboxListCallback
@param {Array.<InboxMessage>} messages Messages in Inbox
*/
export type InboxListCallback = (messages: InboxMessage[]) => void;

/**
@callback InboxMessageCallback
@param {InboxMessage} message Inbox message contents
*/
export type InboxMessageCallback = (message: InboxMessage) => void;

export interface InboxRegistryMap {
    [key: string]: InboxRegistry;
}

export interface InboxRegistry {
    display: (message: InboxMessage) => string;
    actions: (message: InboxMessage) => ActionMap;
    preview: (message: InboxMessage) => string;
}

export interface ActionMap {
    [key: string]: StringObject;
}
