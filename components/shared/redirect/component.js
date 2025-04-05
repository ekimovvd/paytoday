import { loadStyles } from "../../../js/utils";

export class SharedRedirect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/redirect/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.link = this.shadowRoot.querySelector(".shared-redirect");

    const href = this.getAttribute("href");
    if (href) {
      this.link.setAttribute("href", href);
    }
  }
}

customElements.define("shared-redirect", SharedRedirect);
