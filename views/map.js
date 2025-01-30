/* global L */

import "../leaflet/leaflet.min.js";
import trainsModel from "../models/trains.js";
import stationsModel from "../models/stations.js";
import { filterTrains, removeDuplicateTrains, getStationNameFromCode } from "../utils.js";

let layerGroup;

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.trains = [];
        this.stations = [];
    }

    async connectedCallback() {
        let trains1 = await trainsModel.getTrains();

        let trains2 = filterTrains(trains1);

        this.trains = removeDuplicateTrains(trains2);

        this.stations = await stationsModel.getStations();

        this.innerHTML = `
            <div id="map" class="map"></div>
        `;

        this.renderMap();
        this.addStationMarkers();
        this.renderLocation();
    }

    async renderMap() {
        // Create the map
        this.map = L.map('map', {
            center: [59.334591, 18.063240],
            zoom: 9
        });

        layerGroup = L.layerGroup().addTo(this.map);

        // Add tile layer to map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
    }

    // Add train delays to matching stations
    addDelaysToStations() {
        for (const train of this.trains) {
            const fromLocation = train.FromLocation[0].LocationName;

            let foundStation = this.stations.find(
                station => station.LocationSignature === fromLocation
            );

            if (!foundStation.delays) {
                foundStation.delays = [];
            }

            foundStation.delays.push(train);
        }
    }

    // Add markers for each station with at least one delay
    addStationMarkers() {
        this.addDelaysToStations();

        for (const station of this.stations) {
            if (station.delays) {
                const coordinates = station.Geometry.WGS84.split(/[( )]/);

                const popup = L.popup({minWidth: 350})
                    .setContent(this.createStationPopup(station, coordinates));

                L.marker([
                    parseFloat(coordinates[3]),
                    parseFloat(coordinates[2])
                ]).bindPopup(popup)
                    .addTo(this.map);
            }
        }
    }

    convertToMinutes(milliseconds) {
        const minutes = Math.floor((milliseconds/1000)/60);

        return minutes;
    }

    createExploreButton(delayMins, coordinates) {
        const explorationTime = Math.floor((delayMins - 10) / 2);

        const exploreButton = document.createElement("button");

        exploreButton.className = "explore-button";
        exploreButton.innerHTML = "&#128065;";

        if (delayMins > 10) {
            exploreButton.addEventListener('click', function() {
                layerGroup.clearLayers();

                L.circle([coordinates[3], coordinates[2]], {radius: explorationTime * 100})
                    .addTo(layerGroup);
            });
        } else {
            exploreButton.classList.add("hidden");
        }

        return exploreButton;
    }

    // Create a row for each delay in station marker
    createDelayRow(delay, coordinates) {
        const trainNumber = delay.AdvertisedTrainIdent;

        const toLocation = getStationNameFromCode(delay.ToLocation[0].LocationName, this.stations);

        const ata = delay.AdvertisedTimeAtLocation.split("T")[1].substring(0, 5);

        const eta = delay.EstimatedTimeAtLocation.split("T")[1].substring(0, 5);

        const delayRow = document.createElement("div");

        delayRow.className = "delay-row";

        // Train number
        const delayNumber = document.createElement("div");

        delayNumber.className = "delay-number";
        delayNumber.innerHTML = `${trainNumber} &rarr;&nbsp;`;

        // Train destination
        const delayTo = document.createElement("div");

        delayTo.className = "delay-to";
        delayTo.innerHTML = toLocation;

        // Train delay
        const delayTime = document.createElement("div");

        delayTime.className = "delay-time";

        let d1 = new Date(delay.AdvertisedTimeAtLocation);

        let d2 = new Date(delay.EstimatedTimeAtLocation);

        const delayMins = this.convertToMinutes(d2 - d1);

        delayTime.innerHTML = `&#10060; ${ata} - &#9989; ${eta} (${delayMins}m)`;

        delayRow.appendChild(delayNumber);
        delayRow.appendChild(delayTo);
        delayRow.appendChild(delayTime);

        const exploreButton = this.createExploreButton(delayMins, coordinates);

        delayRow.appendChild(exploreButton);

        return delayRow;
    }

    // Create a popup for each station marker
    createStationPopup(station, coordinates) {
        const popup = document.createElement("div");

        const header = document.createElement("h3");

        header.className = "popup-header";
        header.innerHTML = station.AdvertisedLocationName;

        popup.appendChild(header);

        for (const delay of station.delays) {
            const delayRow = this.createDelayRow(delay, coordinates);

            popup.appendChild(delayRow);
        }

        return popup;
    }

    // Add user's location if possible
    renderLocation() {
        // Get current posish from navigator
        if ("geolocation" in navigator) {
            let locationMarker = L.icon({
                iconUrl:      "leaflet/location.png",
                iconSize:     [24, 24],
                iconAnchor:   [12, 12],
                popupAnchor:  [0, 0]
            });

            // Pan to user's location if found
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    {icon: locationMarker}
                ).addTo(this.map);

                this.map.panTo([position.coords.latitude, position.coords.longitude]);
            });
        }
    }
}
