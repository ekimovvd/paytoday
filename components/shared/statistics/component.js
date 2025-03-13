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
    this.isCalendarOpen = false;
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
    this.dateButton = this.shadowRoot.querySelector(
      ".shared-statistics__date-button"
    );
    this.dateCalendar = this.shadowRoot.querySelector(
      ".shared-statistics__date-calendar"
    );
    this.dateIcon = this.shadowRoot.querySelector(
      ".shared-statistics__date-button-icon"
    );
    this.dateButtonClear = this.shadowRoot.querySelector(
      ".shared-statistics__date-button-clear"
    );
    this.dataClear = this.shadowRoot.querySelector(
      ".shared-statistics__filters-clear-button"
    );
    this.dataClearMobile = this.shadowRoot.querySelector(
      ".shared-statistics__date-clear"
    );

    this.dataClear.addEventListener("click", () => {
      this.filters = {
        paymentStatus: "all",
        payoutStatus: "all",
        paymentType: "all",
        dateRange: null,
      };
      this.dateCalendar.clearSelection();
      this.updateUI();
      this.emitFilterChange();

      if (!this.isCalendarOpen) {
        this.dateButton.classList.remove(
          "shared-statistics__date-button--active"
        );
        this.dateIcon.src = "assets/icons/calendar.svg";
      }
    });

    this.dataClearMobile.addEventListener("click", () => {
      this.filters = {
        paymentStatus: "all",
        payoutStatus: "all",
        paymentType: "all",
        dateRange: null,
      };
      this.dateCalendar.clearSelection();
      this.updateUI();
      this.emitFilterChange();

      if (!this.isCalendarOpen) {
        this.dateButton.classList.remove(
          "shared-statistics__date-button--active"
        );
        this.dateIcon.src = "assets/icons/calendar.svg";
      }
    });

    this.dateCalendar.addEventListener("close", () => {
      this.isCalendarOpen = false;

      if (this.filters.dateRange) {
        this.dateButton.classList.add("shared-statistics__date-button--active");
        this.dateButtonClear.classList.add(
          "shared-statistics__date-button-clear--active"
        );
        this.dateIcon.classList.add(
          "shared-statistics__date-button-icon--hide"
        );
      } else {
        this.dateButton.classList.remove(
          "shared-statistics__date-button--active"
        );
        this.dateIcon.src = "assets/icons/calendar.svg";
      }

      this.dateCalendar.classList.remove(
        "shared-statistics__date-calendar--active"
      );
    });

    this.dateCalendar.addEventListener("range-selected", (event) => {
      if (event.detail && event.detail.start && event.detail.end) {
        this.filters.dateRange = event.detail;
        this.updateUI();
        this.emitFilterChange();
      }
    });

    this.dateButton.addEventListener("click", () => {
      this.isCalendarOpen = !this.isCalendarOpen;
      this.toggleCalendar();

      if (this.filters.dateRange) {
        this.dateButton.classList.add("shared-statistics__date-button--active");
        this.dateButtonClear.classList.add(
          "shared-statistics__date-button-clear--active"
        );
        this.dateIcon.classList.add(
          "shared-statistics__date-button-icon--hide"
        );
      }
    });

    this.dateButtonClear.addEventListener("click", (event) => {
      event.stopPropagation();

      this.filters.dateRange = null;

      this.updateUI();
      this.emitFilterChange();

      if (!this.isCalendarOpen) {
        this.dateButton.classList.remove(
          "shared-statistics__date-button--active"
        );
        this.dateIcon.src = "assets/icons/calendar.svg";
      }

      this.dateCalendar.clearSelection();
    });

    this.shadowRoot.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.updateFilter(event);
        this.emitFilterChange();
      });
    });
  }

  toggleCalendar() {
    const isActive = this.dateCalendar.classList.contains(
      "shared-statistics__date-calendar--active"
    );
    if (isActive) {
      this.dateCalendar.classList.remove(
        "shared-statistics__date-calendar--active"
      );
      this.dateButton.classList.remove(
        "shared-statistics__date-button--active"
      );
      this.dateIcon.src = "assets/icons/calendar.svg";
    } else {
      this.dateCalendar.classList.add(
        "shared-statistics__date-calendar--active"
      );
      this.dateButton.classList.add("shared-statistics__date-button--active");
      this.dateIcon.src = "assets/icons/calendar-white.svg";
    }
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

    if (this.filters.dateRange) {
      const startDate = new Date(this.filters.dateRange.start);
      const endDate = new Date(this.filters.dateRange.end);
      const formattedStartDate = startDate.toLocaleDateString("ru-RU");
      const formattedEndDate = endDate.toLocaleDateString("ru-RU");

      this.dateButton.classList.add("shared-statistics__date-button--active");
      this.dateButtonClear.classList.add(
        "shared-statistics__date-button-clear--active"
      );
      this.dateIcon.classList.add("shared-statistics__date-button-icon--hide");

      this.shadowRoot.querySelector(
        ".shared-statistics__date-button-title"
      ).textContent = `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      this.dateButtonClear.classList.remove(
        "shared-statistics__date-button-clear--active"
      );
      this.dateIcon.classList.remove(
        "shared-statistics__date-button-icon--hide"
      );
      this.shadowRoot.querySelector(
        ".shared-statistics__date-button-title"
      ).textContent = "Выбрать дату";
    }
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
