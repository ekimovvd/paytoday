import cssText from "/src/styles/main.scss?inline";

export class SharedPagination extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async connectedCallback() {
    const htmlRes = await fetch(
      "./components/shared/pagination/component.html"
    );
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.paginationContainer =
      this.shadowRoot.querySelector(".shared-pagination");
    this.render();
  }

  static get observedAttributes() {
    return ["current-page", "total-pages"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-page") {
      this.currentPage = parseInt(newValue, 10) || 1;
    }
    if (name === "total-pages") {
      this.totalPages = parseInt(newValue, 10) || 1;
    }
    this.render();
  }

  render() {
    if (!this.paginationContainer) return;

    this.paginationContainer.innerHTML = "";
    if (this.totalPages <= 1) return;

    let pages = this.generatePages();

    this.paginationContainer.innerHTML = `
      <div class="shared-pagination__wrapper">
        ${pages
          .map((page) =>
            page === "..."
              ? `<span class="shared-pagination__dots">${page}</span>`
              : `<button class="shared-pagination__item shared-pagination__item-number ${
                  page === this.currentPage
                    ? "shared-pagination__item-number--active"
                    : ""
                }" data-page="${page}">${page}</button>`
          )
          .join("")}
      </div>

      <button class="shared-pagination__item shared-pagination__next" ${
        this.currentPage === this.totalPages ? "disabled" : ""
      } data-page="next">
        Следующая <img src="assets/icons/arrow-right.svg" alt="arrow-right">
      </button>
    `;

    this.paginationContainer
      .querySelectorAll(".shared-pagination__item")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const page = button.dataset.page;
          this.changePage(
            page === "prev"
              ? this.currentPage - 1
              : page === "next"
              ? this.currentPage + 1
              : parseInt(page, 10)
          );
        });
      });
  }

  generatePages() {
    let pages = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 1);
      const endPage = Math.min(this.totalPages, this.currentPage + 1);

      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push("...");

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) pages.push("...");
      if (endPage < this.totalPages) pages.push(this.totalPages);
    }
    return pages;
  }

  changePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.setAttribute("current-page", page);
    this.dispatchEvent(new CustomEvent("page-change", { detail: { page } }));
  }
}

customElements.define("shared-pagination", SharedPagination);
