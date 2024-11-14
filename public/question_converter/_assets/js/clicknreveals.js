/** Click and Reveal JavaScript **/

//Disable button onclick
$('.btn-reveal').on('click', function () {
    var $_this = $(this);
    setTimeout(function () {
        $_this.attr('disabled', true);
    }, 500);
});