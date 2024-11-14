/** Flipcards JavaScript **/
$('.flip-card-content').on('click', function () {
   $(this).toggleClass('apply-flip');
});
/** Trigger Click on Focus + Enter  **/
$('.flip-card-content').keydown(function (e) {
   var keyCode = (e.keyCode ? e.keyCode : e.which);
   if (keyCode === 13) {
      $(e.target).trigger('click');
   }
});