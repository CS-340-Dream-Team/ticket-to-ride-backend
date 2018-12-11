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
		if ((e.message = "No Persistence Provider Plugin Specified")) {
			console.warn("No Plugin Specified");
			console.warn("Usage: yarn start [pluginName]");
		} else {
			console.log(e);
		}
		return;
	}
})();
