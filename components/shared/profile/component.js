import { loadStyles } from "../../../js/utils.js";

export class SharedProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/profile/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.container = this.shadowRoot.querySelector(".shared-profile");

    this.toggle = this.shadowRoot.querySelector(
      ".shared-profile__account-toggle"
    );
    this.dropdown = this.shadowRoot.querySelector(
      ".shared-profile__account-dropdown"
    );
    this.exit = this.shadowRoot.querySelector(
      ".shared-profile__account-item--exit"
    );

    this.toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      this.dropdown.classList.toggle(
        "shared-profile__account-dropdown--visible"
      );

      if (
        this.dropdown.classList.contains(
          "shared-profile__account-dropdown--visible"
        )
      ) {
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        document.removeEventListener("click", this.handleOutsideClick);
      }
    });

    this.exit.addEventListener("click", () => {
      console.log("Exit");
    });

    this.applyModifier();
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  handleOutsideClick(event) {
    if (!this.contains(event.target)) {
      this.dropdown.classList.remove(
        "shared-profile__account-dropdown--visible"
      );
      document.removeEventListener("click", this.handleOutsideClick);
    }
  }

  static get observedAttributes() {
    return ["modifier"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "modifier") {
      this.applyModifier();
    }
  }

  applyModifier() {
    if (this.container) {
      const modifier = this.getAttribute("modifier");
      this.container.className = "shared-profile";

      if (modifier) {
        this.container.classList.add(`shared-profile--${modifier}`);
      }
    }
  }
}

customElements.define("shared-profile", SharedProfile);
