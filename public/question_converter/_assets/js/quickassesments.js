/** Quick Assesments JavaScript **/
/* Quick Assessment - Multiple Choice */
		/* Enable Button to Check Answer */
		$(".quick-assess-mc input[type=radio]").click(function() {
			$(".quick-assess-mc .btn-quick-assess").removeAttr("disabled");
      });
      /* When displaying answer - show answer symbols and disable button and radio buttons */
      $(".quick-assess-mc .btn-quick-assess").click(function() {
            $(".quick-assess-mc .ans-symbol").removeClass("invisible");
            $('.quick-assess-mc .collapse').on('shown.bs.collapse', function () {
               $(".quick-assess-mc .btn-quick-assess, .quick-assess-mc input").prop('disabled', true);
            })
      });

/* Quick Assessment - All That Apply (Multi-select) */
/* Enable Button to Check Answer */
$(".quick-assess-ms input[type=checkbox]").click(function() {
   $(".quick-assess-ms .btn-quick-assess").removeAttr("disabled");
});
/* When displaying answer - show answer symbols and disable button and radio buttons */
$(".quick-assess-ms .btn-quick-assess").click(function() {
   $(".quick-assess-ms .ans-symbol").removeClass("invisible");
   $('.quick-assess-ms .collapse').on('shown.bs.collapse', function () {
      $(".quick-assess-ms .btn-quick-assess, .quick-assess-ms input").prop('disabled', true);
   })
});

/* Quick Assessment - Short Answers (Fill in the Blank) */
/*  Enable Button to Check Answer */
$('.quick-assess-sa input[type=text]').keyup(function() {
   var noInput = false;
   $('.quick-assess-sa input[type=text]').each(function() {
      if ($(this).val() == '') {
         noInput = true;
      }
   });
   if (noInput) {
      $(".quick-assess-sa .btn-quick-assess").prop('disabled', true);
   } else {
      $(".quick-assess-sa .btn-quick-assess").removeAttr("disabled");
   }
});
/* When displaying answer disable buttons and form fields */
$(".quick-assess-sa .btn-quick-assess").click(function() {
   $('.quick-assess-sa .collapse').on('shown.bs.collapse', function () {
      $(".quick-assess-sa .btn-quick-assess, .quick-assess-sa input").prop('disabled', true);
   })
});

/* Quick Assessment - Drop Down */
/* Enable Button to Check Answer  */
$('.quick-assess-dd select').change(function() {
   var noInput = false;
   $('.quick-assess-dd select').each(function() {
      if ($(this).val() == null) {
         noInput = true;
      }
   });
   if (noInput) {
      $(".quick-assess-dd .btn-quick-assess").prop('disabled', true);
   } else {
      $(".quick-assess-dd .btn-quick-assess").removeAttr("disabled");
   }
});
/* When displaying answer disable buttons and form fields */
$(".quick-assess-dd .btn-quick-assess").click(function() {
   $('.quick-assess-dd .collapse').on('shown.bs.collapse', function () {
      $(".quick-assess-dd .btn-quick-assess, .quick-assess-dd select").prop('disabled', true);
   })
});