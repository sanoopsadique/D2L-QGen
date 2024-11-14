/** Copy Button JavaScript **/
$(".copy-btn").on('click', function () {
         var copyText = $(this).parent().prev('.copy-this');
         //copyToClipBoard(copyText[0].textContent);
         var copyTextString = String(copyText[0].textContent);
         var tempTextArea = document.createElement('textarea');
         tempTextArea.value = copyTextString;
         document.body.appendChild(tempTextArea);
         tempTextArea.select();
         document.execCommand('copy');
         document.body.removeChild(tempTextArea);
      });