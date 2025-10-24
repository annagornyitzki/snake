
//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;

// score/ high score
var score = 0;
var highScore = parseInt(localStorage.getItem("snakeHighScore") || 0);

var scoreEl;
var highScoreEl;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board
    board.style.border = "4px solid #2d7a8a";


    // grab DOM elements for score display
    scoreEl = document.getElementById("score");
    highScoreEl = document.getElementById("highScore");
    // initialize text
    if (scoreEl) scoreEl.innerText = "Score: " + score;
    if (highScoreEl) highScoreEl.innerText = "High: " + highScore;


    placeFood();

     // allow restart with Enter key
    this.document.addEventListener("keyup", function(e){
        if (e.code === "Enter" && gameOver){
            resetGame();
        }
    });

    this.document.addEventListener("keyup", changeDirection);
    //update();
    setInterval(update, 1000/10); //100 milliseconds
}

function update(){
    if (gameOver){
        drawGameOver();
        return;
    }

    context.fillStyle="white";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="#d14388";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if(snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY])
        score++;

         // update high score immediately and persist
        if (score > highScore){
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }

        // update DOM scoreboard
        if (scoreEl) scoreEl.innerText = "Score: " + score;
        if (highScoreEl) highScoreEl.innerText = "High: " + highScore;

        placeFood();
    }

    for(let i = snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }
    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="#65c98f";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for(let i=0; i< snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // draw score info


    // game over conditions
    if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows*blockSize){
        gameOver = true;
        // persist high score (already persisted on eat, but keep safe)
        if (score > highScore){
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }
        return;
    }
    for (let i = 0; i< snakeBody.length; i++){
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = true;
            if (score > highScore){
                highScore = score;
                localStorage.setItem("snakeHighScore", highScore);
            }
            return;
        }
    }
}

function changeDirection(e){
    if ((e.code == "ArrowUp" || e.key === "w") && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if ((e.code == "ArrowDown" || e.key === "s") && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    if ((e.code == "ArrowLeft" || e.key === "a") && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    if ((e.code == "ArrowRight" || e.key === "d") && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}
function placeFood(){
    //(0-1)*cols -> (0-19.9999) -> (0-19)* 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function drawGameOver(){
    // translucent overlay
    context.fillStyle = "#878486";
    context.fillRect(0,0,board.width, board.height);

    context.fillStyle = "black";
    context.font = "25px 'Poppins', sans-serif";
    context.fillStyle = "white";
    context.font = "36px Poppins #2d7a8a";
    context.textAlign = "center";
    context.fillText("GAME OVER", board.width/2, board.height/2 - 10);

    context.font = "18px Poppins #2d7a8a";
    context.fillText("Score: " + score + "  High Score: " + highScore, board.width/2, board.height/2 + 20);

    context.font = "16px Poppins #2d7a8a";
    context.fillText("Press Enter to restart", board.width/2, board.height/2 + 50);

    // reset text alignment for other draws
    context.textAlign = "start";
}

function resetGame(){
    // reset positions and state
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;
    placeFood();

    if (scoreEl) scoreEl.innerText = "Score: " + score;
    if (highScoreEl) highScoreEl.innerText = "High: " + highScore;
}