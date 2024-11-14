      /** Accordions JavaScript **/

      /** Accordions - dynamically add id **/
      $.each($(".accordion"), function (index) {
         $(this).attr("id", "accordion_" + parseInt(index + 1));
      });

      /** Accordions - dynamically add interaction **/
      $.each($(".accordion > .card"), function (index, value) {
         var num = index + 1;
         $(value).children(".card-header").attr("id", "heading_acc_" + num);
         $(value).find(".card-header > .card-title > button").attr({
            "data-target": "#collapse_acc_" + num,
            "aria-controls": "collapse_acc_" + num
         });
         $(value).children(".collapse").attr({
            id: "collapse_acc_" + num,
            "aria-labelledby": "heading_acc_" + num
         });
      });

      //button to open & close all accordion slides.
      $('.expandall').on('click', function () {
         var nextAccordion = $(this).parent().next('.accordion');
         // in case button is not in p tag
         if ($(this).next('.accordion').length > 0) {
            nextAccordion = $(this).next('.accordion');
         }
         var nextAccId = '#' + nextAccordion.attr('id');
         //console.log(nextAccId);
         if ($(nextAccId).hasClass("show-all")) {
            $(nextAccId + ' .collapse.show').collapse('hide');
            $(nextAccId).removeClass("show-all");
            $(this).attr("aria-expanded","false");
            $(this).text("Open All Panels");
         } else {
            $(nextAccId + ' .collapse:not(".show")').collapse('show');
            $(nextAccId).addClass("show-all");
            $(this).attr("aria-expanded","true");
            $(this).text("Close All Panels");
         }
      });