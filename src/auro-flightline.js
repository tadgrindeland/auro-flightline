// Copyright (c) 2021 Alaska Airlines. All right reserved. Licensed under the Apache-2.0 license
// See LICENSE in the project root for license information.

// ---------------------------------------------------------------------

// If use litElement base class
import { LitElement, html, css } from "lit-element";
import { classMap } from "lit-html/directives/class-map";

// Import touch detection lib
import "focus-visible/dist/focus-visible.min.js";
import styleCss from "./style-flightline-css.js";
import { observeResize, unobserve } from './observer';

const defaultContainerWidth = 414;

// See https://git.io/JJ6SJ for "How to document your components using JSDoc"
/**
 * auro-flightline provides a responsive flight timeline experience by placing dots indicating stopovers and layovers on a timeline.
 * @attr {Boolean} canceled - Whether the flightline is canceled.
 * @attr {Number} cq - The number of pixels where the component should switch to an expanded view.
 * @slot - fill in with `<auro-flight-segment>` components of a given leg.
 */

class AuroFlightline extends LitElement {
  constructor() {
    super();
    this.canceled = false;
    this.cq = defaultContainerWidth;

    /** @private */
    this.showAllStops = false;
  }

  static get properties() {
    return {
      canceled:    { type: Boolean },
      showAllStops:    { type: Boolean },
      cq:  { type: Number }
    };
  }

  static get styles() {
    return css`
      ${styleCss}
    `;
  }

  firstUpdated() {
    const setShowAllStops = (val) => {
      this.showAllStops = val > this.cq;
    };

    this.observedNode = this;
    observeResize(this.observedNode, setShowAllStops);
  }

  disconnectedCallback() {
    unobserve(this.observedNode);
  }

  // function that renders the HTML and CSS into  the scope of the component
  render() {
    const isMultiple = this.children.length > 1;
    const classes = {
      'slot-container': true,
      'nonstop': !this.children.length && !this.canceled,
      'multiple': isMultiple,
      'canceled': this.canceled,
      'show-all-stops': this.showAllStops
    };

    return html`
      <div class="${classMap(classes)}">
        ${this.canceled ? html`` : html` <slot></slot>`}
        ${isMultiple && !this.canceled ? html`
          <auro-flight-segment iata="${this.children.length} stops"></auro-flight-segment>
        ` : html``}
      </div>`;
  }
}

/* istanbul ignore else */
// define the name of the custom component
if (!customElements.get("auro-flightline")) {
  customElements.define("auro-flightline", AuroFlightline);
}
