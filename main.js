const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

const HOST = "https://my-json-server.typicode.com";

class Quiz {
	constructor(questions, results) {

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


let questions = [];

let quiz = new Quiz(questions, results);

async function getResponse() {
	const response = await fetch(HOST + "/Kirbro19/Quiz/questions");
	const content = await response.json();
	console.log(response);
	console.log(content);
	questions = content.map((question) => {
		return new Question(question.quest, question.answers.map((answer) => new Answer(answer.text, answer.value)));
	});

	quiz = new Quiz(questions, results);

	shuffle(questions);
	update();
};

getResponse();

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

	if(correct >= 0) {
			btns[correct].className = "button button_correct";
	}

	if(index != correct) {
			btns[index].className = "button button_wrong";

	} else {

		btns[index].className = "button button_correct";
	}

	setTimeout(update, 800);
}