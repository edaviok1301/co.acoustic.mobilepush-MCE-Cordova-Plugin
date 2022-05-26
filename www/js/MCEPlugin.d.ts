/**
  Acoustic MCE Cordova Plugin
  */
import { Action, ActionCallback, Event, AppKeyCallback, AttributeQueueCallback, BooleanCallback, CategoryCallback, EventQueueFailureCallback, EventQueueSuccessCallback, GetBadgeCallback, ImageCallback, RegisteredActionCallback, RegisteredCallback, RegistrationCallback, SafeAreaCallback, SdkVersionCallback } from "./MCEPluginTypes";
declare namespace MCEPlugin {
    /**
  Allow Cordova developer to get the current native SDK version in use
  @param {SdkVersionCallback} callback  The callback that handles the response
  */
    const getSdkVersion: (callback: SdkVersionCallback) => void;
    /**
  Allow Cordova developer to get the current native SDK version in use
  @param {SdkVersionCallback} callback The callback that handles the response
  */
    const getPluginVersion: (callback: SdkVersionCallback) => void;
    /**
  Allow Cordova developer to know when registration occurs.
  This will only be called once when the application registers with the Acoustic servers.
  If the application is not active when this happens the callback will be queued
  until the next time this method is called to register a callback handler
  @param {RegistrationCallback} callback The callback that handles the response
  */
    const setRegistrationCallback: (callback: RegistrationCallback) => void;
    /**
  Allow Cordova developer to handle custom actions
  @param callback The callback that handles the response
  @param type Custom Action type from the "notification-action" or the "category-actions" section of the payload
  */
    const setRegisteredActionCallback: (callback: RegisteredActionCallback, type: string) => void;
    /**
      Allow Cordova developer to detect when a push action is not handled.
      */
    const setActionNotRegisteredCallback: (callback: ActionCallback) => void;
    /**
      Allow Cordova developer to detect when a push action is not handled, but was previously registered.
      */
    const setActionNotYetRegisteredCallback: (callback: ActionCallback) => void;
    /**
      Allow Cordova developer to stop handling custom actions
      @param {string} type Custom Action type from the "notification-action" or the "category-actions" section of the payload
      */
    const unregisterActionCallback: (type: string) => void;
    /**
      Allow Cordova developer to know when events are sent to the server.
      If the event is sent while the application is not active, the callback will be queued
      until the next time this method is called to register a callback handler

      @param {EventQueueSuccessCallback} successCallback The callback that handles the response
      @param {EventQueueFailureCallback} errorCallback The callback that handles the response
      */
    const setEventQueueCallbacks: (successCallback: EventQueueSuccessCallback, errorCallback: EventQueueFailureCallback) => void;
    const pauseResumeCallback: (pauseFunction: VoidFunction, resumeFunction: VoidFunction) => void;
    /**
     Internal function to translate timestamps from integers or strings to JavaScript date objects
    @param {Array.<Event>} events List of events to translate
    @return {Array.<Event>} List of events translated
    */
    const translateEvents: (events: Event[]) => Event[];
    /**
    Allow Cordova developer to know when attributes are sent to the server.
    If the attribute is sent while the application is not active, the callback will be
    queued until the next time this method is called to register a callback handler
    @param {AttributeQueueCallback} successCallback The callback that handles the response
    @param {AttributeQueueCallback} errorCallback The callback that handles the response
    */
    const setAttributeQueueCallbacks: (successCallback: AttributeQueueCallback, errorCallback: AttributeQueueCallback) => void;
    /**
     Internal function to translate a dictionary of attributes with dates represented as integers back into JavaScript date objects
     @param {Object[]} attributes Attributes to be converted
     @return {Object[]}
    */
    const translateAttributesCallback: (attributes: Object[]) => Object[];
    /**
      Allow Cordova developer to get the current badge count
      @param {GetBadgeCallback} callback The callback that handles the response
      */
    const getBadge: (callback: GetBadgeCallback) => void;
    /**
     Allow Cordova developer to get the current channelId, userId and deviceToken or registrationId
    @param {RegistrationCallback} callback The callback that handles the response
    */
    const getRegistrationDetails: (callback: RegistrationCallback) => void;
    /**
      Allow Cordova developer to get the current appKey
      @param {AppKeyCallback} callback The callback that handles the response
      */
    const getAppKey: (callback: AppKeyCallback) => void;
    /**
      Allow Cordova developer to determine if the device has registered with the push provider's service and if it has registered with the Acoustic infrastructure
      @param {RegisteredCallback} callback The callback that handles the response
      */
    const isRegistered: (callback: RegisteredCallback) => void;
    /**
    Internal function to translate a dictionary of attributes with dates into integers so they can be processed by SDK
    @param {Array.<Object>} attributes Attributes to be converted
    @return {Array.<Object>}
    */
    const translateAttributes: (attributes: any[]) => any[];
    /**
      Allow Cordova developer to update any user attributes while leaving the existing attributes alone
      This method also includes automatic retrying of failures
      This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
      @param {Object} attributes a list of attributes in key, value format
      */
    const queueUpdateUserAttributes: (attributes: any) => void;
    /**
      Allow Cordova developer to remove specific user attributes
      This method also includes automatic retrying of failures
      This method has no callbacks, but the status of the request will be sent to the JavaScript callback that was registered with setAttributeQueueCallbacks or if none were registered, it will be queued.
      @param {Array} attributes a list of attribute keys to be removed
      */
    const queueDeleteUserAttributes: (attributes: any[]) => void;
    /**
      Allow Cordova developer to send an event to the Acoustic infrastructure.
      Status will be reported to method registered via setEventQueueCallbacks
      @param {Event} event Event to be sent to the server
      @param {boolean} flush When this is true, the event is sent immediately and flushes the queue of events to be sent. When it is false, the event is queued and will be automatically sent when the queue is automatically flushed at a later date. This parameter is optional with the default value of true
      */
    const queueAddEvent: (event: Event, flush?: boolean) => void;
    /**
      Allow Cordova developer to set the badge count for the iOS homescreen
      @param {integer} badge a new badge number
      */
    const setBadge: (badge: number) => void;
    /**
      Allow Cordova developer to change the Android icon
      @param {string} drawableName Name of a drawable image in app bundle
      */
    const setIcon: (drawableName: string) => void;
    /**
      Allow Cordova developer to register and respond to iOS static categories
      @param {CategoryCallback} callback The callback that handles the response
      @param {string} categoryName Name of category to respond to in iOS payload
      @param {Array.<Action>} actions - an array of actions
      */
    const setCategoryCallbacks: (callback: CategoryCallback, categoryName: string, actions: Action[]) => void;
    /**
      Manually initialize SDK, is used to wait until an event occurs before beginning
      to interact with the Acoustic servers. For example, you might not want to create a
      userid/channelid until after a user logs into your system. Requires
      autoInitialize=FALSE MceConfig.plist flag.
       */
    const manualInitialization: () => void;
    /**
      Console error reporting
      @param {string} message Error message
      */
    const error: (message: string) => void;
    /**
      Executes phone home request which may update the userId and channelId to match changes made on the server. Typically used after contact merge on Engage during user identification. This allows the inbox to be synchronized between multiple installations of the application on different devices for the same user. Note, phone home will execute once every 24 hours automatically without calling this API.
      */
    const phoneHome: () => void;
    /**
     * Get safe are insets for device.
     * @param {SafeAreaCallback} callback to retrieve safe area for device
     */
    const safeAreaInsets: (callback: SafeAreaCallback) => void;
    /**
     * Queries if user has been invalidated.
     * @param {BooleanCallback} callback to retrieve status of user.
     */
    const userInvalidated: (callback: BooleanCallback) => void;
    const append: (src: string, addition: string) => string;
    const scaledImage: (src: string) => string;
    const themedImage: (src: string) => string;
    const imageCSS: (image: HTMLImageElement) => {
        width?: undefined;
        height?: undefined;
    } | {
        width: string;
        height: string;
    };
    const bestImage: (originalSource: string, callback?: ImageCallback) => Promise<string>;
    const replaceImages: () => void;
}
export = MCEPlugin;
