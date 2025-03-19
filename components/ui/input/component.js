export class UIInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("./components/ui/input/component.html"),
      fetch("./components/ui/input/component.css"),
    ]);

    const [htmlText, cssText] = await Promise.all([
      htmlRes.text(),
      cssRes.text(),
    ]);

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;
    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.field = this.shadowRoot.querySelector(".ui-input__field");
    this.clearButton = this.shadowRoot.querySelector(".ui-input__clear");
    this.errorMessage = this.shadowRoot.querySelector(".ui-input__error");

    if (this.hasAttribute("placeholder")) {
      this.field.placeholder = this.getAttribute("placeholder");
    }

    if (this.hasAttribute("value")) {
      this.field.value = this.getAttribute("value");
    }

    this.updateErrorState();

    this.field.addEventListener("input", () => {
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: this.field.value,
          bubbles: true,
          composed: true,
        })
      );

      this.clearButton.classList.toggle(
        "ui-input__clear--hidden",
        !this.field.value
      );
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
      this.clearButton.classList.toggle("ui-input__clear--hidden", !val);
    }
  }
}

customElements.define("ui-input", UIInput);
