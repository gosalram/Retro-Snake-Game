//Define HTML elements
const board=document.getElementById('game-board');
const instructionText =document.getElementById('instruction-text');
const logo =document.getElementById('logo');
const score =document.getElementById('score');
const highScoreText =document.getElementById('highScore');

//Define Game variables
//starting position of snake from center of board
const gridSize=20;
let snake=[{x:10 ,y:10}];
//generating randomise position of food
let food=generateFood();
let highScore= 0;
let direction='right';
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;


//Draw game map(maze),snake,food
function draw(){
//clearing the board before begin
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw Snake
function drawSnake(){
//for every array(snake) elements do this arrow function
    snake.forEach((segment)=>{
        // creating a div with class name snake
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    })
}

//Create snake or food cube/div
function createGameElement(tag,className){
    //creating a new HTML element inside js
    const element=document.createElement(tag);
    //left side is inbuilt 
    element.className=className;
    return element;
}

//set position of snake or food
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//Testing draw function
// draw();

function drawFood() {
    if (gameStarted) {
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement)
    }
}
//Generate Food

function generateFood() {
    const x=Math.floor(Math.random() * gridSize) +1;
    const y=Math.floor(Math.random() * gridSize) +1;
    return{x,y};
}

//Moving the snake
function move(){
    //getting the duplicate of position [Note : Dont ever change the orginal value coz will cause other problems ]
    const head = {  ...snake[0] };
    switch (direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    //add the element to the start (creating the illusion of growing)
    snake.unshift(head);                                                               
    //remove the element from the end (deleting the previous position )
    // snake.pop();

    if (head.x===food.x && head.y===food.y) //basically on same position
    {
        food=generateFood(); //new food position
        increaseSpeed();
        clearInterval(gameInterval);     // to avoid unnecessary bugs& Clear past interval
        gameInterval=setInterval(() =>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    } else {
        snake.pop();
    }
}

                                                                                // //Test moving

                                                                                // setInterval(()=>{
                                                                                //     move();    //move first
                                                                                //     draw();    //then draw again the new position
                                                                                // },100);        // time in milliseconds

                                                                                // // Now to make snake bigger if it hits food 

function startGame() {
    gameStarted=true; //keep track of a running game
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(() => {
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

// key press listener 

function handleKeyPress(event) {
    if(
        (!gameStarted && event.code==='Space')  ||
        (!gameStarted && event.code==='')  
    ){
        startGame();
    } else{
        switch(event.key) {
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}
document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    // console.log(gameSpeedDelay);
    if(gameSpeedDelay >150) {
        gameSpeedDelay-=5;
    }
    else if(gameSpeedDelay >100) {
        gameSpeedDelay-=3;
    }
    else if(gameSpeedDelay >50) {
        gameSpeedDelay-=2;
    }
    else if(gameSpeedDelay >25) {
        gameSpeedDelay-=1;
    }
}
 
function checkCollision(){
    const head= snake[0];           // zeroth index of snake (i.e(head) 
    //  if condition for snake when hit on the border 
    if(head.x < 1 || head.x > gridSize  || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    // for loop for when snake gonna hit itself (iterating through out snake)
    for(let i=1; i< snake.length ;i++){
        if(head.x=== snake[i].x && head.y=== snake[i].y){
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake=[{ x: 10 ,y: 10 }];
    food=generateFood();
    direction='right';
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length -1;
    score.textContent=currentScore.toString().padStart(3,'0');  // to make it as triple digit when it progress rather that single digit 
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display='block';
    logo.style.display='block';
}

function updateHighScore() {
    const currentScore=snake.length - 1;
    if (currentScore > highScore){
        highScore= currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block';

}
