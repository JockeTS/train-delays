import Router from './router.js';
import Navigation from './navigation.js';
import NotFound from './components/not-found.js';
import DelayedTrains from './views/delayed-trains.js';
import DelayedTrain from './components/delayed-train.js';
import MapView from './views/map.js';

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('not-found', NotFound);
customElements.define('delayed-trains', DelayedTrains);
customElements.define('delayed-train', DelayedTrain);
customElements.define('map-view', MapView);
