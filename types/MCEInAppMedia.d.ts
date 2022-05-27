import { InAppMessage } from "./MCEInAppPluginTypes";
declare namespace MCEInAppMedia {
    var autoDismiss: boolean;
    const hideMediaInApp: () => void;
    const show: (inAppMessage: InAppMessage, completion: VoidFunction) => void;
}
export = MCEInAppMedia;
