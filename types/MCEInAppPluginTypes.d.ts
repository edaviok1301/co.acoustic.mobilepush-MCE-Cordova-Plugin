import { AnyObject } from "co.acoustic.mobile.push.sdk";
export interface InAppMessage {
    /** The unique identifier of the InAppMessage */
    inAppMessageId: number;
    /** The total allowed number of views of the message. */
    maxViews: number;
    /** The current count of views of the message. */
    numViews: number;
    /** The template name that handles the message. */
    template: string;
    /** Template defined details of message */
    content: AnyObject;
    /** Date the message should first appear in seconds since epoch */
    triggerDate: number;
    /** Date the message should last appear in seconds since epoch */
    expirationDate: number;
    /** A list of rules to be matched against. */
    rules: string[];
}
/**
  @callback InAppTemplateCallback
  @param inAppMessage {InAppMessage} An InApp message to be displayed.
  */
export declare type InAppTemplateCallback = (inAppMessage: InAppMessage) => void;
