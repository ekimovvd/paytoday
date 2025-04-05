import { loadStyles } from "../../../js/utils";

export class SharedCopy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/copy/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.button = this.shadowRoot.querySelector(".shared-copy__toggle");
    this.popup = this.shadowRoot.querySelector(".shared-copy__popup");

    this.button.addEventListener("click", () => this.copyText());
  }

  copyText() {
    const textToCopy = this.getAttribute("copy-text");

    if (!textToCopy) {
      console.error("Нет текста для копирования");
      return;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.showPopup();
      })
      .catch((err) => {
        console.error("Ошибка копирования:", err);
      });
  }

  showPopup() {
    this.popup.classList.add("shared-copy__popup--visible");

    setTimeout(() => {
      this.popup.classList.remove("shared-copy__popup--visible");
    }, 2000);
  }
}

customElements.define("shared-copy", SharedCopy);
