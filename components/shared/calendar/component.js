import cssText from "/src/styles/main.scss?inline";

export class SharedCalendar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentDate = new Date();
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/calendar/component.html");

    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const templateContent = templateDiv
      .querySelector("template")
      .content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.prevButton = this.shadowRoot.querySelector(
      ".shared-calendar__navigation-item--prev"
    );
    this.nextButton = this.shadowRoot.querySelector(
      ".shared-calendar__navigation-item--next"
    );
    this.monthSelectors = this.shadowRoot.querySelectorAll("shared-month");
    this.monthViews = this.shadowRoot.querySelectorAll(
      ".shared-calendar__month-view"
    );
    this.closeButton = this.shadowRoot.querySelector(".shared-calendar__close");

    this.closeButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          composed: true,
        })
      );
    });

    this.prevButton.addEventListener("click", () => this.changeMonth(-1));
    this.nextButton.addEventListener("click", () => this.changeMonth(1));

    this.monthSelectors.forEach((selector, index) => {
      selector.addEventListener("month-selected", (event) => {
        const { month, year } = event.detail;
        this.currentDate.setFullYear(year);
        this.currentDate.setMonth(index === 0 ? month : month + 1);
        this.renderCalendar();
      });
    });

    this.renderCalendar();
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendar();
  }

  renderCalendar() {
    const leftMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const rightMonth = new Date(
      leftMonth.getFullYear(),
      leftMonth.getMonth() + 1,
      1
    );

    // this.monthSelectors[0].setAttribute("month", leftMonth.getMonth());
    // this.monthSelectors[0].setAttribute("year", leftMonth.getFullYear());
    this.monthSelectors[0].changeMonth(
      leftMonth.getFullYear(),
      leftMonth.getMonth()
    );

    // this.monthSelectors[1].setAttribute("month", rightMonth.getMonth());
    // this.monthSelectors[1].setAttribute("year", rightMonth.getFullYear());
    this.monthSelectors[1].changeMonth(
      rightMonth.getFullYear(),
      rightMonth.getMonth()
    );

    this.monthViews[0].innerHTML = this.generateMonthHTML(leftMonth);
    this.monthViews[1].innerHTML = this.generateMonthHTML(rightMonth);

    this.shadowRoot
      .querySelectorAll(".shared-calendar__day")
      .forEach((dayElement) => {
        dayElement.addEventListener("click", (event) =>
          this.selectDay(event.target)
        );
      });
  }

  generateMonthHTML(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    let days = `<div class="shared-calendar__days">`;

    let prevMonthDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    for (
      let i = prevMonthLastDay - prevMonthDays + 1;
      i <= prevMonthLastDay;
      i++
    ) {
      days += `<span class="shared-calendar__day prev-month">${i}</span>`;
    }

    for (let i = 1; i <= lastDay; i++) {
      const dateObj = new Date(year, month, i);
      const dayOfWeek = dateObj.getDay();
      const isSelected = this.isDateSelected(dateObj);
      const isInRange = this.isDateInRange(dateObj);

      let wrapperClasses = "shared-calendar__day-wrapper";
      let classes = "shared-calendar__day";

      if (isSelected) classes += " selected";
      if (isInRange) classes += " in-range";
      if (today.toDateString() === dateObj.toDateString()) classes += " today";

      if (this.selectedStartDate && this.selectedEndDate) {
        if (this.selectedStartDate.getTime() === dateObj.getTime()) {
          wrapperClasses += " start-date";
        }
        if (this.selectedEndDate.getTime() === dateObj.getTime()) {
          wrapperClasses += " end-date";
        }
      }

      if (dayOfWeek === 1) classes += " monday";
      if (dayOfWeek === 0) classes += " sunday";

      days += `<div class="${wrapperClasses}"><span class="${classes}" data-day="${i}" data-month="${month}" data-year="${year}">${i}</span></div>`;
    }

    days += `</div>`;
    return days;
  }

  isDateSelected(date) {
    return (
      (this.selectedStartDate &&
        this.selectedStartDate.getTime() === date.getTime()) ||
      (this.selectedEndDate &&
        this.selectedEndDate.getTime() === date.getTime())
    );
  }

  isDateInRange(date) {
    return (
      this.selectedStartDate &&
      this.selectedEndDate &&
      date > this.selectedStartDate &&
      date < this.selectedEndDate
    );
  }

  selectDay(dayElement) {
    const day = parseInt(dayElement.getAttribute("data-day"));
    const month = parseInt(dayElement.getAttribute("data-month"));
    const year = parseInt(dayElement.getAttribute("data-year"));

    const selectedDate = new Date(year, month, day);

    if (
      !this.selectedStartDate ||
      (this.selectedStartDate && this.selectedEndDate)
    ) {
      this.selectedStartDate = selectedDate;
      this.selectedEndDate = null;
    } else if (selectedDate > this.selectedStartDate) {
      this.selectedEndDate = selectedDate;
    } else {
      this.selectedStartDate = selectedDate;
    }

    this.emitRangeSelected();
    this.renderCalendar();
  }

  emitRangeSelected() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.dispatchEvent(
        new CustomEvent("range-selected", {
          detail: {
            start: this.selectedStartDate,
            end: this.selectedEndDate,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  clearSelection() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.renderCalendar();
  }
}

customElements.define("shared-calendar", SharedCalendar);
