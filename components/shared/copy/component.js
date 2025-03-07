export class SharedCopy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/copy/component.html"),
      fetch("/components/shared/copy/component.css"),
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

    this.button = this.shadowRoot.querySelector(".shared-copy__toggle");
    this.copyText = this.getAttribute("copy-text") || "";

    this.button.addEventListener("click", () => this.copyToClipboard());
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.copyText);
      this.dispatchEvent(
        new CustomEvent("copy-success", { bubbles: true, composed: true })
      );
    } catch (err) {
      console.error("Ошибка копирования: ", err);
    }
  }
}

customElements.define("shared-copy", SharedCopy);
