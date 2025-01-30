export default class DelayedTrain extends HTMLElement {
    static get observedAttributes() {
        return ['data'];
    }

    get data() {
        // Return product attribute of instance
        return JSON.parse(this.getAttribute("data"));
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="delayed-train">
                <h3>${this.data.AdvertisedTrainIdent}</h3>
                <div class='delay-loc'>
                    <div class='from'>${this.data.from}</div>
                    <div>&nbsp;&rarr;&nbsp;</div>
                    <div class='to'>${this.data.to}</div>
                </div>
                <p>&#10060; ${this.data.ata} - &#9989 ${this.data.eta} (${this.data.delay})</p>
            </div>
        `;
    }
}
