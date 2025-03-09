export class SharedSort extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.sortOrder = null;
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/sort/component.html"),
      fetch("/components/shared/sort/component.css"),
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

    this.button = this.shadowRoot.querySelector(".shared-sort");
    this.iconUp = this.shadowRoot.querySelector(".shared-sort__icon--up");
    this.iconDown = this.shadowRoot.querySelector(".shared-sort__icon--down");

    this.button.addEventListener("click", () => this.toggleSort());
  }

  toggleSort() {
    if (this.sortOrder === null) {
      this.sortOrder = "asc";
    } else if (this.sortOrder === "asc") {
      this.sortOrder = "desc";
    } else {
      this.sortOrder = null;
    }

    this.updateIcons();
    this.dispatchEvent(
      new CustomEvent("sort-change", {
        detail: { order: this.sortOrder },
        bubbles: true,
        composed: true,
      })
    );
  }

  updateIcons() {
    this.iconUp.classList.remove("shared-sort__icon--active");
    this.iconDown.classList.remove("shared-sort__icon--active");

    if (this.sortOrder === "asc") {
      this.iconUp.classList.add("shared-sort__icon--active");
    } else if (this.sortOrder === "desc") {
      this.iconDown.classList.add("shared-sort__icon--active");
    }
  }
}

customElements.define("shared-sort", SharedSort);
