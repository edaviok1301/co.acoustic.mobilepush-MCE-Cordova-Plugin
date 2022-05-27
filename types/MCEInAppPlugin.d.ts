import { InAppTemplateCallback } from "./MCEInAppPluginTypes";
/**
Acoustic MCE InApp Cordova Plugin
*/
declare namespace MCEInAppPlugin {
    /**
  Allows Cordova InApp Plugin to delete an existing InAppMessage
  @param {integer} inAppMessageId id of message to be deleted.
  */
    const deleteInAppMessage: (inAppMessageId: number) => void;
    /**
  Allows Cordova InApp Plugin to look for and possibly execute the next InApp message.
  @param {Array.<string>} rules A list of rules to be matched against.
  */
    const executeInAppRule: (rules: string[]) => void;
    /**
  Allows Cordova InApp Plugin to register a template handler.
  @param {InAppTemplateCallback} callback The callback that handles the response
  @param {string} templateName A template name that this handler displays
  */
    const registerInAppTemplate: (callback: InAppTemplateCallback, templateName: string) => void;
    /**
  Allows Cordova InApp Plugin to initiate a sync with the server.
  */
    const syncInAppMessages: (callback: VoidFunction) => void;
    /**
  Allows Cordova InApp Plugin to call out to action registry to handle rich message actions.
  @param {string} action is normally in the format &#123; "type": &lt;type&gt;, "value": &lt;value&gt; &#125; but can be whatever is sent in the "notification-action" or the "category-actions" section of the payload
  */
    const executeInAppAction: (action: string) => void;
    const processColor: (colorString: string, defaultColor: string) => string;
    /**
     * Adds an InAppMessage to the database, this is largely for testing purposes.
     * @param {StringObject} InApp Message Dictionary
     */
    const addInAppMessage: (inAppMessage: StringObject) => void;
}
export = MCEInAppPlugin;
