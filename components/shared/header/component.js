export class SharedHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("./components/shared/header/component.html"),
      fetch("./components/shared/header/component.css"),
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

    this.menuButton = this.shadowRoot.querySelector(".shared-header__burger");

    this.menuButton.addEventListener("click", () => {
      const menu = document.getElementById("menu");

      menu.open();
    });
  }
}

customElements.define("shared-header", SharedHeader);
