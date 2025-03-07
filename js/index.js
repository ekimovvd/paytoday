import "./components.js";

const data = [
  {
    id: "123456",
    accountId: "123456",
    client: {
      name: "Anton",
      phone: "+7 923 23-23-23",
      email: "Anton@mail.com",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "not-active",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123457",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-24",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:47",
    paymentDate: "30.12.2024",
    status: "pending",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123458",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-25",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:48",
    paymentDate: "1.01.2025",
    status: "paid",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123459",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-26",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:49",
    paymentDate: "2.01.2025",
    status: "error",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123460",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-27",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:50",
    paymentDate: "3.01.2025",
    status: "refund",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "123461",
    accountId: "123461",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-28",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:51",
    paymentDate: "4.01.2025",
    status: "active",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
];

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

document.addEventListener("DOMContentLoaded", () => {
  const balanceRub = getElement("main-balance-rub");
  const balanceUsd = getElement("main-balance-usd");
  const search = getElement("main-search");
  const tableBody = getElement("main-page-table-body");

  let searchQuery = "";
  let sortConfig = { key: null, order: null };

  balanceRub.textContent = "10 000₽";
  balanceUsd.textContent = "/ $1 000.234";

  search.addEventListener("search", (event) => {
    searchQuery = event.detail.trim().toLowerCase();
    renderData();
  });

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
        item.id.includes(query) ||
        item.accountId.includes(query) ||
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

  function renderData() {
    const filteredData = filterData();
    const sortedData = sortData(filteredData);

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
        const removeId = event.currentTarget.getAttribute("data-remove-id");
        removeRow(removeId);
      });
    });
  }

  function removeRow(id) {
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      data.splice(index, 1);
      renderData();
    }
  }

  renderData();
});
