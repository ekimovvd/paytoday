import { loadStyles } from "../../../js/utils.js";

export class SharedReplicate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isCopied = false;
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/replicate/component.html");

    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.button = this.shadowRoot.querySelector(".shared-replicate");

    this.button.addEventListener("click", () => this.copyText());
  }

  copyText() {
    if (!this.isCopied) {
      this.isCopied = true;

      const textToCopy = this.getAttribute("copy-text");

      if (!textToCopy) {
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        this.button.classList.add("shared-replicate--active");

        setTimeout(() => {
          this.isCopied = false;

          this.button.classList.remove("shared-replicate--active");
        }, 2000);
      });
    }
  }
}

customElements.define("shared-replicate", SharedReplicate);
