import { loadStyles } from "../../../js/utils.js";

export class SharedPartnerProgram extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch(
      "./components/shared/partner-program/component.html"
    );
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.modal = this.shadowRoot.querySelector(".shared-partner-program");
    this.closeButton = this.shadowRoot.querySelector(
      ".shared-partner-program__close"
    );
    this.backdrop = this.shadowRoot.querySelector(
      ".shared-partner-program__backdrop"
    );

    this.closeButton?.addEventListener("click", () => this.close());

    this.backdrop?.addEventListener("click", (event) => {
      if (event.target === this.backdrop) {
        this.close();
      }
    });
  }

  open() {
    if (this.modal) {
      this.modal.classList.add("shared-partner-program--open");
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("shared-partner-program--open");
    }
  }
}

customElements.define("shared-partner-program", SharedPartnerProgram);
