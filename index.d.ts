import MCEPluginNS from "./types/MCEPlugin";
import MCEPluginTypes from './types/MCEPluginTypes';
import MCEInAppPluginNS from './types/MCEInAppPlugin';

declare global {
    var MCEPlugin: typeof MCEPluginNS;
    var MCEInAppPlugin: typeof MCEInAppPluginNS;
}

export = MCEPluginTypes;
