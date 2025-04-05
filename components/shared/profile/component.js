import { loadStyles } from "../../../js/utils";

export class SharedProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/profile/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.container = this.shadowRoot.querySelector(".shared-profile");

    this.applyModifier();
  }

  static get observedAttributes() {
    return ["modifier"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "modifier") {
      this.applyModifier();
    }
  }

  applyModifier() {
    if (this.container) {
      const modifier = this.getAttribute("modifier");
      this.container.className = "shared-profile";

      if (modifier) {
        this.container.classList.add(`shared-profile--${modifier}`);
      }
    }
  }
}

customElements.define("shared-profile", SharedProfile);
