import cssText from "/src/styles/main.scss?inline";

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
    const htmlRes = await fetch(
      "./components/shared/statistics/component.html"
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

    this.setupListeners();
    this.updateValues();
  }

  static get observedAttributes() {
    return [
      "paid-amount",
      "paid-amount-usd",
      "unpaid-amount",
      "unpaid-amount-usd",
      "refund-amount",
      "refund-amount-usd",
      "paid-orders",
      "unpaid-orders",
      "refund-orders",
    ];
  }

  setupListeners() {
    this.dateComponent = this.shadowRoot.querySelector("shared-date");
    this.dataClear = this.shadowRoot.querySelector(
      ".shared-statistics__filters-clear-button"
    );
    this.dataClearMobile = this.shadowRoot.querySelector(
      ".shared-statistics__date-clear"
    );
    this.toggle = this.shadowRoot.querySelector(".shared-statistics__toggle");
    this.toggleIcon = this.shadowRoot.querySelector(
      ".shared-statistics__toggle-icon"
    );
    this.content = this.shadowRoot.querySelector(".shared-statistics__content");

    this.toggle.addEventListener("click", () => {
      this.toggleIcon.classList.toggle(
        "shared-statistics__toggle-icon--active"
      );
      this.content.classList.toggle("shared-statistics__content--hide");
    });

    const clearFilters = () => {
      this.filters = {
        paymentStatus: "all",
        payoutStatus: "all",
        paymentType: "all",
        dateRange: null,
      };

      this.dateComponent.selectedDateRange = null;
      this.dateComponent.clearSelection();
      this.updateUI();
      this.emitFilterChange();
    };

    this.dataClear.addEventListener("click", clearFilters);
    this.dataClearMobile.addEventListener("click", clearFilters);

    this.dateComponent.addEventListener("date-change", (event) => {
      this.filters.dateRange = event.detail;
      this.updateUI();
      this.emitFilterChange();
    });

    this.shadowRoot.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.updateFilter(event);
        this.emitFilterChange();
      });
    });
  }

  updateFilter(event) {
    const type = event.target.getAttribute("data-filter");
    const value = event.target.getAttribute("data-value");

    if (type && value) {
      this.filters[type] = value;
      this.updateUI();
      this.emitFilterChange();
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

      button.classList.toggle(
        "shared-statistics__group-button--active",
        this.filters[type] === value
      );
    });
  }

  updateValues() {
    this.shadowRoot.querySelector("[data-paid-amount]").textContent =
      this.getAttribute("paid-amount") || "0₽";
    this.shadowRoot.querySelector("[data-paid-amount-usd]").textContent =
      this.getAttribute("paid-amount-usd") || "$0";

    this.shadowRoot.querySelector("[data-unpaid-amount]").textContent =
      this.getAttribute("unpaid-amount") || "0₽";
    this.shadowRoot.querySelector("[data-unpaid-amount-usd]").textContent =
      this.getAttribute("unpaid-amount-usd") || "$0";

    this.shadowRoot.querySelector("[data-refund-amount]").textContent =
      this.getAttribute("refund-amount") || "0₽";
    this.shadowRoot.querySelector("[data-refund-amount-usd]").textContent =
      this.getAttribute("refund-amount-usd") || "$0";

    this.shadowRoot.querySelector("[data-paid-orders]").textContent =
      this.getAttribute("paid-orders") || "0";
    this.shadowRoot.querySelector("[data-unpaid-orders]").textContent =
      this.getAttribute("unpaid-orders") || "0";
    this.shadowRoot.querySelector("[data-refund-orders]").textContent =
      this.getAttribute("refund-orders") || "0";
  }
}

customElements.define("shared-statistics", SharedStatistics);
