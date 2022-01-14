$(function () {
  if ($(".catalog-subcategories__dropdown-list")) {
    $(".catalog-subcategories__dropdown-list").hide();
    $(".catalog-categories__item-category").on("click", function () {
      $(this).closest(".catalog-categories__item").toggleClass("active");
      $(this)
        .next()
        .slideToggle(200, function () {
          if ($(this).is(":visible")) $(this).css("display", "grid");
        });
    });
  }
});
