import { loadStyles } from "../../../js/utils.js";

export class UISwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/switch/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.switch = this.shadowRoot.querySelector(".ui-switch");

    this.updateState();

    this.switch.addEventListener("click", () => {
      this.toggle();
    });
  }

  static get observedAttributes() {
    return ["checked"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      this.updateState();
    }
  }

  updateState() {
    if (this.hasAttribute("checked")) {
      this.switch?.classList.add("ui-switch--checked");
    } else {
      this.switch?.classList.remove("ui-switch--checked");
    }
  }

  toggle() {
    if (this.hasAttribute("checked")) {
      this.removeAttribute("checked");
    } else {
      this.setAttribute("checked", "");
    }

    this.dispatchEvent(
      new CustomEvent("update", {
        detail: this.hasAttribute("checked"),
        bubbles: true,
        composed: true,
      })
    );
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value) {
    if (value) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }
}

customElements.define("ui-switch", UISwitch);
