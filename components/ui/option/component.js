import { loadStyles } from "../../../js/utils.js";

export class UIOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/option/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.option = this.shadowRoot.querySelector(".ui-option");

    this.select = this.closest("ui-select");

    this.option.addEventListener("click", () => {
      if (this.select) {
        this.select.value = this.getAttribute("value");
      }
    });

    this.updateState();
  }

  static get observedAttributes() {
    return ["selected"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "selected") {
      this.updateState();
    }
  }

  updateState() {
    if (this.hasAttribute("selected")) {
      this.option?.classList.add("ui-option--active");
    } else {
      this.option?.classList.remove("ui-option--active");
    }
  }

  update() {
    const select = this.closest("ui-select");

    if (select) {
      setTimeout(() => {
        select.value = this.getAttribute("value");
      }, 1000);
    }
  }
}

customElements.define("ui-option", UIOption);
