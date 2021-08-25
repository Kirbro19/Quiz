const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

class Quiz {
	constructor(type, questions, results) {

		this.type = type;

		this.questions = questions;

		this.results = results;

		this.score = 0;

		this.result = 0;

		this.current = 0;
	}

	handleAnswerButtonClick(index) {
		let value = this.questions[this.current].handleAnswerButtonClick(index);
		this.score += value;

		let correct = -1;

		if(value >= 1) {
			correct = index;

		} else {

			for(let i = 0; i < this.questions[this.current].answers.length; i++) {
				if(this.questions[this.current].answers[i].value >= 1) {
					correct = i;
					break;
				}
			}
		}

		this.next();

		return correct;
	}

	next() {
		this.current++;
		
		if(this.current >= this.questions.length) {
			this.end();
		}
	}

	end() {
		for(let i = 0; i < this.results.length; i++) {
			if(this.results[i].check(this.score)) {
				this.result = i;
			}
		}
	}
} 

class Question {
	constructor(text, answers) {
		this.text = text; 
		this.answers = answers; 
	}

	handleAnswerButtonClick(index) {
		return this.answers[index].value; 
	}
}

class Answer {
	constructor(text, value) {
		this.text = text; 
		this.value = value; 
	}
}

class Result {
	constructor(text, value) {
		this.text = text;
		this.value = value;
	}

	check(value) {
		if(this.value <= value) {
			return true;
		} else {
			return false;
		}
	}
}

const results = [
  new Result("Лошара", 0),
  new Result("Мог лучше", 3),
  new Result("Ещё бы чуть-чуть",6),
  new Result("Красава!", 9),
];

const result = [2, 'hello', true].map((item) => typeof item);

console.log(result);

function shuffle(questions) {
	for (let i = questions.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  [questions[i], questions[j]] = [questions[j], questions[i]];
	}
	//return questions;
  }


const questions = [
  new Question("2 + 2 = ", [
    new Answer("1", 0),
    new Answer("2", 0),
    new Answer("3", 0),
    new Answer("4", 1)
  ]),

  new Question("3 + 3 = ", [
    new Answer("2", 0),
    new Answer("4", 0),
    new Answer("6", 1),
    new Answer("8", 0)
  ]),

  new Question("1 + 4 = ", [
    new Answer("2", 0),
    new Answer("4", 0),
    new Answer("5", 1),
    new Answer("7", 0)
  ]),

  new Question("4 - 2 = ", [
    new Answer("2", 1),
    new Answer("3", 0),
    new Answer("4", 0),
    new Answer("6", 0)
  ]),

  new Question("7 - 3 = ", [
    new Answer("2", 0),
    new Answer("4", 1),
    new Answer("6", 0),
    new Answer("8", 0)
  ]),

  new Question("1 + 1 = ", [
    new Answer("2", 1),
    new Answer("3", 0),
    new Answer("5", 0),
    new Answer("9", 0)
  ]),

  new Question("3 + 5 = ", [
    new Answer("2", 0),
    new Answer("4", 0),
    new Answer("6", 0),
    new Answer("8", 1)
  ]),

  new Question("7 + 1 = ", [
    new Answer("0", 0),
    new Answer("5", 0),
    new Answer("6", 0),
    new Answer("8", 1)
  ]),

  new Question("3 + 4 = ", [
    new Answer("2", 0),
    new Answer("4", 0),
    new Answer("5", 0),
    new Answer("7", 1)
  ]),

  new Question("5 + 4 = ", [
    new Answer("1", 0),
    new Answer("3", 0),
    new Answer("4", 0),
    new Answer("9", 1)
  ]),
];

const quiz = new Quiz(1, questions, results);

shuffle(questions);

update();

function update() {
	if(quiz.current < quiz.questions.length) {

		headElem.innerHTML = quiz.questions[quiz.current].text;

		buttonsElem.innerHTML = "";

		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++) {
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("data-index", i);

			buttonsElem.appendChild(btn);
		}
		
		pagesElem.innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;

		init();

	} else {

		buttonsElem.innerHTML = "";
		headElem.innerHTML = quiz.results[quiz.result].text;
		pagesElem.innerHTML = "Очки: " + quiz.score;
	}
}

function init() {
	let btns = Array.from(document.getElementsByClassName("button"));

	btns.forEach(e => {
		e.addEventListener("click", (e) =>  { 
			handleAnswerButtonClick(e.target.getAttribute("data-index")); 
		});
	});
}

function handleAnswerButtonClick(index) {
	let correct = quiz.handleAnswerButtonClick(index);

	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++) {
		btns[i].className = "button button_passive";
	}

	if(quiz.type === 1) {
		if(correct >= 0) {
			btns[correct].className = "button button_correct";
		}

		if(index != correct) {
			btns[index].className = "button button_wrong";
		} 
	} else {

		btns[index].className = "button button_correct";
	}

	setTimeout(update, 800);
}