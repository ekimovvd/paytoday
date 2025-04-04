import cssText from "/src/styles/main.scss?inline";

export class SharedTrash extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/trash/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);
  }
}

customElements.define("shared-trash", SharedTrash);
