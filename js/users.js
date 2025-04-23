import "./components.js";
import users from "../static-data/users.js";

let searchQuery = "";
let sortedColumn = null;
let sortOrder = null;
let currentRemoveId = null;

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("[data-id='users-page-table']");
  const sortButtons = document.querySelectorAll("shared-sort");
  const search = document.querySelector(".users-page__search");
  const add = document.querySelector(".users-page__add");
  const modal = document.querySelector(".users-page__modal");

  function normalizeString(value) {
    return value?.toString().toLowerCase().trim();
  }

  function filterUsers(users) {
    if (!searchQuery) return users;

    const query = normalizeString(searchQuery);
    return users.filter((user) => normalizeString(user.name).includes(query));
  }

  function sortUsers(users) {
    if (sortedColumn === null || sortOrder === null) return users;

    return [...users].sort((a, b) => {
      let valueA = a[sortedColumn];
      let valueB = b[sortedColumn];

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

  function renderTable(users) {
    const filtered = filterUsers(users);
    const sorted = sortUsers(filtered);

    const getRole = (role) => {
      switch (role) {
        case "manager":
          return "менеджер";
        case "admin":
          return "администратор";
        case "accountant":
          return "бухгалтер";
        default:
          break;
      }
    };

    tableBody.innerHTML = sorted
      .map(
        (user) => `
            <tr class="users-page__table-tr">
                <td class="users-page__table-td">
                    <a class="users-page__table-link" href="/user.html?id=${
                      user.id
                    }" target="_blank">${user.name}</a>
                </td>
                <td class="users-page__table-td">${user.email}</td>
                <td class="users-page__table-td">
                    <div class="users-page__table-group">
                        ${getRole(user.role)}
                        <shared-remove class="users-page__table-remove" data-remove-id="${
                          user.id
                        }"></shared-remove>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    attachRemoveListeners();
  }

  renderTable(users);

  const columnMap = ["name"];

  sortButtons.forEach((btn, index) => {
    btn.addEventListener("sort-change", (event) => {
      sortedColumn = columnMap[index];
      sortOrder = event.detail.order;
      renderTable(users);
    });
  });

  search.addEventListener("search", (event) => {
    searchQuery = event.detail;
    renderTable(users);
  });

  add.addEventListener("click", () => {
    window.location = "/user.html";
  });

  function attachRemoveListeners() {
    document.querySelectorAll("[data-remove-id]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const removeId = event.currentTarget.dataset.removeId;
        showDeleteModal(removeId);
      });
    });
  }

  function showDeleteModal(id) {
    currentRemoveId = id;

    modal.open({
      type: "delete",
      icon: "assets/icons/delete.svg",
      title: "Вы точно хотите удалить этого пользователя?",
      confirmText: "Удалить",
      cancelText: "Оставить",
    });
  }

  modal.addEventListener("confirm", () => {
    if (currentRemoveId !== null) {
      removeRow(currentRemoveId);
      currentRemoveId = null;
    }
  });

  function removeRow(id) {
    const index = users.findIndex(
      (user) => user.id.toString() === id.toString()
    );

    if (index !== -1) {
      users.splice(index, 1);
      renderTable(users);
    }
  }
});
