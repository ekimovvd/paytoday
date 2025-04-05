import { loadStyles } from "../../../js/utils.js";

export class SharedBack extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/back/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    const button = this.shadowRoot.querySelector(".shared-back");
    if (button) {
      button.addEventListener("click", () => {
        window.history.back();
      });
    }
  }
}

customElements.define("shared-back", SharedBack);
