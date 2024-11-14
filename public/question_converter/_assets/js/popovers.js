/** Popovers JavaScript **/
$(function () {
  $('[data-toggle="popover-top"]').popover({
    html: true
    
    

  });

  $('[data-toggle="popover-bottom"]').popover({
    html: true
   
    
 
  });

  $('[data-toggle="popover-left"]').popover({
    html: true
    
    
 
  });

  $('[data-toggle="popover-right"]').popover({
     html: true
   
    
 
  });

//   $('body').on('click', function (e) {
//     $('[data-toggle="popover"]').each(function () {
//         //the 'is' for buttons that trigger popups
//         //the 'has' for icons within a button that triggers a popup
//         if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
//             $(this).popover('hide');
//         }
//     });
// });
});