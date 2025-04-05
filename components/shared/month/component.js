import { loadStyles } from "../../../js/utils";

export class SharedMonth extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/month/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const templateContent = templateDiv
      .querySelector("template")
      .content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.label = this.shadowRoot.querySelector(".shared-month__label");
    this.toggleButton = this.shadowRoot.querySelector(".shared-month__toggle");
    this.dropdown = this.shadowRoot.querySelector(".shared-month__dropdown");

    this.toggleButton.addEventListener("click", (event) =>
      this.toggleDropdown(event)
    );

    this.shadowRoot.querySelectorAll(".shared-month__month").forEach((btn) => {
      btn.addEventListener("click", () => this.selectMonth(btn));
    });

    document.addEventListener("click", this.handleClickOutside);
    this.updateLabel();
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  toggleDropdown(event) {
    event?.stopPropagation();
    this.dropdown.classList.toggle("visible");
  }

  selectMonth(button) {
    const newMonth = parseInt(button.getAttribute("data-month"), 10);
    const newYear = parseInt(
      button.closest("[data-year]").getAttribute("data-year"),
      10
    );
    this.setMonth(newYear, newMonth);
    this.toggleDropdown(new Event("click"));
  }

  setMonth(year, month) {
    this.currentMonth = month;
    this.currentYear = year;

    this.shadowRoot.querySelectorAll(".shared-month__month").forEach((btn) => {
      btn.classList.remove("selected");
    });

    const selectedButton = this.shadowRoot.querySelector(
      `[data-year="${year}"] .shared-month__month[data-month="${month}"]`
    );
    if (selectedButton) {
      selectedButton.classList.add("selected");
    }

    this.updateLabel();
    this.toggleDropdown();

    this.dispatchEvent(
      new CustomEvent("month-selected", {
        detail: { month: this.currentMonth, year: this.currentYear },
        bubbles: true,
        composed: true,
      })
    );
  }

  changeMonth(year, month) {
    this.currentMonth = month;
    this.currentYear = year;

    this.shadowRoot.querySelectorAll(".shared-month__month").forEach((btn) => {
      btn.classList.remove("selected");
    });

    const selectedButton = this.shadowRoot.querySelector(
      `[data-year="${year}"] .shared-month__month[data-month="${month}"]`
    );
    if (selectedButton) {
      selectedButton.classList.add("selected");
    }

    this.updateLabel();
  }

  updateLabel() {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    if (this.label) {
      this.label.textContent = `${months[this.currentMonth]} ${
        this.currentYear
      }`;
    }
  }

  handleClickOutside(event) {
    if (
      !this.contains(event.target) &&
      !this.toggleButton.contains(event.target)
    ) {
      this.dropdown.classList.remove("visible");
    }
  }
}

customElements.define("shared-month", SharedMonth);
