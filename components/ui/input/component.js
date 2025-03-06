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

    this.input = this.shadowRoot.querySelector(".ui-input");

    if (this.hasAttribute("placeholder")) {
      this.input.placeholder = this.getAttribute("placeholder");
    }

    if (this.hasAttribute("value")) {
      this.input.value = this.getAttribute("value");
    }

    this.input.addEventListener("input", () => {
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: this.input.value,
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  get value() {
    return this.input?.value || "";
  }

  set value(val) {
    if (this.input) {
      this.input.value = val;
    }
  }
}

customElements.define("ui-input", UIInput);
