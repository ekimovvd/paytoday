export class SharedSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isExpanded = false;
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("./components/shared/sidebar/component.html"),
      fetch("./components/shared/sidebar/component.css"),
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

    this.sidebar = this.shadowRoot.querySelector(".shared-sidebar");
    this.toggleButton = this.shadowRoot.querySelector(".shared-sidebar__logo");
    this.navItems = this.shadowRoot.querySelectorAll(
      ".shared-sidebar__navigation-item"
    );
    this.search = this.shadowRoot.querySelector(".shared-sidebar__search");
    this.collapseHeaders = this.shadowRoot.querySelectorAll(
      ".shared-sidebar__collapse-header"
    );
    this.collapseContents = this.shadowRoot.querySelectorAll(
      ".shared-sidebar__collapse-content"
    );

    this.toggleButton.addEventListener("click", () => {
      this.isExpanded = !this.isExpanded;
      this.sidebar.classList.toggle(
        "shared-sidebar--expanded",
        this.isExpanded
      );

      if (!this.isExpanded) {
        this.sidebar.classList.add("shared-sidebar--hidden");
      } else {
        this.sidebar.classList.remove("shared-sidebar--hidden");
      }
    });

    this.collapseHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        if (!this.isExpanded) {
          this.isExpanded = true;

          this.sidebar.classList.toggle("shared-sidebar--expanded", true);
          this.sidebar.classList.remove("shared-sidebar--hidden");
        }

        this.toggleCollapse(header);
      });
    });
  }

  toggleCollapse(activeHeader) {
    this.collapseHeaders.forEach((header) => {
      const content = header.nextElementSibling;
      const parent = header.parentElement;

      if (header === activeHeader) {
        const isOpen = parent.classList.contains(
          "shared-sidebar__collapse--active"
        );
        parent.classList.toggle("shared-sidebar__collapse--active", !isOpen);
        content.style.display = isOpen ? "none" : "flex";
      } else {
        parent.classList.remove("shared-sidebar__collapse--active");
        content.style.display = "none";
      }
    });
  }
}

customElements.define("shared-sidebar", SharedSidebar);
