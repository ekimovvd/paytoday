import { loadStyles } from "../../../js/utils.js";

export class UIButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["isfull", "view"];
  }

  attributeChangedCallback(name) {
    if (name === "isfull" || name === "view") {
      this.updateButtonStyles();
    }
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/button/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.updateButtonStyles();
  }

  updateButtonStyles() {
    const button = this.shadowRoot.querySelector(".ui-button");
    if (button) {
      if (this.hasAttribute("isfull")) {
        button.classList.add("ui-button--full");
      } else {
        button.classList.remove("ui-button--full");
      }

      if (this.hasAttribute("view")) {
        button.classList.add(`ui-button--view-${this.getAttribute("view")}`);
      } else {
        button.classList.remove(`ui-button--view-${this.getAttribute("view")}`);
      }
    }
  }

  get isFull() {
    return this.hasAttribute("isfull");
  }

  set isFull(value) {
    if (value) {
      this.setAttribute("isfull", "");
    } else {
      this.removeAttribute("isfull");
    }
  }
}

customElements.define("ui-button", UIButton);
