import { loadStyles } from "../../../js/utils";

export class UITextarea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/textarea/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.textarea = this.shadowRoot.querySelector(".ui-textarea");

    if (this.hasAttribute("placeholder")) {
      this.textarea.placeholder = this.getAttribute("placeholder");
    }

    if (this.hasAttribute("value")) {
      this.textarea.value = this.getAttribute("value");
    }

    this.textarea.addEventListener("input", () => {
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: this.textarea.value,
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  get value() {
    return this.textarea?.value || "";
  }

  set value(val) {
    if (this.textarea) {
      this.textarea.value = val;
    }
  }
}

customElements.define("ui-textarea", UITextarea);
