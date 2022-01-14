function renderGarage(isFirstRender = false) {
  const garageList = document.querySelector(".garage__list");
  if (!garageList) return;

  garageList.innerHTML = "";

  const modificationsArr = JSON.parse(localStorage.getItem("garage"));

  if (modificationsArr.length === 0) {
    document.querySelector(".garage").classList.add("hide");
    return;
  }
  if(isFirstRender){
    document.querySelector(".select-car").classList.add("hide");
  }

  const currModificationId = +localStorage.getItem("currModificationId") ?? 1;

  modificationsArr.reverse();

  modificationsArr.forEach(async (modificationId) => {
    const info = await getModificationInfo(modificationId);

    const li = document.createElement("li");
    li.classList.add("garage__item");

    li.innerHTML = `
       <a href="/catalog?mod_id=${modificationId}" class="garage__item-link">
          <img class="garage__item-img" src="./images/cars-images/${info.img}" alt="car" />
          <div class="garage__item-content">
            <p class="garage__item-name">
                ${info.mark} ${info.model} ${info.generation} ${info.engine_value}
            </p>
            <p class="garage__item-description">
                Двигатель: ${info.engine_name}, ${info.engine_horses} л.с., ${info.engine_power} к.в., ${info.year_from} - ${info.year_to}
            </p>
          </div>
        </a>
    `;

    delBtn = document.createElement("button");
    delBtn.classList.add("garage__item-delete");
    delBtn.dataset.modId = modificationId;
    delBtn.innerHTML = ` <svg
              class="garage__item-delete__img"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9374 13L24.8957 4.06248C25.288 3.67018 25.5084 3.13811 25.5084 2.58331C25.5084 2.02852 25.288 1.49645 24.8957 1.10415C24.5034 0.711847 23.9713 0.491455 23.4165 0.491455C22.8617 0.491455 22.3297 0.711847 21.9374 1.10415L12.9999 10.0625L4.06237 1.10415C3.67007 0.711847 3.138 0.491455 2.58321 0.491455C2.02841 0.491455 1.49634 0.711847 1.10404 1.10415C0.71174 1.49645 0.491348 2.02852 0.491348 2.58331C0.491348 3.13811 0.71174 3.67018 1.10404 4.06248L10.0624 13L1.10404 21.9375C0.908772 22.1311 0.753784 22.3616 0.648016 22.6154C0.542248 22.8693 0.487793 23.1416 0.487793 23.4166C0.487793 23.6917 0.542248 23.964 0.648016 24.2178C0.753784 24.4717 0.908772 24.7021 1.10404 24.8958C1.29771 25.0911 1.52813 25.2461 1.782 25.3518C2.03588 25.4576 2.30818 25.5121 2.58321 25.5121C2.85823 25.5121 3.13053 25.4576 3.38441 25.3518C3.63828 25.2461 3.8687 25.0911 4.06237 24.8958L12.9999 15.9375L21.9374 24.8958C22.1311 25.0911 22.3615 25.2461 22.6153 25.3518C22.8692 25.4576 23.1415 25.5121 23.4165 25.5121C23.6916 25.5121 23.9639 25.4576 24.2177 25.3518C24.4716 25.2461 24.702 25.0911 24.8957 24.8958C25.091 24.7021 25.246 24.4717 25.3517 24.2178C25.4575 23.964 25.512 23.6917 25.512 23.4166C25.512 23.1416 25.4575 22.8693 25.3517 22.6154C25.246 22.3616 25.091 22.1311 24.8957 21.9375L15.9374 13Z"
                fill="#111"
              ></path>
            </svg>`;

    delBtn.addEventListener("click", (evt) => {
      const target = evt.target.closest(".garage__item-delete");
      const id = target.dataset.modId;

      const index = modificationsArr.indexOf(+id);
      modificationsArr.splice(index, 1);
      if (modificationsArr.length === 0) {
        document.querySelector(".select-car").classList.remove("hide");
        const form = document.querySelector(".select-car__form");
        if (!form) return;
        setDefaultYears(form);
      }

      localStorage.setItem("garage", JSON.stringify(modificationsArr));

      renderGarage();
    });

    li.append(delBtn);

    if (currModificationId === modificationId) {
      garageList.prepend(li);
    } else {
      garageList.append(li);
    }
  });
}

async function getModificationInfo(modificationId) {
  const modificationInfo = await fetch("/get-car-modification-info", {
    method: "POST",
    body: JSON.stringify({
      modificationId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await modificationInfo.json();
}

function addToGarageBtn() {
  const addBtn = document.querySelector(".garage__add-btn");
  if (!addBtn) return;

  addBtn.addEventListener("click", async (evt) => {
    document.querySelector(".select-car").classList.remove("hide");
    const form = document.querySelector(".select-car__form");
    if (!form) return;
    setDefaultYears(form);
  });
}

renderGarage(true);
addToGarageBtn();
