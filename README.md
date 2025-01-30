# Train Delays

## Description
Responsive, single-page web application built with HTML, CSS and JavaScript. It uses custom **Web Components** to create a router and render views and elements.

The application shows current train delays in Sweden through two main views:

* List - Lists delayed trains ordered by time of arrival. Includes train numbers and length of delays.

* Map - Displays train stations and the user's location on a **Leaflet** map. Clicking on a station brings up all outgoing delayed trains from that station, similar to the list view.

Data about train delays are fetched from a proxy API which in turn connects to an API from Trafikverket. This data is then filtered to remove duplicates and irrelevant results before being sent to the relevant views.

## Quick Start
* git clone https://github.com/JockeTS/train-delays.git
* cd train-delays/
* npm install
* Start Server: python3 -m http.server 9000
* navigate to: http://127.0.0.1:9000/#delayed-trains