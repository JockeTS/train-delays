import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
    }

    // connect component
    connectedCallback() {
        const routes = this.router.routes;

        let navigationLinks = "";

        for (const path in routes) {
            if (routes[path].hidden) {
                continue;
            }

            let icon = "";

            if (routes[path].name === "List") {
                icon = "list";
            }

            if (routes[path].name === "Map") {
                icon = "map";
            }

            navigationLinks +=
            `<a class="button full-width-button material-icons" href='#${path}' id="${path}">
                ${icon}
            </a>`;
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}
