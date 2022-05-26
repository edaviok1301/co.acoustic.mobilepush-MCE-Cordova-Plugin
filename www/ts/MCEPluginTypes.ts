export interface StringObject {
    [key: string]: string;
}

export interface AnyObject {
    [key: string]: any;
}

export type ImageCallback = (image: HTMLImageElement) => void;

/**
 * @callback SdkVersionCallback
 * @param {string} version a short string representing SDK version
 */
export type SdkVersionCallback = (version: string) => void;

export interface Registration {
    /** A short string identifying the user, possibly multiple devices */
    userId: string;
    /**A short string identifying the channel or device */
    channelId: string;
    /**A medium string that represents the iOS device on APNS */
    deviceToken: string;
    /**A medium string that represents the Android device on GCM */
    registrationId: string;
}

export type RegistrationCallback = (registration: Registration) => void;

export type RegisteredActionCallback = (
    /** normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload */
    actionPayload: StringObject,
    /** Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125; */
    payload: StringObject
) => void;

export type ActionCallback = (action: string) => void;

export interface Event {
    /** Event type, SDK automatically sends events of "simpleNotification" and "application" types */
    type: string;
    /** Event name, SDK automatically sends events of "sessionStart", "sessionEnd", "urlClicked", "appOpened", "phoneNumberClicked" names */
    name: string;
    /** Timestamp that event occurred */
    timestamp: Date;
    /** Details about event, freeform key value pairs */
    attributes: any;
    /** Campaign name associated with event, optional */
    attribution?: string;
}

export interface EventQueueFailure {
    /** List of events that were sent*/
    events: Event[];
    /** Description of the error */
    error: string;
}

/**
@callback EventQueueFailureCallback
@param result {Object}
@param result.events {Array.<Event>} List of events that were sent
@param result.error {string} Description of the error
*/
export type EventQueueFailureCallback = (result: EventQueueFailure) => void;

/**
@callback EventQueueSuccessCallback
@param events {Array.<Event>} List of events that were sent
*/
export type EventQueueSuccessCallback = (events: Event[]) => void;

export interface AttributeQueueResult {
    /** Either "update" or "delete" depending on which method was called */
    operation: "update" | "delete";
    /** Either "channel" or "user" depending on which method was called */
    domain: "channel" | "user";
    /** Key value pairs that were updated if the operation was set or update */
    attributes: any;
    /** A list of keys that were deleted when the operation is delete */
    keys: string[];
    /** Description of the error, if any. */
    error?: string;
}

/**
@callback AttributeQueueCallback
@param {AttributeQueueResult} result
*/
export type AttributeQueueCallback = (result: AttributeQueueResult) => void;

/**
 @callback GetBadgeCallback
@param {number} badgeCount
*/
export type GetBadgeCallback = (badgeCount: number) => void;

/**
@callback AppKeyCallback
@param {string} appKey A short string for identifying the app in co.acoustic.mobilepushs system
*/
export type AppKeyCallback = (appKey: string) => void;

export type CordovaCallback = (data: any) => void;

/**
  @callback registeredCallback
  @param {boolean} co.acoustic.mobilepushRegistered will be either true or false and represents the device registering with the Acoustic infrastructure
  @param {boolean} providerRegistered will be either true or false and represents the device registering the push provider system (APNS or GCM)
  @param {string} providerName name of provider, eg "APNS", "FCM", or "GCM"
  */
export type RegisteredCallback = (
    mobilepushRegistered: boolean,
    providerRegistered: boolean,
    providerName: "APNS" | "GCM" | "FCM"
) => void;

/**
  @callback CategoryCallback
  @param {Object} payload Entire Android or iOS payload for example &#123;"aps":&#123;"alert":"hello world", "category":"example"&#125;&#125;
  @param {string} identifier String identifying button to JavaScript processing click of button
  */
export type CategoryCallback = (payload: any, identifier: string) => void;

export interface Action {
    /** When true the option shows in red */
    destructive: boolean;
    /** When true requires user to unlock device to execute action */
    authentication: boolean;
    /** String to display on button for user to select */
    name: string;
    /** String identifying button to JavaScript processing click of button */
    identifier: string;
}

export interface Insets {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export type SafeAreaCallback = (value: Insets) => void;

export type BooleanCallback = (value: boolean) => void;
