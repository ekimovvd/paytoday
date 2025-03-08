import "./components.js";
import data from "../static-data/index.js";

const ITEMS_PER_PAGE = 5;
let currentPage = 1;

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

document.addEventListener("DOMContentLoaded", () => {
  const balanceRub = getElement("main-balance-rub");
  const balanceUsd = getElement("main-balance-usd");
  const searchDesktop = getElement("main-search");
  const searchMobile = getElement("main-search-mobile");
  const tableBody = getElement("main-page-table-body");
  const pagination = getElement("main-pagination");
  const download = getElement("main-download");
  const modal = document.getElementById("modal");

  let searchQuery = "";
  let sortConfig = { key: null, order: null };

  balanceRub.textContent = "10 000₽";
  balanceUsd.textContent = "/ $1 000.234";

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

  function filterData() {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();

      return (
        item.id.toLowerCase().includes(query) ||
        item.accountId.toLowerCase().includes(query) ||
        item.client.name.toLowerCase().includes(query) ||
        item.client.phone.includes(query) ||
        item.client.email.toLowerCase().includes(query)
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
    const paginatedData = paginateData(filteredData);
    const sortedData = sortData(paginatedData);

    renderPagination(filteredData.length);

    tableBody.innerHTML = sortedData
      .map((item) => {
        let type = "";

        switch (item.status) {
          case "pending":
            type =
              '<img src="assets/icons/pending.svg" alt="pending" /> Ждет оплату';
            break;
          case "paid":
            type = '<img src="assets/icons/paid-for.svg" alt="paid" /> Оплачен';
            break;
          case "not-active":
            type = "Не активен";
            break;
          case "error":
            type = `<img src="assets/icons/error.svg" alt="error" /> Ошибка`;
            break;
          case "refund":
            type = `<img src="assets/icons/refund.svg" alt="refund" /> Возврат`;
            break;
          case "active":
            type = "Активен";
            break;
          default:
            break;
        }

        const typeClass = `main-page__table-type--${item.status}`;

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
          <td class="main-page__table-td"><span class="main-page__table-type ${typeClass}">${type}</span></td>
          <td class="main-page__table-td">${item.amountUsd} <br> ${item.vatUsd}</td>
          <td class="main-page__table-td">${item.amountRub}</td>
          <td class="main-page__table-td">
            <div class="main-page__table-actions">
              <shared-copy class="main-page__table-action" copy-text="${item.id}"></shared-copy>
  
              <shared-redirect href="${item.id}"></shared-redirect>

              <shared-remove data-id="remove" class="main-page__table-remove" data-remove-id="${item.id}"></shared-remove>
            </div>
          </td>
        </tr>
      `;
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
