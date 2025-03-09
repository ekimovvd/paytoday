export class SharedSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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

    this.toggleButton.addEventListener("click", () => {
      this.sidebar.classList.toggle("shared-sidebar--expanded");

      if (this.sidebar.classList.contains("shared-sidebar--expanded")) {
        this.search.removeAttribute("isSidebar");
      } else {
        this.search.setAttribute("isSidebar", "");
      }
    });
  }
}

customElements.define("shared-sidebar", SharedSidebar);
