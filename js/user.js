import "./components.js";
import { getQueryParams } from "./utils.js";
import users from "../static-data/users.js";

document.addEventListener("DOMContentLoaded", () => {
  const formData = {
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "",
  };

  const elements = {
    name: "name",
    email: "email",
    password: "password",
    role: "role",
  };

  const refs = Object.fromEntries(
    Object.entries(elements).map(([key, id]) => [
      key,
      document.querySelector(`[data-id="${id}"]`),
    ])
  );

  const title = document.querySelector(".user-page__header-title");
  const save = document.querySelector('[data-id="save"]');

  function getInvoiceIdFromHash() {
    return getQueryParams().id;
  }

  const id = getInvoiceIdFromHash();

  if (id) {
    const user = users.find((user) => user.id.toString() === id);

    if (user) {
      formData.id = user.id;
      formData.name = user.name;
      formData.email = user.email;
      formData.password = user.password;
      formData.role = user.role;

      Object.entries(refs).forEach(([key, input]) => {
        if (key === "role") {
          const option = document.querySelector(`[data-id="${formData[key]}"]`);

          if (option) {
            option.setAttribute("selected", "");
            option.update();
          }
          // console.log(document.querySelector(`[data-id="${formData[key]}"]`));
        } else if (input) {
          input.setAttribute("value", formData[key]);
        }
      });
    }

    title.textContent = "Редактирование пользователя";
    save.textContent = "СОХРАНИТЬ ИЗМЕНЕНИЯ";
  } else {
    title.textContent = "Добавление пользователя";
    save.textContent = "ДОБАВИТЬ";
  }

  const requiredFields = ["name", "email"];

  function updateFormData(key, value) {
    formData[key] = value;

    console.log("Обновлено:", key, formData);
  }

  function validateForm() {
    let isValid = true;

    requiredFields.forEach((field) => {
      const input = refs[field];

      if (input) {
        const value = formData[field]?.trim();
        const isEmpty = !value;

        if (isEmpty) {
          input.setAttribute("error", "Поле обязательно");

          isValid = false;
        } else {
          input.removeAttribute("error");
        }
      }
    });

    if (!isValid) {
      console.log("Форма содержит ошибки, исправьте их перед отправкой.");
    }

    return isValid;
  }

  Object.entries(refs).forEach(([key, element]) => {
    element?.addEventListener("update", (event) => {
      updateFormData(key, event.detail);

      if (requiredFields.includes(key)) {
        element.removeAttribute("error");
      }
    });
  });

  save?.addEventListener("click", (event) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Форма успешно отправлена с данными:", formData);
    }
  });
});
