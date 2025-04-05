import { loadStyles } from "../../../js/utils";

export class SharedSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isExpanded = false;
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/sidebar/component.html");

    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.sidebar = this.shadowRoot.querySelector(".shared-sidebar");
    this.toggleButton = this.shadowRoot.querySelector(".shared-sidebar__logo");
    this.collapseHeaders = this.shadowRoot.querySelectorAll(
      ".shared-sidebar__collapse-header"
    );
    this.openButton = this.shadowRoot.querySelector(".shared-sidebar__open");

    this.toggleButton.addEventListener("click", () => this.toggleSidebar());
    this.openButton.addEventListener("click", () => this.toggleSidebar());

    this.collapseHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        if (!this.isExpanded) {
          this.openSidebar();
        }
        this.toggleCollapse(header);
      });
    });

    document.addEventListener("click", this.handleOutsideClick);
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebar.classList.toggle("shared-sidebar--expanded", this.isExpanded);

    if (!this.isExpanded) {
      this.sidebar.classList.add("shared-sidebar--hidden");
    } else {
      this.sidebar.classList.remove("shared-sidebar--hidden");
    }
  }

  openSidebar() {
    this.isExpanded = true;
    this.sidebar.classList.add("shared-sidebar--expanded");
    this.sidebar.classList.remove("shared-sidebar--hidden");
  }

  closeSidebar() {
    this.isExpanded = false;
    this.sidebar.classList.remove("shared-sidebar--expanded");
    this.sidebar.classList.add("shared-sidebar--hidden");
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
        header.nextElementSibling.style.display = "none";
      }
    });
  }

  handleOutsideClick(event) {
    if (!this.contains(event.target) && this.isExpanded) {
      this.closeSidebar();
    }
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleOutsideClick);
  }
}

customElements.define("shared-sidebar", SharedSidebar);
