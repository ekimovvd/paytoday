import { loadStyles } from "../../../js/utils.js";

export class SharedDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isCalendarOpen = false;
    this.selectedDateRange = null;
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  static get observedAttributes() {
    return ["view"];
  }

  attributeChangedCallback(name) {
    if (name === "view") {
      this.updateStyles();
    }
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/date/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const template = templateDiv.querySelector("template");
    const templateContent = template.content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.setupElements();
    this.setupListeners();
    this.updateStyles();
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleOutsideClick);
  }

  updateStyles() {
    const button = this.shadowRoot.querySelector(".shared-date__button");
    const calendar = this.shadowRoot.querySelector(".shared-date__calendar");
    if (button) {
      button.classList.add(
        `shared-date__button--view-${this.getAttribute("view")}`
      );
      calendar.classList.add(
        `shared-date__calendar--view-${this.getAttribute("view")}`
      );
    }
  }

  setupElements() {
    this.dateButton = this.shadowRoot.querySelector(".shared-date__button");
    this.dateCalendar = this.shadowRoot.querySelector(".shared-date__calendar");
    this.dateIcon = this.shadowRoot.querySelector(".shared-date__button-icon");
    this.dateClearButton = this.shadowRoot.querySelector(
      ".shared-date__button-clear"
    );
  }

  setupListeners() {
    this.dateButton.addEventListener("click", () => {
      this.isCalendarOpen = !this.isCalendarOpen;
      this.toggleCalendar();
    });

    this.dateCalendar.addEventListener("range-selected", (event) => {
      this.selectedDateRange = event.detail;
      this.updateUI();
      this.emitDateChange();
    });

    this.dateClearButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.selectedDateRange = null;
      this.updateUI();
      this.emitDateChange();
      this.dateCalendar.clearSelection();
    });

    this.dateCalendar.addEventListener("close", () => {
      this.isCalendarOpen = false;
      this.toggleCalendar();
    });

    document.addEventListener("click", this.handleOutsideClick);
  }

  toggleCalendar() {
    if (this.isCalendarOpen) {
      this.dateButton.classList.add("shared-date__button--active");

      if (!this.selectedDateRange) {
        this.dateIcon.src = "assets/icons/calendar-white.svg";
      }
    } else {
      if (!this.selectedDateRange) {
        this.dateButton.classList.remove("shared-date__button--active");

        this.dateIcon.src = "assets/icons/calendar.svg";
      }
    }

    this.dateCalendar.classList.toggle(
      "shared-date__calendar--active",
      this.isCalendarOpen
    );
  }

  handleOutsideClick(event) {
    if (!this.isCalendarOpen) return;

    const path = event.composedPath();
    if (!path.includes(this.dateCalendar) && !path.includes(this.dateButton)) {
      this.isCalendarOpen = false;
      this.toggleCalendar();
    }
  }

  updateUI() {
    const titleElement = this.shadowRoot.querySelector(
      ".shared-date__button-title"
    );

    if (this.selectedDateRange) {
      const { start, end } = this.selectedDateRange;
      const formattedStart = new Date(start).toLocaleDateString("ru-RU");
      const formattedEnd = new Date(end).toLocaleDateString("ru-RU");
      titleElement.textContent = `${formattedStart} - ${formattedEnd}`;

      this.dateIcon.classList.add("shared-date__button-icon--hide");
      this.dateClearButton.classList.add("shared-date__button-clear--active");
    } else {
      titleElement.textContent = "За все время";

      this.dateIcon.classList.remove("shared-date__button-icon--hide");
      this.dateClearButton.classList.remove(
        "shared-date__button-clear--active"
      );

      if (!this.isCalendarOpen) {
        this.dateButton.classList.remove("shared-date__button--active");
        this.dateIcon.src = "assets/icons/calendar.svg";
      }
    }
  }

  emitDateChange() {
    this.dispatchEvent(
      new CustomEvent("date-change", {
        detail: this.selectedDateRange,
        bubbles: true,
        composed: true,
      })
    );
  }

  clearSelection() {
    this.isCalendarOpen = false;
    this.selectedDateRange = null;
    this.toggleCalendar();
    this.updateUI();
    this.dateCalendar.clearSelection();
  }
}

customElements.define("shared-date", SharedDate);
