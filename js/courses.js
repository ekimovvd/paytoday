import "./components.js";
import courses from "../static-data/courses.js";
import { formatDate } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("[data-id='courses-page-table']");
  const sortButtons = document.querySelectorAll("shared-sort");

  function renderTable(data) {
    tableBody.innerHTML = data
      .map(
        (course) => `
      <tr class="courses-page__table-tr">
        <td class="courses-page__table-td">
          <img src="assets/icons/empty.svg" alt="image" />
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-group">
            ${course.titles.map((l) => `<p>${l}</p>`).join("<br>")}
          </div>
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-group">
            ${course.prices
              .map(
                (l) => `
                <p>${l} USD</p>`
              )
              .join("<br>")}
          </div>
        </td>
        <td class="courses-page__table-td">
          <a class="courses-page__table-link" href="https://ru.pinterest.com/1234564748679">https://ru.pinterest.com/1234564748679</a>
        </td>
        <td class="courses-page__table-td">
          <ui-switch></ui-switch>
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-group">
            ${course.link
              .map(
                (l) => `
                <a class="courses-page__table-link" href="#">${l}</a>`
              )
              .join("<br>")}
          </div>
        </td>
        <td class="courses-page__table-td">
          ${formatDate(course.date)}
        </td>
      </tr>
    `
      )
      .join("");
  }

  renderTable(courses);

  function sortTableByColumn(columnIndex, type = "text") {
    const sortedCourses = [...courses].sort((a, b) => {
      let valA = Object.values(a)[columnIndex];
      let valB = Object.values(b)[columnIndex];

      if (type === "number") {
        valA = parseFloat(valA.replace(/\D/g, ""));
        valB = parseFloat(valB.replace(/\D/g, ""));
      }

      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });

    renderTable(sortedCourses);
  }

  sortButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const columnType = index === 2 ? "number" : "text";

      sortTableByColumn(index, columnType);
    });
  });
});
