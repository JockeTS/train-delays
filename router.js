export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";
        this.wildcard = "";

        this.allRoutes = {
            "delayed-trains": {
                view: "<delayed-trains></delayed-trains>",
                name: "List"
            },
            "stations": {
                view: "<map-view order=$wildcard></map-view>",
                name: "Map"
            }
        };
    }

    // Getter for allRoutes object
    get routes() {
        return this.allRoutes;
    }

    connectedCallback() {
        // Listen for changes in # in url
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        let identifier = location.hash.replace("#", "");

        this.wildcard = "";

        if (identifier.indexOf("/") > -1) {
            const identifierArray = identifier.split("/");

            identifier = identifierArray[0];
            this.wildcard = identifierArray[1];
        }

        this.currentRoute = identifier;

        this.render();
    }

    // Render valid routes if existing or not-found component if not existing
    render() {
        let html = "<not-found></not-found>";

        if (this.currentRoute in this.routes) {
            html = this.routes[this.currentRoute].view;

            if (this.wildcard) {
                html = html.replace("$wildcard", this.wildcard);
            }
        } else {
            this.innerHTML = "<not-found></not-found>";
        }

        this.innerHTML = html;
    }
}
