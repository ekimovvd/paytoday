import { loadStyles } from "../../../js/utils.js";

export class UIButtonPlus extends HTMLElement {
  static get observedAttributes() {
    return ["label"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/button-plus/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.label = this.shadowRoot.querySelector(".ui-button-plus__label--small");

    this.updateLabel();
  }

  updateLabel() {
    const label = this.getAttribute("label");

    if (label) {
      this.label.textContent = label;
    } else {
      this.label.textContent = "Создать счет";
    }
  }
}

customElements.define("ui-button-plus", UIButtonPlus);
