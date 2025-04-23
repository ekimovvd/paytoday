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

  const emailElement = document.querySelector(".profile-page__email-title");
  if (emailElement) {
    emailElement.textContent = formData.email;
  }

  const inputMap = {
    0: "oldPassword",
    1: "newPassword",
    2: "phone",
    3: "notifyUrl",
    4: "publicKey",
    5: "secretKey",
  };

  document.querySelectorAll("ui-input").forEach((input, index) => {
    const key = inputMap[index];
    input.addEventListener("update", (event) => {
      formData[key] = event.detail;
      console.log(`Обновлено поле ${key}:`, event.detail);
    });
  });

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

  const publicKeyInput = document.querySelectorAll("ui-input")[4];
  const secretKeyInput = document.querySelectorAll("ui-input")[5];

  if (publicKeyBtn && publicKeyInput) {
    publicKeyBtn.addEventListener("click", () => {
      const key = generateKey();
      formData.publicKey = key;
      publicKeyInput.value = key;
      publicKeyInput.dispatchEvent(new CustomEvent("update", { detail: key }));
    });
  }

  if (secretKeyBtn && secretKeyInput) {
    secretKeyBtn.addEventListener("click", () => {
      const key = generateKey();
      formData.secretKey = key;
      secretKeyInput.value = key;
      secretKeyInput.dispatchEvent(new CustomEvent("update", { detail: key }));
    });
  }

  const saveBtn = document.querySelector(".profile-page__save");
  const oldPassword = document.querySelector(".profile-page__old-password");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!formData.oldPassword) {
        oldPassword.setAttribute("error", "Поле обязательно");
      } else {
        oldPassword.removeAttribute("error");
      }

      console.log("Данные формы для отправки:", formData);
    });
  }
});
