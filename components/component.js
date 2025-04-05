import cssText from "/src/styles/main.scss?inline";

export class UIRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/radio/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.radio = this.shadowRoot.querySelector(".ui-radio");

    this.updateActiveState();

    this.radio.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("update", {
          detail: this.getAttribute("option"),
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  static get observedAttributes() {
    return ["value", "option"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value" || name === "option") {
      this.updateActiveState();
    }
  }

  updateActiveState() {
    const value = this.getAttribute("value");
    const option = this.getAttribute("option");

    if (value === option) {
      this.radio?.classList.add("ui-radio--active");
    } else {
      this.radio?.classList.remove("ui-radio--active");
    }
  }
}

customElements.define("ui-radio", UIRadio);
