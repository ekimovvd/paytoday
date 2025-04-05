import { loadStyles } from "../../../js/utils";

export class SharedSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/search/component.html");

    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.search = this.shadowRoot.querySelector(".shared-search");
    this.input = this.shadowRoot.querySelector(".shared-search__input");
    this.clearButton = this.shadowRoot.querySelector(".shared-search__clear");
    this.wrapper = this.shadowRoot.querySelector(".shared-search");

    if (this.hasAttribute("placeholder")) {
      this.input.placeholder = this.getAttribute("placeholder");
    }

    if (this.hasAttribute("isWhite")) {
      this.search.classList.add("shared-search--white");
    }

    this.input.addEventListener("input", () => this.updateState());
    this.clearButton.addEventListener("click", () => this.clearInput());
  }

  updateState() {
    if (this.input.value) {
      this.wrapper.classList.add("has-value");
    } else {
      this.wrapper.classList.remove("has-value");
    }
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: this.input.value,
        bubbles: true,
        composed: true,
      })
    );
  }

  clearInput() {
    this.input.value = "";
    this.updateState();
  }
}

customElements.define("shared-search", SharedSearch);
