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
      fetch("./components/shared/statistics/component.html"),
      fetch("./components/shared/statistics/component.css"),
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
    this.content = this.shadowRoot.querySelector(".shared-statistics__content");
    this.toggle = this.shadowRoot.querySelector(".shared-statistics__toggle");
    this.toggleIcon = this.shadowRoot.querySelector(
      ".shared-statistics__toggle-icon"
    );
    this.dateButton = this.shadowRoot.querySelector(
      ".shared-statistics__date-button"
    );
    this.dateCalendar = this.shadowRoot.querySelector(
      ".shared-statistics__date-calendar"
    );
    this.dateIcon = this.shadowRoot.querySelector(
      ".shared-statistics__date-button-icon"
    );

    this.dateCalendar.addEventListener("close", () => {
      toggleCalendar();
    });

    this.dateButton.addEventListener("click", () => {
      toggleCalendar();
    });

    const toggleCalendar = () => {
      this.dateButton.classList.toggle(
        "shared-statistics__date-button--active"
      );
      this.dateCalendar.classList.toggle(
        "shared-statistics__date-calendar--active"
      );
      this.dateIcon.src = this.dateButton.classList.contains(
        "shared-statistics__date-button--active"
      )
        ? "assets/icons/calendar-white.svg"
        : "assets/icons/calendar.svg";
    };

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
