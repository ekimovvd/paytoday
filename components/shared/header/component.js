import { loadStyles } from "../../../js/utils.js";

export class SharedHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/header/component.html");

    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.menuButton = this.shadowRoot.querySelector(".shared-header__burger");

    this.menuButton.addEventListener("click", () => {
      const menu = document.getElementById("menu");

      menu.open();
    });
  }
}

customElements.define("shared-header", SharedHeader);
