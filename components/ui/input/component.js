import { loadStyles } from "../../../js/utils.js";

export class UIInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isClearVisible = true;
    this.isCopyVisible = false;
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/input/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.field = this.shadowRoot.querySelector(".ui-input__field");
    this.clearButton = this.shadowRoot.querySelector(".ui-input__clear");
    this.errorMessage = this.shadowRoot.querySelector(".ui-input__error");
    this.description = this.shadowRoot.querySelector(".ui-input__description");
    this.copy = this.shadowRoot.querySelector(".ui-input__copy");

    if (this.hasAttribute("placeholder")) {
      this.field.placeholder = this.getAttribute("placeholder");
    }

    if (this.hasAttribute("value")) {
      this.field.value = this.getAttribute("value");
    }

    if (this.hasAttribute("description")) {
      this.isClearVisible = false;

      this.field.classList.add("ui-input__field--description");
      this.description.textContent = this.getAttribute("description");
      this.description.classList.add("ui-input__description--visible");
    }

    if (this.hasAttribute("copy")) {
      this.isClearVisible = false;
      this.isCopyVisible = true;

      this.field.classList.add("ui-input__field--copy");
      this.copy.classList.add("ui-input__copy--visible");
    }

    if (this.hasAttribute("type")) {
      this.field.setAttribute("type", this.getAttribute("type"));
    }

    this.updateErrorState();

    this.field.addEventListener("input", () => {
      if (this.isCopyVisible) {
        this.copy.setAttribute("copy-text", this.field.value);
      }

      this.dispatchEvent(
        new CustomEvent("update", {
          detail: this.field.value,
          bubbles: true,
          composed: true,
        })
      );

      if (this.isClearVisible) {
        this.clearButton.classList.toggle(
          "ui-input__clear--hidden",
          !this.field.value
        );
      }
    });

    this.clearButton.addEventListener("click", () => {
      this.field.value = "";
      this.clearButton.classList.add("ui-input__clear--hidden");
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: "",
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  updateErrorState() {
    const errorText = this.getAttribute("error");

    if (errorText) {
      this.errorMessage.classList.remove("ui-input__error--hidden");
      this.field.classList.add("ui-input__field--error");
    } else {
      this.errorMessage.classList.add("ui-input__error--hidden");
      this.field.classList.remove("ui-input__field--error");
    }
  }

  static get observedAttributes() {
    return ["error"];
  }

  attributeChangedCallback(name) {
    if (name === "error") {
      this.updateErrorState();
    }
  }

  get value() {
    return this.field?.value || "";
  }

  set value(val) {
    if (this.field) {
      this.field.value = val;

      if (this.isCopyVisible) {
        this.copy.setAttribute("copy-text", this.field.value);
      }

      if (this.isClearVisible) {
        this.clearButton.classList.toggle("ui-input__clear--hidden", !val);
      }
    }
  }
}

customElements.define("ui-input", UIInput);
