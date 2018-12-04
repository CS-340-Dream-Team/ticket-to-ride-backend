import { ServerCommunicator } from "./handlers/ServerCommunicator";

(function main() {
	const portStr: string | undefined = process.env.TTR_PORT;
	let port: number;
	if (portStr === undefined) {
		port = 4040;
	} else {
		port = Number.parseInt(portStr);
	}
	let serverCommunicator = new ServerCommunicator(port);
})();
