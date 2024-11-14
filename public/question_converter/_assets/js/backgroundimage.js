/** Background Image JavaScript **/
/* Get all the elements with the class bg-img-wrapper on page */
var bgImgWrapper = document.getElementsByClassName("bg-img-wrapper");
/* Cycle through the elements we want to have a background image */
for(var bgImgIndex = 0; bgImgIndex < bgImgWrapper.length; bgImgIndex++)
{
   /* Declare variable bgImgId */
   var bgImgWrapperId = "bg-img-wrapper-" + parseInt(bgImgIndex);
   /* Add bgImgWrapperId as unique ID to each element with class .bg-img-wrapper */
   document.querySelectorAll('.bg-img-wrapper')[bgImgIndex].setAttribute("id", bgImgWrapperId);
   /* Get the background image from the source of the first child image */
   var bgImg = document.getElementById(bgImgWrapperId).getElementsByTagName('img')[0].src;
   /* Set the background image on each element with class .bg-img-wrapper */
   document.querySelectorAll('.bg-img-wrapper')[bgImgIndex].setAttribute("style", 'background-image: url(' + bgImg + ');');
};