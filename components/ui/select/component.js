import cssText from "/src/styles/main.scss?inline";

export class UISelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/ui/select/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.select = this.shadowRoot.querySelector(".ui-select");
    this.toggleButton = this.shadowRoot.querySelector(".ui-select__toggle");
    this.toggleLabel = this.shadowRoot.querySelector(
      ".ui-select__toggle-label"
    );
    this.selectedElement = this.shadowRoot.querySelector(
      ".ui-select__toggle-selected"
    );
    this.dropdown = this.shadowRoot.querySelector(".ui-select__dropdown");
    this.toggleIcon = this.shadowRoot.querySelector(".ui-select__toggle-icon");
    this.toggleEllipse = this.shadowRoot.querySelector(
      ".ui-select__toggle-ellipse"
    );
    this.toggleRequired = this.shadowRoot.querySelector(
      ".ui-select__toggle-required"
    );

    this.toggleButton.addEventListener("click", () => this.toggleDropdown());

    this.updateOptions();

    if (this.hasAttribute("placeholder")) {
      this.toggleEllipse.textContent = this.getAttribute("placeholder");
    } else {
      this.toggleEllipse.textContent = "Выберите вид платежа";
    }

    if (this.hasAttribute("no-required")) {
      this.toggleRequired.classList.add("ui-select__toggle-required--hidden");
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.select.classList.toggle("ui-select--active", this.isOpen);
    this.toggleIcon.classList.toggle(
      "ui-select__toggle-icon--active",
      this.isOpen
    );
  }

  updateOptions() {
    const options = this.querySelectorAll("ui-option");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        this.value = option.getAttribute("value");
        this.dispatchEvent(
          new CustomEvent("update", {
            detail: this.value,
            bubbles: true,
            composed: true,
          })
        );

        this.toggleDropdown();
      });
    });
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      this.updateSelected();
    }
  }

  updateSelected() {
    const options = this.querySelectorAll("ui-option");
    options.forEach((option) => {
      if (option.getAttribute("value") === this.value) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    });

    const selectedOption = [...options].find(
      (option) => option.getAttribute("value") === this.value
    );
    this.selectedElement.textContent = selectedOption
      ? selectedOption.textContent
      : "";
    this.toggleLabel.classList.toggle(
      "ui-select__toggle-label--hidden",
      !!selectedOption
    );
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(val) {
    this.setAttribute("value", val);
  }
}

customElements.define("ui-select", UISelect);
