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

    this.navItems = this.shadowRoot.querySelectorAll(
      ".shared-sidebar__navigation-item"
    );

    this.navItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.navItems.forEach((el) =>
          el.classList.remove("shared-sidebar__navigation-item--active")
        );
        item.classList.add("shared-sidebar__navigation-item--active");

        const route = item.getAttribute("data-route");
        this.dispatchEvent(
          new CustomEvent("navigate", {
            detail: route,
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }
}

customElements.define("shared-sidebar", SharedSidebar);
