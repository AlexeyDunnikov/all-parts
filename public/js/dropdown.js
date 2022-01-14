$(function () {
  $(".catalog__dropdown-list").hide();
  $(".catalog__item-category").on("click", function () {
    $(this).closest(".catalog__item").toggleClass("active");
    $(this)
      .next()
      .slideToggle(200, function () {
        if ($(this).is(":visible")) $(this).css("display", "grid");
      });
  });
});
