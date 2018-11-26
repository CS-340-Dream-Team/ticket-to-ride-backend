export default function loadJSON(path: string) {
    try {
        var fileSystem = require('fs');
        var json = fileSystem.readFileSync(path);
        return JSON.parse(json);
    }
    catch (e) {
        console.log("Could not read data JSON. Check that the file exists at the expected path.");
    }
}
