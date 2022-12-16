
/* Basic Screen Interaction */

function writeToScreen(screenSection, text){
	
	if (screenSection.innerText.length < 20)
		screenSection.innerText += text;
}

function clearSection(screenSection){
	screenSection.innerText = '';
}

function clearScreen(){
	clearSection(screen.mainSection);
	clearSection(screen.auxSection);
}

function input(text){
	writeToScreen(screen.mainSection, text);
}

function swapSections(){
	let tmp = screen.mainSection.innerText;
	screen.mainSection.innerText = screen.auxSection.innerText;
	screen.auxSection.innerText = tmp;
}

function resetState(){
	screen.undefinedState = false;
	clearSection(screen.mainSection);
}

/* Calculator Functions */
/* All of these should check for overflows of over 20 digits */

function evaluate(){
	let leftHandSide = Number(screen.auxSection.innerText);
	let rightHandSide = Number(screen.mainSection.innerText.slice(1, screen.mainSection.innerText.length));
	let operator = screen.mainSection.innerText[0];
	
	let result = operatorMap[operator].operation(leftHandSide, rightHandSide);
	clearScreen();
	input(result);
}

function addition (leftHandSide, rightHandSide){
	return leftHandSide + rightHandSide;
}

function substraction (leftHandSide, rightHandSide){
	return leftHandSide - rightHandSide;
}

function multiplication (leftHandSide, rightHandSide){
	return leftHandSide * rightHandSide;
}

function division (leftHandSide, rightHandSide){
	if (rightHandSide === 0)
	{
		screen.undefinedState = true;
		return 'UNDEFINED';
	}
	return leftHandSide / rightHandSide;
}

/* Event Handlers */

function handleNumberPress(e){
	if (screen.undefinedState === true)
		resetState();
	input(e.target.classList[1]);
}

function handleKeyBoardInput(e){
	if (e.keyCode >= 48 && e.keyCode <= 57){
		input(`${e.keyCode - 48}`);
	}
}

function simpleOperatorHandler(e){
	if (screen.undefinedState === true)
		resetState();
	if (screen.mainSection.innerText.length){
		if (operatorMap[screen.mainSection.innerText[0]] !== undefined){
			evaluate();
		}
		swapSections();
		input(e.target.classList[1]);
	}
}

function delOperatorHandler(e){
	buffer = screen.mainSection.innerText;
	if (screen.undefinedState)
		resetState()
	else if (buffer.length)
		screen.mainSection.innerText = buffer.slice(0, buffer.length - 1);
		
}

function clearOperatorHandler(e){
	screen.mainSection.innerText = '';
	screen.auxSection.innerText = '';
}

function dotOperatorHandler(e){
	let buffer = screen.mainSection.innerText;

	if (buffer.length && !isNaN(buffer[buffer.length -1]) && buffer.search(/[.]/) === -1)
	{
		input('.');
	}
}

function evalOperatorHandler(e){
	evaluate();
}

function percentOperatorHandler (e){
	number = Number(screen.mainSection.innerText);

	number /= 100;
	clearSection(screen.mainSection);
	input(number);
}

/* Set Up Routines and Constructors*/

function screenObject(screenNode){

	this.mainSection = screenNode.querySelector('.main');
	this.auxSection = screenNode.querySelector('.aux');
	this.undefinedState = false;
}

function operator (handler, operation = null){
	this.handler = handler;
	this.operation = operation;
}

const operatorMap = {

	'x': new operator(simpleOperatorHandler, multiplication),
	'D': new operator(delOperatorHandler),
	'/': new operator(simpleOperatorHandler, division),
	'%': new operator(percentOperatorHandler),
	'+': new operator(simpleOperatorHandler, addition),
	'C': new operator(clearOperatorHandler),
	'.': new operator(dotOperatorHandler),
	'-': new operator(simpleOperatorHandler, substraction),
	'=': new operator(evalOperatorHandler),
}


function operatorSetUp(button){
	button.addEventListener('click', operatorMap[button.classList[1]].handler);
}

function buttonSetUp(){
	
	const numericButtons = buttonGrid.querySelectorAll('.number');
	const operatorButtons = buttonGrid.querySelectorAll('.operator');

	for (let button of numericButtons){
		button.addEventListener('click', handleNumberPress);
	}
	for (let button of operatorButtons){
		operatorSetUp(button);
	}
	document.body.addEventListener('keydown', handleKeyBoardInput);
}

const screen = new screenObject(document.querySelector('.screen'));

const buttonGrid = document.querySelector('.button-grid');

buttonSetUp();

