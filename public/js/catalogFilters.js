import { toCurrency } from "./formatPrice.js";

export function initialRanges() {
  const ranges = document.querySelectorAll(".custom-range");
  if (!ranges) return;

  ranges.forEach((range) => {
    noUiSlider.create(range, {
      start: [+range.dataset.minValue, +range.dataset.maxValue],
      behaviour: "drag-tap",
      connect: true,
      range: {
        min: +range.dataset.minValue,
        max: +range.dataset.maxValue,
      },
    });

    range.noUiSlider.on("update", (values) => {
      const minValueEl = range.parentElement.querySelector(
        ".custom-range__min-value"
      );
      const maxValueEl = range.parentElement.querySelector(
        ".custom-range__max-value"
      );
      const [min, max] = values;

      if (
        minValueEl.classList.contains("price") ||
        maxValueEl.classList.contains("price")
      ) {
        minValueEl.textContent = toCurrency(min);
        maxValueEl.textContent = toCurrency(max);
      }
      if (
        minValueEl.classList.contains("integer") ||
        maxValueEl.classList.contains("integer")
      ) {
        minValueEl.textContent = Math.floor(min);
        maxValueEl.textContent = Math.floor(max);
      }
    });
  });
}
