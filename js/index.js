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
    accountId: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "pending",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "paid",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "error",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "",
    accountId: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "refund",
    amountRub: "10 000₽",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
  },
  {
    id: "123456",
    accountId: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
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

  let searchQuery = "";

  balanceRub.textContent = "10 000₽";
  balanceUsd.textContent = "/ $1 000.234";

  search.addEventListener("search", (event) => {
    console.log(event.detail);
  });

  renderData();

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

  function renderData() {
    const tableBody = getElement("main-page-table-body");
    const filteredData = filterData();

    tableBody.innerHTML = filteredData
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
        <tr class="main-page__table-tr">
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
              <button data-id="copy-link" data-link="${item.id}" class="main-page__table-action">
                <img src="assets/icons/link.svg" alt="link" />
              </button>
  
              <a href="#" class="main-page__table-action">
                <img src="assets/icons/arrow-up.svg" alt="arrow-up" />
              </a>
  
              <button data-id="remove" class="main-page__table-remove">
                <img src="assets/icons/remove.svg" alt="remove" />
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }
});
