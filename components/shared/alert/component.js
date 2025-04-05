import { loadStyles } from "../../../js/utils.js";

export class SharedAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["heading"];
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/alert/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.modal = this.shadowRoot.querySelector(".shared-alert");
    this.closeButton = this.shadowRoot.querySelector(".shared-alert__close");
    this.backdrop = this.shadowRoot.querySelector(".shared-alert__backdrop");
    this.titleElement = this.shadowRoot.querySelector(".shared-alert__title");

    this.updateTitle();

    this.closeButton?.addEventListener("click", () => this.close());
    this.backdrop?.addEventListener("click", (event) => {
      if (event.target === this.backdrop) {
        this.close();
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "heading") {
      this.updateTitle();
    }
  }

  updateTitle() {
    if (this.titleElement) {
      this.titleElement.textContent = this.getAttribute("heading") || "";
    }
  }

  open() {
    if (this.modal) {
      this.modal.classList.add("shared-alert--open");
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("shared-alert--open");
    }
  }
}

customElements.define("shared-alert", SharedAlert);
