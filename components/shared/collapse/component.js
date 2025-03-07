export class SharedCollapse extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isCollapse = false;
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/collapse/component.html"),
      fetch("/components/shared/collapse/component.css"),
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

    this.collapse = this.shadowRoot.querySelector(".shared-collapse");
    this.header = this.shadowRoot.querySelector(".shared-collapse__header");
    this.heading = this.shadowRoot.querySelector(".shared-collapse__title");
    this.icon = this.shadowRoot.querySelector(".shared-collapse__icon");

    this.heading.textContent = this.getAttribute("title") || "Раздел";

    const iconAttribute = this.getAttribute("icon");
    if (iconAttribute) {
      this.icon.src = iconAttribute;
    }

    this.header.addEventListener("click", () => {
      this.toggleCollapse();
    });

    document.addEventListener("active-collapse-changed", (event) => {
      if (event.detail !== this) {
        this.close();
      }
    });
  }

  toggleCollapse() {
    if (!this.isCollapse) {
      document.dispatchEvent(
        new CustomEvent("active-collapse-changed", { detail: this })
      );

      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.collapse.classList.add("shared-collapse--active");
    this.isCollapse = true;
  }

  close() {
    this.collapse.classList.remove("shared-collapse--active");
    this.isCollapse = false;
  }
}

customElements.define("shared-collapse", SharedCollapse);
