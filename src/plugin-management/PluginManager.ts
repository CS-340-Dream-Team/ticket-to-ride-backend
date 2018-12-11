import { IPersistenceProviderPlugin } from "./IPersistenceProviderPlugin";

export class PluginManager {
	persistenceProvider: IPersistenceProviderPlugin;

	constructor() {
		let fileSystem = require("fs");
		let pluginName = process.argv[2];
		if (!pluginName) {
			throw new Error("No Persistence Provider Plugin Specified");
		}
		let pluginJSON = fileSystem.readFileSync("src/plugin-management/plugin-config.json");
		let availablePlugins = JSON.parse(pluginJSON) as PluginRegistration[];
		let desiredPlugin = availablePlugins
			.filter(availablePlugin => availablePlugin.name == pluginName)
			.pop();
		if (desiredPlugin) {
			let pluginSource = require("../" + desiredPlugin.source);
			this.persistenceProvider = new pluginSource[desiredPlugin.className]();
		} else {
			let pluginSource = require("../plugins/dummy-plugin/DummyPlugin");
			this.persistenceProvider = new pluginSource["DummyPlugin"]();
		}
	}

	getProvider() {
		return this.persistenceProvider;
	}
}

interface PluginRegistration {
	name: string;
	source: string;
	className: string;
}
