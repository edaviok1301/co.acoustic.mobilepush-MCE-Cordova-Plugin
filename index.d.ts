import MCEPluginNS from "./types/MCEPlugin";
import MCEPluginTypes from './types/MCEPluginTypes';

declare global {
    var MCEPlugin: typeof MCEPluginNS;
}

export = MCEPluginTypes;
