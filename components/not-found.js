// Define custom HTML element
export default class NotFound extends HTMLElement {
    // Extend base HTML element to access basic attributes

    constructor() {
        // Call constructor of base class HTMLElement
        super();
    }

    // Called when element is rendered ("connected") (life-cycle method)
    connectedCallback() {
        this.innerHTML = `<h1>Route not found.</h1>`;
    }
}
