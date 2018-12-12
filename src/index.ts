import 'babel-polyfill';
import { ServerCommunicator } from "./handlers/ServerCommunicator";

(function main() {
	const portStr: string | undefined = process.env.TTR_PORT;
	let port: number;
	if (portStr === undefined) {
		port = 4040;
	} else {
		port = Number.parseInt(portStr);
	}
	try {
		let serverCommunicator = new ServerCommunicator(port);
	} catch (e) {
		if (e.message == "No Persistence Provider Plugin Specified") {
			console.warn("No Plugin Specified Or Plugin Invalid");
			console.warn("Usage: yarn start [pluginName] [commandDeltaNumber]");
		} else if (e.message == "No Command Delta Number Specified Or Number Invalid") {
			console.warn("No Command Delta Number Specified Or Number Invalid");
			console.warn("Usage: yarn start [pluginName] [commandDeltaNumber]");
		} else {
			console.log(e);
		}
		return;
	}
})();
