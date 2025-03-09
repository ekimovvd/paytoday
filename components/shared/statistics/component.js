export class SharedStatistics extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.filters = {
      paymentStatus: "all",
      payoutStatus: "all",
      paymentType: "all",
      dateRange: null,
    };
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/statistics/component.html"),
      fetch("/components/shared/statistics/component.css"),
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

    this.setupListeners();
  }

  setupListeners() {
    this.content = this.shadowRoot.querySelector(".shared-statistics__content");
    this.toggle = this.shadowRoot.querySelector(".shared-statistics__toggle");
    this.toggleIcon = this.shadowRoot.querySelector(
      ".shared-statistics__toggle-icon"
    );

    this.toggle.addEventListener("click", () => {
      this.content.classList.toggle("shared-statistics__content--hide");
      this.toggleIcon.classList.toggle(
        "shared-statistics__toggle-icon--active"
      );
    });

    this.shadowRoot.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", (event) => this.updateFilter(event));
    });

    this.shadowRoot
      .querySelector("[data-clear]")
      .addEventListener("click", () => {
        this.filters.dateRange = null;
        this.emitFilterChange();
        this.updateUI();
      });
  }

  updateFilter(event) {
    const type = event.target.getAttribute("data-filter");
    const value = event.target.getAttribute("data-value");

    if (type && value) {
      this.filters[type] = value;
      this.emitFilterChange();
      this.updateUI();
    }
  }

  emitFilterChange() {
    this.dispatchEvent(
      new CustomEvent("filter-change", {
        detail: this.filters,
        bubbles: true,
        composed: true,
      })
    );
  }

  updateUI() {
    this.shadowRoot.querySelectorAll("[data-filter]").forEach((button) => {
      const type = button.getAttribute("data-filter");
      const value = button.getAttribute("data-value");

      if (this.filters[type] === value) {
        button.classList.add("shared-statistics__group-button--active");
      } else {
        button.classList.remove("shared-statistics__group-button--active");
      }
    });

    this.shadowRoot.querySelector("[data-date]").textContent =
      this.filters.dateRange || "Выбрать дату";
  }
}

customElements.define("shared-statistics", SharedStatistics);
