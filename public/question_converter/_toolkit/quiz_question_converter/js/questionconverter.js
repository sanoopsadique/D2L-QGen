/**
 * Convert Question Text to JSON (Inline Quiz)
 *
 */

var QuestionConverter = {
	inputRef: null,
	resultRef: null,	
	removeEnumRef: null,
	defaultPointRef: null,
	defaultDifficultyRef: null,
	removeEnum: null,
	defaultPoint: null,
	defaultDifficulty: null,
	txtInputString: null,
	inputTextArray: [],
	arrayLocation: 0,
	activeArrayLine: null,
	currentQuestion: 0,
	tempQuestion: '',
	fullQuestion: '',
	correctAnsCnt: 0,
	partialAnsCnt: 0,
	correctAnsValue: 0,
	partialAnsValue: 0,
	questionPointValue: 1,
	questionDifficulty: 1,
	advanceAmount: 0,
	questionImage: '',
	questionImageCaption: '',
	questionType: null,
	nonMultiQuestion: null,
	ansTrue: 0,
	ansFalse: 0,
	answerArray: [],
	feedbackArray: [],
	matchArray: [],
	choiceArray: [],
	orderArray: [],
	hintText: '',
	feedbackText: '',
	answerKeyText: '',
	initialText: '',
	choiceFeedback: '',
	trueFeedback: '',
	falseFeedback: '',
	outputCSV: [],
	outputData: '',
	questionOffset: 0,
	answerOffset: 0,
	matchDivide: 0,
	matchEnd: 0,
	partCorrectArray: [0, 20, 25, 33.33, 40, 50, 60, 66.67, 75, 80, 100]
};

/** Init Converter
 * 
 * @method init
 * @param {String} input textarea id
 * @param {String} result textarea id
 * @param {String} button id
 */
QuestionConverter.init = function () {
	var inputId = 'textInput',
		resultId = 'jsonResult',
		removeEnumId = 'removeEnum',
		defaultPointId = 'defaultPoint',
		defaultDifficultyId = 'defaultDifficulty',
		btnId = 'btnConvert';
		btnClearId = 'btnClear';

	if ((document.getElementById(inputId) !== null) && (document.getElementById(resultId) !== null)) {
		// Get user input
		QuestionConverter.inputRef = document.getElementById(inputId);

		// Get default Point Value and Difficulty
		QuestionConverter.defaultPointRef = document.getElementById(defaultPointId);

		QuestionConverter.defaultDifficultyRef = document.getElementById(defaultDifficultyId);

		// if remove enumeration from answers
		QuestionConverter.removeEnumRef = document.getElementById(removeEnumId);

		// Button onclick to convert
		document.getElementById(btnId).onclick = QuestionConverter.showResult;

		// Result area
		QuestionConverter.resultRef = document.getElementById(resultId);

		// Clear Input Button onclick to clear Input
		document.getElementById(btnClearId).onclick = QuestionConverter.clearInput;

	} else {
		this.showAlert(0, 'Error: Missing DOM object.');
		//d2log('Error: Missing DOM object')
	}
};


/** Convert Raw Text to Array, then convert Array to JSON
 * 
 * @method convertText
 */
QuestionConverter.convertText = function () {
	// Get default Point Value and Difficulty
	QuestionConverter.questionPointValue = QuestionConverter.defaultPointRef.value ? QuestionConverter.defaultPointRef.value : QuestionConverter.defaultPointRef.placeholder;

	QuestionConverter.questionDifficulty = QuestionConverter.defaultDifficultyRef.value ? QuestionConverter.defaultDifficultyRef.value : QuestionConverter.defaultDifficultyRef.placeholder;
	
	// if remove enumeration from answers
	QuestionConverter.removeEnum = QuestionConverter.removeEnumRef.checked ? true : false;

	this.txtInputString = this.inputRef.value;
	if (this.txtInputString === "") {
		this.showAlert(0, 'Please add some questions to convert');
		this.inputRef.css('background-color', '#fcf8e3');
	}

	this.txtInputString = this.txtInputString.replace(/\r\n/g, "\n");
	this.txtInputString = this.txtInputString.replace(/\r/g, "\n");

	var inputTextLength = this.txtInputString.length;

	// delete any extra line breaks at the beginning and end of text
	while (this.txtInputString.charAt(0) === "\n") {
		this.txtInputString = this.txtInputString.substring(1);
	}
	while (this.txtInputString.charAt(inputTextLength - 1) === "\n" && this.txtInputString.charAt(inputTextLength - 2) === "\n") {
		this.txtInputString = this.txtInputString.slice(0, inputTextLength - 1);
		inputTextLength = this.txtInputString.length;
	}
	this.inputTextArray = this.txtInputString.split("\n");

	this.arrayLocation = 0;
	//	console.log(this.inputTextArray);

	QuestionConverter.evalQuestion();
};

/** Convert Array JSON
 * 
 * @method evalQuestion
 */
QuestionConverter.evalQuestion = function () {
	this.questionType = "";
	this.nonMultiQuestion = false;
	this.correctAnsCnt = 0;
	this.partialAnsCnt = 0;

	//	this.questionPointValue = 1;
	//	this.questionDifficulty = 1;

	this.questionImage = "";
	this.questionImageCaption = "";

	this.hintText = "";
	this.feedbackText = "";
	this.answerKeyText = "";
	this.initialText = "";
	this.trueFeedback = "";
	this.falseFeedback = "";

	this.answerArray = [];
	this.feedbackArray = [];
	this.matchArray = [];
	this.choiceArray = [];
	this.orderArray = [];

	if (this.inputTextArray[this.arrayLocation].length < 2) {
		this.arrayLocation++;
		if (this.arrayLocation < (this.inputTextArray.length - 1)) {
			QuestionConverter.evalQuestion();
		} else {
			QuestionConverter.allDone();
		}
	}

	this.activeArrayLine = this.inputTextArray[this.arrayLocation];


	if (this.activeArrayLine.substr(0, 2) == "SA" || this.activeArrayLine.substr(0, 2) == "sa") {
		this.questionType = "SA";
		this.nonMultiQuestion = true;
		this.questionOffset = 3;
	} else if (this.activeArrayLine.substr(0, 4) == "text" || this.activeArrayLine.substr(0, 4) == "TEXT" || this.activeArrayLine.substr(0, 4) == "Text") {
		this.questionType = "TXT";
		this.nonMultiQuestion = true;
		this.questionOffset = 5;
	} else if (this.activeArrayLine.substr(0, 5) == "image" || this.activeArrayLine.substr(0, 5) == "IMAGE" || this.activeArrayLine.substr(0, 5) == "Image") {
		this.questionType = "IMG";
		this.nonMultiQuestion = true;
		this.questionOffset = 6;
	} else if (this.activeArrayLine.substr(0, 5) == "match" || this.activeArrayLine.substr(0, 5) == "MATCH" || this.activeArrayLine.substr(0, 5) == "Match") {
		this.questionType = "M";
		this.nonMultiQuestion = true;
		this.questionOffset = 6;
	} else if (this.activeArrayLine.substr(0, 5) == "order" || this.activeArrayLine.substr(0, 5) == "ORDER" || this.activeArrayLine.substr(0, 5) == "Order") {
		this.questionType = "O";
		this.nonMultiQuestion = true;
		this.questionOffset = 6;
	} else {
		this.questionOffset = 0;
	}

	QuestionConverter.getQuestionText();
};

/** Get next Question
 * 
 * @method getQuestionText
 */
QuestionConverter.getQuestionText = function () {
	var separate = 0;
	var period = this.activeArrayLine.indexOf("."); // find where the first period exists
	var paren = this.activeArrayLine.indexOf(")"); // find where the first right paranthesis exists
	var sp = this.activeArrayLine.indexOf(" ", this.questionOffset); // find where the first space exists after the previously set questionOffset value

	if (period == -1 || period > (3 + this.questionOffset)) {
		separate = paren;
	} else if (paren == -1 || paren > (3 + this.questionOffset)) {
		separate = period;
	}
	if (separate == (sp - 1)) //&& sp<(5+questionOffset)
	{
		this.tempQuestion = this.activeArrayLine.substring(sp + 1);
		this.fullQuestion = this.activeArrayLine;
		this.arrayLocation++;
		QuestionConverter.evalAnswers();
	} else {
		this.tempQuestion = this.activeArrayLine.substring(this.questionOffset);
		this.fullQuestion = this.activeArrayLine;
		this.arrayLocation++;
		QuestionConverter.evalAnswers();
	}
}

/** Evaluate Answers
 * 
 * @method evalAnswers
 */
QuestionConverter.evalAnswers = function () {
	this.activeArrayLine = new String(this.inputTextArray[this.arrayLocation]);

	if (this.arrayLocation == (this.inputTextArray.length)) {
		//check for end of input text array
		QuestionConverter.addQuestion();

	} else if (this.activeArrayLine.length == 0) {
		//check for end of answer list
		QuestionConverter.addQuestion();

	} else if (this.activeArrayLine.charAt(0) == "=") {
		//set question point value if present
		this.questionPointValue = parseInt(this.activeArrayLine.substring(1));
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "!") {
		// set question difficulty value if present
		this.questionDifficulty = parseInt(this.activeArrayLine.substring(1));
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "?") {
		//check for hint text
		this.hintText = this.activeArrayLine.substring(1);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();
	} else if (this.activeArrayLine.charAt(0) == "@" && this.activeArrayLine.charAt(1) != "@") {
		//check for main question feedback
		this.feedbackText = this.activeArrayLine.substring(1);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "&") {
		//check for answer key markup
		this.answerKeyText = this.activeArrayLine.substring(1);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "|") {
		//check for initial text markup
		this.initialText = this.activeArrayLine.substring(1);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.substr(0, 4) == "img=" || this.activeArrayLine.substr(0, 4) == "IMG=" || this.activeArrayLine.substr(0, 4) == "Img=") {
		//check for image file reference
		this.questionImage = activeArrayLine.substring(4);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.questionType == "SA") {
		//check for short answer
		this.answerArray.push(activeArrayLine);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.questionType == "M") {
		//check for matching answers
		this.matchDivide = 0;
		this.answerOffset = 0;
		if (this.removeEnum == true) {
			if ((this.activeArrayLine.charAt(0) == "(") && this.activeArrayLine.charAt(2) == ")") {
				this.activeArrayLine = this.activeArrayLine.substring(3);
			}
		if ((this.activeArrayLine.charAt(1) == "." || this.activeArrayLine.charAt(1) == ")") && this.activeArrayLine.charAt(2) == " ") {
			this.activeArrayLine = this.activeArrayLine.substring(3);
		}
		};
		this.matchDivide = (this.activeArrayLine.indexOf("/"));
		if (this.activeArrayLine.charAt(0) == "/") {
			this.choiceArray.push(this.activeArrayLine.substring(this.matchDivide + 2));
			this.matchArray.push("");
			this.answerArray.push(this.activeArrayLine);
			this.arrayLocation++;
			QuestionConverter.evalAnswers();
		} else {
			this.matchEnd = this.matchDivide - 1;
			this.choiceArray.push(this.activeArrayLine.substring(this.matchDivide + 2));
			this.matchArray.push(this.activeArrayLine.substring(0, this.matchEnd));
			this.answerArray.push(this.activeArrayLine);
			this.arrayLocation++;
			QuestionConverter.evalAnswers();
		}

	} else if (this.questionType == "O") {
		//check for Ordering answers
		this.answerOffset = 0;
		if (this.removeEnum == true) {
			if ((this.activeArrayLine.charAt(1) == "." || this.activeArrayLine.charAt(1) == ")") && this.activeArrayLine.charAt(2) == " ") {
				this.answerOffset = 3;
			}
		}
		this.orderArray.push(this.activeArrayLine.substring(this.answerOffset));
		this.answerArray.push(this.activeArrayLine.substring(this.answerOffset));
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine == "T" || this.activeArrayLine == "t" || this.activeArrayLine == "True" || this.activeArrayLine == "true" || this.activeArrayLine == "TRUE") {
		//check for True/False answer
		this.questionType = "TF";
		this.nonMultiQuestion = true;
		this.ansTrue = 100;
		this.ansFalse = 0;
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine == "F" || this.activeArrayLine == "f" || this.activeArrayLine == "False" || this.activeArrayLine == "false" || this.activeArrayLine == "FALSE") {
		this.questionType = "TF";
		this.nonMultiQuestion = true;
		this.ansTrue = 0;
		this.ansFalse = 100;
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.substr(0, 3) == "T@@" && this.questionType == "TF") {
		// check for True response feedback
		this.trueFeedback = this.activeArrayLine.substring(3);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.substr(0, 3) == "F@@" && this.questionType == "TF") {
		// check for False response feedback
		this.falseFeedback = this.activeArrayLine.substring(3);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "*") {
		//check for correct answer mark
		++this.correctAnsCnt;
		this.answerArray.push(this.activeArrayLine);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if (this.activeArrayLine.charAt(0) == "+") {
		//check for partially correct answer mark
		++this.partialAnsCnt;
		this.answerArray.push(this.activeArrayLine);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();

	} else if ((this.activeArrayLine.charAt(1) == "." || this.activeArrayLine.charAt(1) == ")") && (this.activeArrayLine.charAt(2) == " ")) {
		//check for regular answer line
		this.answerArray.push(this.activeArrayLine);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();
	} else {
		this.answerArray.push(this.activeArrayLine);
		this.arrayLocation++;
		QuestionConverter.evalAnswers();
	}
}

/** Add Question
 * 
 * @method addQuestion
 */
QuestionConverter.addQuestion = function () {

	//set questionType if Written Response question
	if ((this.answerArray.length < 1) && (this.questionType != "TF") && (this.questionType != "TXT") && (this.questionType != "IMG") && (this.questionType != "SA") && (this.questionType != "M")) {
		this.questionType = "WR";
		this.nonMultiQuestion = true;
	}

	//set questionType if Multiselect question
	if (this.correctAnsCnt >= 2) {
		// MS: All That Apply
		this.questionType = "MS";
	}

	//set questionType if Multiple Choice question
	if (this.correctAnsCnt == 1) {
		// MC: Multiple Choice
		this.questionType = "MC";
	}

	//error check MC/MS question
	if (!this.nonMultiQuestion && this.correctAnsCnt == 0) {
		QuestionConverter.showAlert(0, "A correct answer is not identified for the following question:\n\n" + this.fullQuestion + "\n\nPlease correct this in the main text box.");
		return;
	}

	this.answerOffset = 0;

	this.outputCSV.push(['NewQuestion', this.questionType, '', '', '']);
	this.outputCSV.push(['Title', '', '', '', '']);

	if (this.questionType != "IMG") {
		this.outputCSV.push(['QuestionText', String.fromCharCode(34) + this.tempQuestion + String.fromCharCode(34), '', '', '']);
	}

	if (this.questionType != "TXT" && this.questionType != "IMG") {
		this.outputCSV.push(['Points', this.questionPointValue, '', '', '']);
		this.outputCSV.push(['Difficulty', this.questionDifficulty, '', '', '']);
	}
	if (this.questionImage != "") {
		this.outputCSV.push(['Image', this.questionImage, '', '', '']);
	}

	//add data for Long Answer question
	if (this.questionType == "WR" && this.initialText != "") {
		this.outputCSV.push(['InitialText', String.fromCharCode(34) + this.initialText + String.fromCharCode(34), '', '', '']);
	}
	if (this.questionType == "WR" && this.answerKeyText != "") {
		this.outputCSV.push(['AnswerKey', String.fromCharCode(34) + this.answerKeyText + String.fromCharCode(34), '', '', '']);
	}

	//format data for Image question
	if (this.questionType == "IMG") {
		if (this.questionImageCaption == "") {
			$('.alert').addClass('d-none');
			var msgText = "The following image information entry requires an image caption:\n\n" + this.fullQuestion + "\n\nPlease correct this in the main text box.\nUse the imgcap= tag directly in front of text to include the caption."
			$('#sent_error').html(msgText).removeClass('d-none');
			return;

		} else {
			this.outputCSV.push(['Caption', String.fromCharCode(34) + this.questionImageCaption + String.fromCharCode(34), '', '', '']);
		}
	}

	//format data for True/False question
	if (this.questionType == "TF") {
		this.outputCSV.push(['TRUE', this.ansTrue, String.fromCharCode(34) + this.trueFeedback + String.fromCharCode(34), '', '']);

		this.outputCSV.push(['FALSE', this.ansFalse, String.fromCharCode(34) + this.falseFeedback + String.fromCharCode(34), '', '']);
	}

	//format data for Multiple Choice question
	if (this.questionType == "MC") {
		for (i = 0; i <= (this.answerArray.length - 1); i++) {
			this.correctAnsValue = 0;
			this.answerOffset = 0;
			this.choiceFeedback = "";

			if (this.answerArray[i].charAt(0) == "*") {
				this.correctAnsValue = 100;
				this.answerOffset += 1;
			}

			if (this.answerArray[i].charAt(0) == "+") {
				this.correctAnsValue = this.partCorrectValue.selectedItem.data;
				this.answerOffset += 1;
			}

			if (this.removeEnum == true) {
				if ((this.answerArray[i].charAt(this.answerOffset + 1) == "." || this.answerArray[i].charAt(this.answerOffset + 1) == ")") && (this.answerArray[i].charAt(this.answerOffset + 2) == " ")) {
					this.answerOffset += 3;
				}
			}

			if (i + 1 <= (this.answerArray.length - 1) && this.answerArray[i + 1].substr(0, 2) == "@@") {
				this.outputCSV.push(['Option', this.correctAnsValue.toFixed(2), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), '', String.fromCharCode(34) + this.answerArray[i + 1].substring(2) + String.fromCharCode(34)]);
				i++;

			} else {
				this.outputCSV.push(['Option', this.correctAnsValue.toFixed(2), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), '', '']);
			}
		}
	}

	//format data for Multiselect question
	if (this.questionType == "MS") {
		for (i = 0; i <= (this.answerArray.length - 1); i++) {
			this.correctAnsValue = 0;
			this.answerOffset = 0;

			if (this.answerArray[i].charAt(0) == "*") {
				this.correctAnsValue = 1;
				this.answerOffset += 1;
			}

			if (this.removeEnum == true) {
				if ((this.answerArray[i].charAt(this.answerOffset + 1) == "." || this.answerArray[i].charAt(this.answerOffset + 1) == ")") && (this.answerArray[i].charAt(this.answerOffset + 2) == " ")) {
					this.answerOffset += 3;
				}
			}

			if (i + 1 <= (this.answerArray.length - 1) && this.answerArray[i + 1].substr(0, 2) == "@@") {
				this.outputCSV.push(['Option', this.correctAnsValue.toFixed(0), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), '', String.fromCharCode(34) + this.answerArray[i + 1].substring(2) + String.fromCharCode(34)]);
				i++;
			} else {
				this.outputCSV.push(['Option', this.correctAnsValue.toFixed(0), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), '', '']);
			}
		}
	}

	//format data for Matching question
	if (this.questionType == "M") {
		this.outputCSV.push(['Scoring', 'EquallyWeighted', '', '', '']);
		for (i = 0; i <= (this.matchArray.length - 1); i++) {
			this.outputCSV.push(['Choice', i + 1, this.choiceArray[i], '', '']);
			if (this.matchArray[i] != "") {
				this.outputCSV.push(['Match', i + 1, this.matchArray[i], '', '']);
			}
		}
	}
	//format data for Ordering question
	if (this.questionType == "O") {
		this.outputCSV.push(['Scoring', 'RightMinusWrong', '', '', '']);
		for (i = 0; i <= (this.orderArray.length - 1); i++) {
			if (i + 1 <= (this.orderArray.length - 1) && this.orderArray[i + 1].substr(0, 2) == "@@") {
				this.outputCSV.push(['Item', this.orderArray[i], 'NOT HTML', String.fromCharCode(34) + this.orderArray[i + 1].substring(2) + String.fromCharCode(34)]);
				i++;
			} else {
				this.outputCSV.push(['Item', this.orderArray[i], 'NOT HTML', '']);
			}
		}
	}
	//format data for Short Answer question
	if (this.questionType == "SA") {
		this.outputCSV.push(['InputBox', '3', '40', '', '']);
		for (i = 0; i <= (this.answerArray.length - 1); i++) {
			this.advanceAmount = 0;
			this.correctAnsValue = 100;

			// check one line ahead for unique weight value of answer
			if (i + 1 <= (this.answerArray.length - 1) && this.answerArray[i + 1].charAt(0) == "%") {
				this.correctAnsValue = Number(answerArray[i + 1].substring(1)); // sets the unique weight value for answer

				this.advanceAmount = 1; // skips line beginning with "%"
			}
			if (this.answerArray[i].substr(0, 2) == "E$" || this.answerArray[i].substr(0, 2) == "e$") {
				this.answerOffset = 2;
				this.outputCSV.push(['Answer', this.correctAnsValue.toFixed(2), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), 'regexp', '']);
			} else {
				this.answerOffset = 0;
				this.outputCSV.push(['Answer', this.correctAnsValue.toFixed(2), String.fromCharCode(34) + this.answerArray[i].substring(this.answerOffset) + String.fromCharCode(34), '', '']);
			}
			i += this.advanceAmount;
		}
	}
	//add question hint and feedback if present
	if (this.questionType != "TXT" && this.questionType != "IMG") {
		if (this.hintText != "") {
			this.outputCSV.push(['Hint', String.fromCharCode(34) + this.hintText + String.fromCharCode(34), '', '', '']);
		}
		if (this.feedbackText != "") {
			this.outputCSV.push(['Feedback', String.fromCharCode(34) + this.feedbackText + String.fromCharCode(34), '', '', '']);
		}
	}

	this.arrayLocation++;

	if (this.arrayLocation >= (this.inputTextArray.length - 1)) {
		//		console.log(this.outputCSV);
		QuestionConverter.allDone();
	} else {
		QuestionConverter.evalQuestion();
	}
}

/** Completed all text
 * 
 * @method allDone
 */
QuestionConverter.allDone = function () {
	//	console.log(this.outputCSV);
	this.outputData = QuestionConverter.convertCSV(QuestionConverter.outputCSV);

	//	Display success message and save as CSV	
	QuestionConverter.showAlert(1)
	QuestionConverter.saveAsCSV('quiz.csv', this.outputData);
}

/** Show Result
 * 
 * @method showResult
 */
QuestionConverter.showResult = function () {
	$('.alert').addClass('d-none');
	QuestionConverter.resultRef.value = "";
	// Clear Data
	QuestionConverter.outputCSV = [];
	
	// Convert Questions
	QuestionConverter.convertText();

	// Display CSV
	QuestionConverter.resultRef.value = QuestionConverter.outputData;
};

/** Convert Array to CSV
 * 
 * @method convertCSV
 */
QuestionConverter.convertCSV = function (csvArray) {
	var csvData = '';
	for (var i = 0; i < csvArray.length; i++) {
		if (i == 0) {
			csvData = csvArray[i].join(',')
		} else {
			csvData = csvData + '\n' + csvArray[i].join(',');
		}
	}
	return csvData;
}

/** Save as CSV
 * 
 * @method allDone
 */
QuestionConverter.saveAsCSV = function (filename, data) {
	var blob = new Blob([data], {
		type: 'text/csv'
	});
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	} else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.getElementById('sent_success').appendChild(elem);
		elem.click();
		document.getElementById('sent_success').removeChild(elem);
	}
}
//Hide Success Message after 3 seconds
function hideSuccess() {
	document.getElementById('sent_success').classList.add('d-none');
  }


/** Show Alert Message
 * 
 * @method showAlert
 * @param {String} msgType - 1 for success or 0 for warning
 * @param {String} msgText 
 */
QuestionConverter.showAlert = function (msgType, msgText) {
	$('.alert').addClass('d-none');
	if (msgType == 1) {
		$('#sent_success').removeClass('d-none');
		setTimeout(hideSuccess, 3000); 
	} else {
		$('#sent_error').html(msgText).removeClass('d-none');
	}
}


/** Clear Input
 * 
 * @method clearInput
 */
QuestionConverter.clearInput = function () {
	document.getElementById("textInput").value = "";
	const link = document.getElementById('sampleQue');
    link.style.display = 'inline'; // Show the link
}

/**
 * Generic D2L logging method. Used to try and prevent large amounts of console logging in production.
 *
 * @method d2log
 * @param {string} m
 * @return {} Console logs m
 */
function d2log(m) {
	if (typeof D2LDEBUG !== 'undefined') {
		if (D2LDEBUG) {
			console.log(m);
		}
	}
}