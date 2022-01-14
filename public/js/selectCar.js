async function initialSelectCarForm() {
  const form = document.querySelector(".select-car__form");
  if (!form) return;

  setDefaultYears(form);

  let selectedYear;
  let selectedGenerationId;
  let selectedEngineId;
  //input year
  form["car-year"].addEventListener("change", async (evt) => {
    selectedYear = +evt.target.value;
    const marks = await getMarks(selectedYear);
    setDefaultMarks(form);
    renderSelect("#car-mark", marks);
  });

  //input mark
  form["car-mark"].addEventListener("change", async (evt) => {
    const selectedMarkId = getIdFromOption(evt.target);
    const models = await getModels(selectedYear, selectedMarkId);
    setDefaultModels(form);
    renderSelect("#car-model", models);
  });

  //input model
  form["car-model"].addEventListener("change", async (evt) => {
    const selectedModelId = getIdFromOption(evt.target);
    const generations = await getGenerations(selectedYear, selectedModelId);
    setDefaultGenerations(form);
    renderSelect("#car-generation", generations);
  });

  //input generation
  form["car-generation"].addEventListener("change", async (evt) => {
    selectedGenerationId = getIdFromOption(evt.target);
    const modifications = await getModifications(
      selectedYear,
      selectedGenerationId
    );
    setDefaultModifications(form);
    renderSelect("#car-modification", modifications);
  });

  //input modification
  form["car-modification"].addEventListener("change", async (evt) => {
    selectedEngineId = getIdFromOption(evt.target);
    const modificationId = await getModificationId(
      selectedGenerationId,
      selectedEngineId
    );
    addToLocalStorage(modificationId);
    await toCatalog(modificationId);
  });
}

async function toCatalog(modificationId) {
  window.location.href = `/catalog?mod_id=${modificationId}`;
}

function getIdFromOption(target) {
  const selectedInd = target.selectedIndex;
  const selectedOption = target.children[selectedInd];
  return +selectedOption.dataset.id;
}

async function setDefaultYears(form) {
  const [minYear, maxYear] = await getYears();
  const years = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push({
      id: year,
      name: year,
    });
  }
  form["car-year"].innerHTML = `<option disabled selected>Год выпуска</option>`;
  renderSelect("#car-year", years);
  setDefaultMarks(form);
}

function setDefaultMarks(form) {
  form["car-mark"].innerHTML = `<option disabled selected>Марка</option>`;
  setDefaultModels(form);
}

function setDefaultModels(form) {
  form["car-model"].innerHTML = `<option disabled selected>Модель</option>`;
  setDefaultGenerations(form);
}
function setDefaultGenerations(form) {
  form[
    "car-generation"
  ].innerHTML = `<option disabled selected>Поколение</option>`;
  setDefaultModifications(form);
}
function setDefaultModifications(form) {
  form[
    "car-modification"
  ].innerHTML = `<option disabled selected>Модификация</option>`;
}

function addToLocalStorage(modificationId) {
  let garageArr = JSON.parse(localStorage.getItem("garage"));
  if (!garageArr) {
    garageArr = [];
  }
  if (!garageArr.includes(modificationId)) {
    garageArr.push(modificationId);
  }
  localStorage.setItem("garage", JSON.stringify(garageArr));

  localStorage.setItem("currModificationId", modificationId);
}

function renderSelect(selectSelector, values) {
  const selectEl = document.querySelector(selectSelector);
  if (!selectEl) return;

  values.forEach((item) => {
    const optionEl = document.createElement("option");
    optionEl.classList.add("select-car__option");
    optionEl.dataset.id = item.id;
    optionEl.value = item.name;
    optionEl.innerHTML = item.name;

    selectEl.add(optionEl);
  });
}

async function getYears() {
  const years = await fetch("/get-car-years", {
    method: "POST",
  });
  const res = await years.json();

  return Object.values(res[0]);
}

async function getMarks(year) {
  const marks = await fetch("/get-car-marks", {
    method: "POST",
    body: JSON.stringify({
      year,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await marks.json();
}

async function getModels(year, markId) {
  const models = await fetch("/get-car-models", {
    method: "POST",
    body: JSON.stringify({
      year,
      markId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await models.json();
}

async function getGenerations(year, modelId) {
  const generations = await fetch("/get-car-generations", {
    method: "POST",
    body: JSON.stringify({
      year,
      modelId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await generations.json();
}

async function getModifications(year, generationId) {
  const modifications = await fetch("/get-car-modifications", {
    method: "POST",
    body: JSON.stringify({
      year,
      generationId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await modifications.json();
}

async function getModificationId(generationId, engineId) {
  const modificationId = await fetch("/get-car-modification-id", {
    method: "POST",
    body: JSON.stringify({
      generationId,
      engineId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await modificationId.json();
}

initialSelectCarForm();
