import "./components.js";
import data from "../static-data/index.js";

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let searchQuery = "";
let sortConfig = { key: null, order: null };
let activeFilters = {
  paymentStatus: "all",
  payoutStatus: "all",
  paymentType: "all",
  dateRange: null,
};

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchDesktop = getElement("main-search");
  const searchMobile = getElement("main-search-mobile");
  const tableBody = getElement("main-page-table-body");
  const pagination = getElement("main-pagination");
  const download = getElement("main-download");
  const modal = document.getElementById("modal");
  const statistics = getElement("main-statistics");

  function handleSearch(event) {
    searchQuery = event.detail.trim().toLowerCase();
    currentPage = 1;
    renderData();
  }

  searchDesktop.addEventListener("search", handleSearch);
  searchMobile.addEventListener("search", handleSearch);

  document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
    const columns = ["accountId", "id", "createdDate", "paymentDate"];
    const key = columns[index];

    sortElement.addEventListener("sort-change", (event) => {
      sortConfig = { key, order: event.detail.order };
      renderData();
    });
  });

  statistics.addEventListener("filter-change", (event) => {
    activeFilters = event.detail;
    currentPage = 1;

    renderData();
  });

  function filterData() {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.accountId.toLowerCase().includes(query) ||
        item.client.name.toLowerCase().includes(query) ||
        item.client.phone.includes(query) ||
        item.client.email.toLowerCase().includes(query);

      const matchesPaymentStatus =
        activeFilters.paymentStatus === "all" ||
        activeFilters.paymentStatus === item.status;

      const matchesPayoutStatus =
        activeFilters.payoutStatus === "all" ||
        (activeFilters.payoutStatus === "not_paid" && item.payout !== "paid") ||
        (activeFilters.payoutStatus === "paid" && item.payout === "paid");

      const matchesPaymentType =
        activeFilters.paymentType === "all" ||
        activeFilters.paymentType === item.paymentType;

      const matchesDateRange =
        activeFilters.dateRange === null ||
        (activeFilters.dateRange.start <= new Date(item.createdDate) &&
          activeFilters.dateRange.end >= new Date(item.createdDate));

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesPayoutStatus &&
        matchesPaymentType &&
        matchesDateRange
      );
    });
  }

  function sortData(filteredData) {
    if (!sortConfig.key || !sortConfig.order) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (!valueA || !valueB) return 0;

      if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (sortConfig.order === "asc") return valueA > valueB ? 1 : -1;
      if (sortConfig.order === "desc") return valueA < valueB ? 1 : -1;

      return 0;
    });
  }

  function paginateData(filteredData) {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    pagination.setAttribute("total-pages", totalPages);
    pagination.setAttribute("current-page", currentPage);
  }

  pagination.addEventListener("page-change", (event) => {
    currentPage = event.detail.page;
    renderData();
  });

  function renderData() {
    const filteredData = filterData();
    const sortedData = sortData(filteredData);
    const paginatedData = paginateData(sortedData);

    renderPagination(filteredData.length);

    tableBody.innerHTML = paginatedData
      .map((item) => {
        return `
        <tr class="main-page__table-tr" data-id="${item.id}">
          <td class="main-page__table-td"><a class="main-page__table-link" href="#">${item.id}</a></td>
          <td class="main-page__table-td"><a class="main-page__table-link" href="#">${item.accountId}</a></td>
          <td class="main-page__table-td main-page__table-td--nowrap">
            ${item.client.name} <br>
            ${item.client.phone} <br>
            ${item.client.email}
          </td>
          <td class="main-page__table-td main-page__table-td--nowrap">${item.createdDate}</td>
          <td class="main-page__table-td main-page__table-td--nowrap">${item.paymentDate}</td>
          <td class="main-page__table-td"><shared-status status="${item.status}"></shared-status></td>
          <td class="main-page__table-td">${item.amountUsd} <br> ${item.vatUsd}</td>
          <td class="main-page__table-td">${item.amountRub}</td>
          <td class="main-page__table-td">
            <div class="main-page__table-actions">
              <shared-copy class="main-page__table-action" copy-text="${item.id}"></shared-copy>
              <shared-redirect href="${item.id}"></shared-redirect>
              <shared-remove data-id="remove" class="main-page__table-remove" data-remove-id="${item.id}"></shared-remove>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    addRemoveListeners();
  }

  function addRemoveListeners() {
    document.querySelectorAll("[data-id='remove']").forEach((button) => {
      button.addEventListener("click", (event) => {
        modal.open({
          type: "delete",
          icon: "assets/icons/delete.svg",
          title: "Вы точно хотите удалить этот счет?",
          confirmText: "Удалить",
          cancelText: "Оставить",
        });

        const removeId = event.currentTarget.getAttribute("data-remove-id");
        removeRowById(removeId);
      });
    });
  }

  function removeRowById(id) {
    modal.addEventListener("confirm", () => {
      removeRow(id);
    });
  }

  function removeRow(id) {
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      renderData();
    }
  }

  download.addEventListener("click", () => {
    console.log("download");
  });

  renderData();
});
