export class SharedModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const [htmlRes, cssRes] = await Promise.all([
        fetch("./components/shared/modal/component.html"),
        fetch("./components/shared/modal/component.css"),
      ]);

      if (!htmlRes.ok || !cssRes.ok) {
        throw new Error("Ошибка загрузки файлов");
      }

      const [htmlText, cssText] = await Promise.all([
        htmlRes.text(),
        cssRes.text(),
      ]);

      const templateDiv = document.createElement("div");
      templateDiv.innerHTML = htmlText;
      const template = templateDiv.querySelector("template");

      if (!template) {
        throw new Error("Шаблон не найден в HTML");
      }

      const templateContent = template.content.cloneNode(true);
      const style = document.createElement("style");
      style.textContent = cssText;

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(templateContent);

      this.modal = this.shadowRoot.querySelector(".shared-modal");
      this.icon = this.shadowRoot.querySelector(".shared-modal__icon-img");
      this.heading = this.shadowRoot.querySelector(".shared-modal__heading");
      this.confirmButton = this.shadowRoot.querySelector(
        ".shared-modal__confirm"
      );
      this.cancelButton = this.shadowRoot.querySelector(
        ".shared-modal__cancel"
      );
      this.closeButton = this.shadowRoot.querySelector(".shared-modal__close");
      this.backdrop = this.shadowRoot.querySelector(".shared-modal__backdrop");

      this.closeButton?.addEventListener("click", () => this.close());
      this.cancelButton?.addEventListener("click", () => this.close());

      this.backdrop?.addEventListener("click", (event) => {
        if (event.target === this.backdrop) {
          this.close();
        }
      });

      this.confirmButton?.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("confirm", { bubbles: true, composed: true })
        );
        this.close();
      });
    } catch (error) {
      console.error("Ошибка в модальном окне:", error);
    }
  }

  open({ type, icon, title, confirmText, cancelText }) {
    if (this.icon && icon) this.icon.src = icon;
    if (this.heading && title) this.heading.textContent = title;
    if (this.confirmButton && confirmText)
      this.confirmButton.textContent = confirmText;
    if (this.cancelButton && cancelText)
      this.cancelButton.textContent = cancelText;

    if (type) {
      this.type = type;
      this.modal.classList.add(`shared-modal--${type}`);
    }

    if (this.modal) {
      this.modal.classList.add("shared-modal--open");
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove("shared-modal--open");
    }
  }
}

customElements.define("shared-modal", SharedModal);
