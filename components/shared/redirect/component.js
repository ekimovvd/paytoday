export class SharedRedirect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/redirect/component.html"),
      fetch("/components/shared/redirect/component.css"),
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

    this.link = this.shadowRoot.querySelector(".shared-redirect");

    const href = this.getAttribute("href");
    if (href) {
      this.link.setAttribute("href", href);
    }
  }
}

customElements.define("shared-redirect", SharedRedirect);
