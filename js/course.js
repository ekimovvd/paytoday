import "./components.js";

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

document.addEventListener("DOMContentLoaded", () => {
  const nameEnElement = getElement("name-en");
  const nameRuElement = getElement("name-ru");
  const linkElement = getElement("link");
  const descriptionEnElement = getElement("description-en");
  const descriptionRuElement = getElement("description-ru");
  const uploadBtnElement = getElement("upload-btn");
  const uploadNameElement = getElement("upload-name");
  const saveElement = getElement("save");
  const courseTypeElement = getElement("course-type");

  const relativePriceSection = getElement("relative-price");
  const tariffsSection = getElement("tariffs");

  const amountEnElement = getElement("amount-en");
  const amountRuElement = getElement("amount-ru");

  const data = {
    "name-en": "",
    "name-ru": "",
    link: "",
    descriptionEn: "",
    descriptionRu: "",
    courseType: "fixed",
    tariffs: [],
    file: null,
  };

  function displayedElements() {
    if (data.courseType === "fixed") {
      relativePriceSection.style.display = "grid";
      tariffsSection.style.display = "none";
    } else if (data.courseType === "relative") {
      relativePriceSection.style.display = "none";
      tariffsSection.style.display = "flex";
    }
  }

  displayedElements();

  courseTypeElement.addEventListener("update", (event) => {
    data.courseType = event.detail;

    displayedElements();
  });

  function validateField(element) {
    if (!element.value.trim()) {
      element.setAttribute("error", "textfield required");
    } else {
      element.removeAttribute("error");
    }
  }

  uploadBtnElement.addEventListener("click", () => {
    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file) {
        data.file = file;
        uploadNameElement.textContent = `${file.name}`;
      }
    });

    fileInput.click();
  });

  const tariffsContainer = getElement("tariffs-container");
  const addTariffButton = getElement("add-tariff");

  function addTariff(index) {
    const tariffSection = document.createElement("div");

    tariffSection.classList.add("course-page__tarrifs-section");
    tariffSection.innerHTML = `
      <h4 class="course-page__tariffs-title">#${index + 1}</h4>

      <div class="course-page__columns">
        <ui-input placeholder="Цена (USD)*" data-id="price-en-${index}"></ui-input>
        <ui-input placeholder="Цена (RUB)*" data-id="price-ru-${index}"></ui-input>
        <ui-input placeholder="Название тарифа EN*" data-id="tariff-en-${index}"></ui-input>
        <ui-input placeholder="Название тарифа RU*" data-id="tariff-ru-${index}"></ui-input>
        <ui-input placeholder="Описание тарифа EN*" data-id="tariff-desc-en-${index}"></ui-input>
        <ui-input placeholder="Описание тарифа RU*" data-id="tariff-desc-ru-${index}"></ui-input>
      </div>
    `;
    tariffsContainer.appendChild(tariffSection);
  }

  let tariffIndex = 1;
  addTariffButton.addEventListener("click", () => {
    addTariff(tariffIndex);

    tariffIndex++;
  });

  saveElement.addEventListener("click", () => {
    validateField(nameEnElement);
    validateField(nameRuElement);

    if (data.courseType === "fixed") {
      validateField(amountEnElement);
      validateField(amountRuElement);
    }

    data["name-en"] = nameEnElement.value;
    data["name-ru"] = nameRuElement.value;
    data.link = linkElement.value;
    data.descriptionEn = descriptionEnElement.value;
    data.descriptionRu = descriptionRuElement.value;
    data.courseType = courseTypeElement.value;

    data.tariffs = [];
    for (let i = 0; i < tariffIndex; i++) {
      const priceUsd = getElement(`price-en-${i}`);
      const priceRub = getElement(`price-ru-${i}`);
      const tariffEn = getElement(`tariff-en-${i}`);
      const tariffRu = getElement(`tariff-ru-${i}`);
      const tariffDescEn = getElement(`tariff-desc-en-${i}`);
      const tariffDescRu = getElement(`tariff-desc-ru-${i}`);

      validateField(priceUsd);
      validateField(priceRub);
      validateField(tariffEn);
      validateField(tariffRu);
      validateField(tariffDescEn);
      validateField(tariffDescRu);

      if (
        priceUsd.value &&
        priceRub.value &&
        tariffEn.value &&
        tariffRu.value &&
        tariffDescEn.value &&
        tariffDescRu.value
      ) {
        data.tariffs.push({
          priceUsd,
          priceRub,
          tariffEn,
          tariffRu,
          tariffDescEn,
          tariffDescRu,
        });
      }
    }

    console.log("Saved course data:", data);
  });
});
