import { ErrorMsgs } from "./ErrorMsgs";

export class MapDataManager {
    private _locations = [];
    private _segments = [];
    private static instance: MapDataManager|null = null;
    private constructor() {
        try {
            var fileSystem = require('fs');
            var locationsJSON = fileSystem.readFileSync("src/data/locations.json");
            var segmentsJSON = fileSystem.readFileSync("src/data/segments.json");
            this._locations = JSON.parse(locationsJSON);
            this._segments = JSON.parse(segmentsJSON);
        }
        catch (e) {
            console.log("Could not read data JSON. Check that the file exists at the expected path.");
        }
    }

    public static getInstance(): MapDataManager {
        if (MapDataManager.instance == null) {
            MapDataManager.instance = new MapDataManager();
        }
        return MapDataManager.instance;
    }
    
    get locations() {
        if (this._locations.length == 0) {
            throw new Error(ErrorMsgs.DATA_DOES_NOT_EXIST);
        }
        return this._locations;
    }

    get segments() {
        if (this._segments.length == 0) {
            throw new Error(ErrorMsgs.DATA_DOES_NOT_EXIST);
        }
        return this._segments;
    }
}