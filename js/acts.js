import "./components.js";
import data from "../static-data/acts.js";
import { formatAmount, formatDate, formatTimeSeconds } from "./utils.js";

const itemsPerPage = 5;
let currentPage = 1;
let sortedColumn = null;
let sortOrder = null;
let filteredData = [...data];
let activeTab = "international";
let searchQuery = "";

const paginationComponent = document.querySelector(
  "[data-id='acts-page-pagination']"
);
const searchInput = document.querySelector("shared-search");
const tabs = document.querySelectorAll(".acts-page__tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("acts-page__tab--active"));
    tab.classList.add("acts-page__tab--active");

    activeTab =
      tab.textContent.trim() === "Междунородные" ? "international" : "ruble";
  });
});

const filterData = () => {
  filteredData = data.filter((item) => {
    return (
      item.actId.toString().includes(searchQuery) ||
      item.amountRub.toString().includes(searchQuery) ||
      item.amountUsd.toString().includes(searchQuery) ||
      formatDate(item.createdAt).includes(searchQuery)
    );
  });

  currentPage = 1;
  renderTable(filteredData, currentPage);
  updatePagination(filteredData);
};

searchInput.addEventListener("search", (event) => {
  searchQuery = event.detail.trim().toLowerCase();

  filterData();
});

const sortData = (acts) => {
  if (!sortedColumn || !sortOrder) return acts;

  return acts.slice().sort((a, b) => {
    let valueA = a[sortedColumn];
    let valueB = b[sortedColumn];

    if (sortedColumn === "createdAt") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else if (typeof valueA === "string") {
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
};

const renderTable = (acts, page) => {
  const tableBody = document.querySelector("[data-id='acts-page-table']");
  tableBody.innerHTML = "";

  const sortedData = sortData(acts);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="acts-page__table-td acts-page__table-td--id">
        ${item.actId}
      </td>
      <td class="acts-page__table-td">
        ${formatDate(item.createdAt)} <br />
        ${formatTimeSeconds(item.createdAt)}
      </td>
      <td class="acts-page__table-td">
        ${formatAmount(item.amountRub)}₽
      </td>
      <td class="acts-page__table-td">
        $${formatAmount(item.amountUsd)}
      </td>
      <td class="acts-page__table-td">
        ${formatAmount(item.commission)}₽
      </td>
      <td class="acts-page__table-td">
        ${formatAmount(item.payoutRub)}₽
      </td>
      <td class="acts-page__table-td">
        $${formatAmount(item.payoutUsd)}
      </td>
      <td class="acts-page__table-td">
        <shared-status status="${item.status}"></shared-status>
      </td>
    `;

    tableBody.appendChild(row);
  });
};

const updatePagination = (acts) => {
  const totalPages = Math.ceil(acts.length / itemsPerPage);
  paginationComponent.setAttribute("total-pages", totalPages);
  paginationComponent.setAttribute("current-page", currentPage);
};

paginationComponent.addEventListener("page-change", (event) => {
  currentPage = event.detail.page;
  renderTable(filteredData, currentPage);
  updatePagination(filteredData);
});

document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
  const columnMap = [
    "actId",
    "createdAt",
    "amountRub",
    "amountUsd",
    "commission",
    "payoutRub",
    "payoutUsd",
    "status",
  ];

  sortElement.addEventListener("sort-change", (event) => {
    sortedColumn = columnMap[index];
    sortOrder = event.detail.order;
    renderTable(filteredData, currentPage);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  filterData();
});
