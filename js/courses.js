import "./components.js";
import courses from "../static-data/courses.js";
import { formatDate } from "./utils.js";

let searchQuery = "";
let sortedColumn = null;
let sortOrder = null;

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("[data-id='courses-page-table']");
  const sortButtons = document.querySelectorAll("shared-sort");
  const search = document.querySelector(".courses-page__search");
  const add = document.querySelector(".courses-page__add");

  function normalizeString(value) {
    return value?.toString().toLowerCase().trim();
  }

  function filterCourses(courses) {
    if (!searchQuery) return courses;

    return courses.filter((course) => {
      const query = normalizeString(searchQuery);

      const matchTitle = course.titles.some((title) =>
        normalizeString(title).includes(query)
      );

      const matchLink = course.link.some((l) =>
        normalizeString(l).includes(query)
      );

      const matchInfo = normalizeString(course.info).includes(query);
      const matchDate = formatDate(course.date).includes(searchQuery);

      return matchTitle || matchLink || matchInfo || matchDate;
    });
  }

  function sortCourses(courses) {
    if (sortedColumn === null || sortOrder === null) return courses;

    return [...courses].sort((a, b) => {
      let valueA = a[sortedColumn];
      let valueB = b[sortedColumn];

      if (sortedColumn === "titles") {
        valueA = valueA[0];
        valueB = valueB[0];
      }

      if (sortedColumn === "prices") {
        valueA = valueA[0];
        valueB = valueB[0];
      }

      if (sortedColumn === "date") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      return sortOrder === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
  }

  function renderTable(courses) {
    const filtered = filterCourses(courses);
    const sorted = sortCourses(filtered);

    tableBody.innerHTML = sorted
      .map(
        (course) => `
      <tr class="courses-page__table-tr">
        <td class="courses-page__table-td">
          <div class="courses-page__table-block">
            <img src="assets/icons/empty.svg" alt="image" />
            
            <div class="courses-page__table-group">
              ${course.titles
                .map((l) => `<p class="courses-page__table-label">${l}</p>`)
                .join("")}
            </div>
          </div>
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-group">
            ${course.prices.map((l) => `<p>${l} USD</p>`).join("")}
          </div>
        </td>
        <td class="courses-page__table-td">
          <a class="courses-page__table-link" href="${
            course.info
          }" target="_blank">${course.info}</a>
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-switch">
            <shared-status status="${
              course.status ? "published" : "not-published"
            }"></shared-status>

            <ui-switch ${course.status ? "checked" : ""}></ui-switch>
          </div>
        </td>
        <td class="courses-page__table-td">
          <div class="courses-page__table-group">
            ${course.link
              .map(
                (l) => `<a class="courses-page__table-link" href="#">${l}</a>`
              )
              .join("")}
          </div>
        </td>
        <td class="courses-page__table-td">
          ${formatDate(course.date)}
        </td>
      </tr>
    `
      )
      .join("");

    tableBody
      .querySelectorAll(".courses-page__table-tr")
      .forEach((row, index) => {
        const uiSwitch = row.querySelector("ui-switch");

        if (uiSwitch) {
          uiSwitch.addEventListener("update", (event) => {
            const checked = event.detail;
            const courseIndex = courses.indexOf(sorted[index]);

            if (courseIndex !== -1) {
              courses[courseIndex].status = checked;
              renderTable(courses);
            }
          });
        }
      });
  }

  renderTable(courses);

  const columnMap = [
    "titles",
    "titles",
    "prices",
    "info",
    "status",
    "link",
    "date",
  ];

  sortButtons.forEach((btn, index) => {
    btn.addEventListener("sort-change", (event) => {
      sortedColumn = columnMap[index];
      sortOrder = event.detail.order;
      renderTable(courses);
    });
  });

  search.addEventListener("search", (event) => {
    searchQuery = event.detail;
    renderTable(courses);
  });

  add.addEventListener("click", () => {
    window.location = "/course.html";
  });
});
