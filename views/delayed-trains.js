import { filterTrains, removeDuplicateTrains, getStationNameFromCode } from "../../utils.js";
import trainsModel from "../models/trains.js";
import stationsModel from "../models/stations.js";

export default class DelayedTrains extends HTMLElement {
    constructor() {
        super();

        this.trains = [];
        this.stations = [];
    }

    async connectedCallback() {
        let trains1 = await trainsModel.getTrains();

        let trains2 = filterTrains(trains1);

        this.trains = removeDuplicateTrains(trains2);

        this.stations = await stationsModel.getStations();

        this.render();
    }

    convertMillisecondsToHoursMinutesSeconds(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);

        let time = "";

        if (hours) {
            time += `${hours}h `;
        }

        if (minutes) {
            time += `${minutes}m`;
        }

        return time;
    }

    render() {
        // Create list of delayed train elements
        const list = this.trains.map((train) => {
            // Create from and to properties with real station names
            train.from = getStationNameFromCode(train.FromLocation[0].LocationName, this.stations);
            train.to = getStationNameFromCode(train.ToLocation[0].LocationName, this.stations);

            // Create ata and eta properties with formatted times
            train.ata = train.AdvertisedTimeAtLocation.split("T")[1].substring(0, 5);
            train.eta = train.EstimatedTimeAtLocation.split("T")[1].substring(0, 5);

            // Create delay property by calculating and formatting the delay
            let d1 = new Date(train.AdvertisedTimeAtLocation);
            let d2 = new Date(train.EstimatedTimeAtLocation);

            train.delay = this.convertMillisecondsToHoursMinutesSeconds(d2 - d1);

            return `<delayed-train data='${JSON.stringify(train)}'></delayed-train>`;
            // return JSON.stringify(train);
        }).join("");

        this.innerHTML = list;
    }
}
