import cssText from "/src/styles/main.scss?inline";

export class SharedMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/menu/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.menu = this.shadowRoot.querySelector(".shared-menu");

    const getElement = (id) =>
      this.shadowRoot.querySelector(`[data-id="${id}"]`);

    let searchQuery = "";

    const handleSearch = getElement("search-menu");
    const handleClose = getElement("cross-menu");

    if (handleSearch) {
      handleSearch.addEventListener("search", (event) => {
        searchQuery = event.detail.trim();

        console.log("Поиск:", searchQuery);
      });
    }

    if (handleClose) {
      handleClose.addEventListener("click", () => {
        this.menu.classList.remove("shared-menu--open");
      });
    }
  }

  open() {
    this.menu.classList.add("shared-menu--open");
  }
}

customElements.define("shared-menu", SharedMenu);
