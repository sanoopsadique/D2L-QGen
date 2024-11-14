/** Links JavaScript **/
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

/* Check for links in document */ 
var links = document.querySelectorAll("a")
/* Create index for download links unique id*/
var downloadIndex = 0;
/* Create index for new window links unique id*/
var newWindowIndex = 0;
/* Check links on page */
for(var linkIndex = 0; linkIndex < links.length; linkIndex++)
{
   /* Creating a span to wrap the screen-reader text */ 
   var srTxtWrapper = document.createElement("span");
   /* Add class .sr-only to screen-reader span */
   srTxtWrapper.classList.add("sr-only");
  
if (links[linkIndex].classList.contains("download")) {
  /* Add download attribute */
  links[linkIndex].setAttribute("download", "");
  /* Add unique id to download link */
  links[linkIndex].setAttribute("id", "download-file-" + downloadIndex);
  /* Add title attribute saying download file */
  links[linkIndex].setAttribute("title", "download file");
  /* Add data-toggle tooltip data attribute */
  links[linkIndex].setAttribute("data-toggle", "tooltip");
   /* Creating the screen-reader text */ 
  var srTxt = document.createTextNode("(this link downloads a file)");
  /* Adding the screen-reader text to the span*/ 
  srTxtWrapper.appendChild(srTxt); 
  links[linkIndex].appendChild(srTxtWrapper);
  /* Increase downloadIndex by one for next download link */
  downloadIndex++;
}
else if (links[linkIndex].classList.contains("new-window")) {
  /* Add target _blank attribute for link to open in new window */
  links[linkIndex].setAttribute("target", "_blank");
  /* Add unique id to new window link */
  links[linkIndex].setAttribute("id", "new-window" + newWindowIndex);
  /* Add title attribute saying link opens in new window */
  links[linkIndex].setAttribute("data-original-title", "opens in new window/tab");
  /* Add data-toggle tooltip data attribute */
  links[linkIndex].setAttribute("data-toggle", "tooltip");
  /* Creating the screen-reader text */ 
  var srTxt = document.createTextNode("(this link opens in a new window/tab)");
  /* Adding the screen-reader text to the span*/ 
  srTxtWrapper.appendChild(srTxt); 
  links[linkIndex].appendChild(srTxtWrapper);
}
};
