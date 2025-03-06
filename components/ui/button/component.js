export class UIButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["isfull"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "isfull") {
      this.updateButtonStyles();
    }
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("./components/ui/button/component.html"),
      fetch("./components/ui/button/component.css"),
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

    this.updateButtonStyles();

    const button = this.shadowRoot.querySelector(".ui-button");
    if (button) {
      button.addEventListener("click", () => {
        window.history.back();
      });
    }
  }

  updateButtonStyles() {
    const button = this.shadowRoot.querySelector(".ui-button");
    if (button) {
      if (this.hasAttribute("isfull")) {
        button.classList.add("ui-button--full");
      } else {
        button.classList.remove("ui-button--full");
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
