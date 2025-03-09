export class SharedCopy extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isPopupVisible = false;
    this.isCopied = false;
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
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
    this.popup = this.shadowRoot.querySelector(".shared-copy__popup");
    this.popupText = this.shadowRoot.querySelector(".shared-copy__popup-text");
    this.popupIcon = this.shadowRoot.querySelector(".shared-copy__popup-icon");
    this.copyText = this.getAttribute("copy-text") || "";

    this.popupText.textContent = "Копировать";

    this.button.addEventListener("click", (event) => {
      if (!this.isCopied) {
        this.togglePopup(event);
      }
    });
    this.popup.addEventListener("click", () => this.copyToClipboard());
  }

  togglePopup(event) {
    event.stopPropagation();

    if (this.isPopupVisible) {
      this.hidePopup();
    } else {
      this.showPopup();
    }
  }

  showPopup() {
    this.popup.classList.add("shared-copy__popup--visible");
    this.isPopupVisible = true;
    document.addEventListener("click", this.handleOutsideClick);
  }

  hidePopup() {
    this.popup.classList.remove("shared-copy__popup--visible");
    this.isPopupVisible = false;
    document.removeEventListener("click", this.handleOutsideClick);
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.copyText);
      this.isCopied = true;
      this.popupText.textContent = "Скопировано";
      this.popupIcon.classList.add("shared-copy__popup-icon--visible");

      setTimeout(() => {
        this.resetPopup();
      }, 2000);
    } catch (err) {
      console.error("Ошибка копирования: ", err);
    }
  }

  handleOutsideClick(event) {
    if (!this.contains(event.target) && !this.isCopied) {
      this.hidePopup();
    }
  }

  resetPopup() {
    this.popupText.textContent = "Копировать";
    this.isCopied = false;
    this.popupIcon.classList.remove("shared-copy__popup-icon--visible");
    this.hidePopup();
  }
}

customElements.define("shared-copy", SharedCopy);
