async function initialSelectCarForm() {
  const form = document.querySelector(".select-car__form");
  if (!form) return;

  const [minYear, maxYear] = await getYears();
  const years = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  renderSelect("car-year", years);
}

async function getYears() {
  const minYear = await fetch("/get-car-years", {
    method: "POST",
  });
  const res = await minYear.json();

  return Object.values(res[0]);
}

function renderSelect(selectId, values) {
  const selectEl = document.querySelector(`#${selectId}`);
  if (!selectEl) return;

  const box = document.createElement("div");
  values.forEach((value) => {
    const optionEl = document.createElement("option");
    optionEl.classList.add("select-car__option");
    optionEl.value = value;
    optionEl.innerHTML = value;

    box.append(optionEl);
  });

  selectEl.innerHTML += box.innerHTML;
}

initialSelectCarForm();
