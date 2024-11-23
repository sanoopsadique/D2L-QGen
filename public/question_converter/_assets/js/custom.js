$(document).ready(function () {
    QuestionConverter.init();
    });

   const link = document.getElementById('sampleQue');
   const textbox = document.getElementById('textInput');

   // Function to check textbox and toggle link visibility
   function checkTextbox() {
   if (textbox.value.trim() === '') {
       link.style.display = 'inline'; // Show the link
   } else {
       link.style.display = 'none';  // Hide the link
   }
   }


   function loadFile() {
       fetch('./question_converter/_toolkit/quiz_question_converter/docs/sample_questions.txt')
           .then(response => response.text())
           .then(data => {
               textbox.value = data;
           })
           .catch(error => console.error('Error loading file:', error));
   }