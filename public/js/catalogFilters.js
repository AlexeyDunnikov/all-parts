import { toCurrency } from "./formatPrice.js";

export function initialFilters() {
  let priceRange = document.querySelector(".catalog__filters-range--price");
  if (!priceRange) return;

  let amountRange = document.querySelector(".catalog__filters-range--amount");
  if (!amountRange) return;

  const brandsCheckboxes = document.querySelectorAll(
    ".catalog__filters-item__brands-item__checkbox"
  );
  if (!brandsCheckboxes) return;

  const catalogItems = document.querySelectorAll(".catalog__body-item");
  if (!catalogItems) return;

  createRange(priceRange, catalogItems);
  addHandlersToPriceRange(priceRange, catalogItems);

  createRange(amountRange);
  addHandlersToAmountRange(amountRange, catalogItems);

  addHandlersToBrandsCheckboxes(brandsCheckboxes, catalogItems);
  initialBrandsBtns(brandsCheckboxes);
}

function createRange(range) {
  noUiSlider.create(range, {
    start: [+range.dataset.minValue, +range.dataset.maxValue],
    behaviour: "drag-tap",
    connect: true,
    range: {
      min: +range.dataset.minValue,
      max: +range.dataset.maxValue,
    },
  });
}

function addHandlersToPriceRange(priceRange, catalogItems) {
  priceRange.noUiSlider.on("update", (values) => {
    const minValueEl = priceRange.parentElement.querySelector(
      ".custom-range__min-value"
    );
    const maxValueEl = priceRange.parentElement.querySelector(
      ".custom-range__max-value"
    );
    const [min, max] = values;

    minValueEl.textContent = toCurrency(min);
    maxValueEl.textContent = toCurrency(max);

    setClassesForCatalogItems(catalogItems, "hidden-by-price", (item) => {
      return +item.dataset.price < min || +item.dataset.price > max;
    });
  });
}

function addHandlersToAmountRange(amountRange, catalogItems) {
  amountRange.noUiSlider.on("update", (values) => {
    const minValueEl = amountRange.parentElement.querySelector(
      ".custom-range__min-value"
    );
    const maxValueEl = amountRange.parentElement.querySelector(
      ".custom-range__max-value"
    );
    const [min, max] = values;

    minValueEl.textContent = Math.floor(min);
    maxValueEl.textContent = Math.floor(max);

    setClassesForCatalogItems(catalogItems, "hidden-by-amount", (item) => {
      return +item.dataset.amount < min || +item.dataset.amount > max;
    });
  });
}

function addHandlersToBrandsCheckboxes(brandsCheckboxes, catalogItems) {
  brandsCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (evt) => {
      const brands = [];
      brandsCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) brands.push(checkbox.dataset.brand);
      });

      if (brands.length === 0) {
        switchBrandsBtn();
      } else if (brands.length === brandsCheckboxes.length) {
        switchBrandsBtn();
      }

      setClassesForCatalogItems(catalogItems, "hidden-by-brand", (item) => {
        return !brands.includes(item.dataset.brand);
      });
    });
  });
}

function initialBrandsBtns(brandsCheckboxes) {
  const brandsBtns = document.querySelectorAll(
    ".catalog__filters-item__brand__btn"
  );
  if (!brandsBtns) return;

  brandsBtns.forEach((brandBtn) => {
    brandBtn.addEventListener("click", (evt) => {
      brandsBtnHandler(evt.target, brandsCheckboxes);
    });
  });
}

function brandsBtnHandler(target, brandsCheckboxes) {
  brandsCheckboxes.forEach((brandsCheckbox) => {
    if (target.dataset.type === "check" && !brandsCheckbox.checked) {
      brandsCheckbox.click();
    } else if (target.dataset.type === "checkout" && brandsCheckbox.checked) {
      brandsCheckbox.click();
    }
  });
}

function switchBrandsBtn() {
  const brandsCheckAllBtn = document.querySelector(
    ".catalog__filters-item__brand__btn-check-all"
  );
  const brandsCheckoutAllBtn = document.querySelector(
    ".catalog__filters-item__brand__btn-checkout-all "
  );

  brandsCheckAllBtn.classList.toggle("hidden");
  brandsCheckoutAllBtn.classList.toggle("hidden");
}

function setClassesForCatalogItems(catalogItems, itemClass, isRight) {
  catalogItems.forEach((catalogItem) => {
    if (isRight(catalogItem)) {
      catalogItem.classList.add(itemClass);
    } else {
      catalogItem.classList.remove(itemClass);
    }
  });
}
