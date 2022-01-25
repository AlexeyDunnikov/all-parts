$(function () {
  $(".js__dropdown-list").hide();
  $(".js__dropdown-body").on("click", function () {
    $(this).closest(".js__dropdown-wrapper").toggleClass("active");
    $(this)
      .next()
      .slideToggle(200);
  });
});
