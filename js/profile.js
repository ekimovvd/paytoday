import "./components.js";

document.addEventListener("DOMContentLoaded", () => {
  const formData = {
    email: "ruderepeen@gmail.com",
    oldPassword: "",
    newPassword: "",
    phone: "",
    notifyUrl: "",
    publicKey: "",
    secretKey: "",
  };

  const elements = {
    oldPassword: "oldPassword",
    newPassword: "newPassword",
    phone: "phone",
    notifyUrl: "notifyUrl",
    publicKey: "publicKey",
    secretKey: "secretKey",
  };

  const requiredFields = ["oldPassword"];

  const refs = Object.fromEntries(
    Object.entries(elements).map(([key, id]) => [
      key,
      document.querySelector(`[data-id="${id}"]`),
    ])
  );

  const emailElement = document.querySelector(".profile-page__email-title");
  if (emailElement) {
    emailElement.textContent = formData.email;
  }

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

  function generateKey(length = 32) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < length; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return key;
  }

  const publicKeyBtn = document.querySelector(
    ".profile-page__form-group:nth-of-type(2) .profile-page__form-button"
  );
  const secretKeyBtn = document.querySelector(
    ".profile-page__form-group:nth-of-type(3) .profile-page__form-button"
  );

  Object.entries(refs).forEach(([key, element]) => {
    element?.addEventListener("update", (event) => {
      updateFormData(key, event.detail);

      if (requiredFields.includes(key)) {
        element.removeAttribute("error");
      }
    });
  });

  if (publicKeyBtn) {
    publicKeyBtn.addEventListener("click", () => {
      const key = generateKey();
      formData.publicKey = key;

      refs.publicKey.value = key;
    });
  }

  if (secretKeyBtn) {
    secretKeyBtn.addEventListener("click", () => {
      const key = generateKey();
      formData.secretKey = key;

      refs.secretKey.value = key;
    });
  }

  const saveBtn = document.querySelector(".profile-page__save");

  saveBtn?.addEventListener("click", () => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Форма успешно отправлена с данными:", formData);
    }
  });
});
