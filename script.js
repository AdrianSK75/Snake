const snakeboard = document.getElementById("gameBoard");
const stats = document.getElementById("stats");
const ctx = snakeboard.getContext("2d");

const manage = {
    board: {
        border: 'black',
        background: "#dbe6fd",
    },
    food: {
        x: 0, 
        y: 0,
    },
    dx: -10,
    dy: 0,
    changing_direction: false,
};

class Snake {
    constructor(snake, score) {
        this.snake = snake;
        this.score = score;
    }
    
    get getSnake() {
        return this.snake;
    }
    
    drawSnake() {
        this.snake.forEach(function drawSnakePart(snakePart) {
            ctx.fillStyle = '#346751';
            ctx.fillRect(snakePart.x, snakePart.y, 12, 12);
        });
    }

    drawFood() {
        ctx.fillStyle = '#c84b31';
        ctx.fillRect(manage.food.x, manage.food.y, 12, 12);
    }

    getFood(min , max) {
        return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }
    
    move_snake() {
        const head = {x: this.snake[0].x + manage.dx, y: this.snake[0].y + manage.dy,};
        
        this.snake.unshift(head);
    
        if(this.snake[0].x === manage.food.x && this.snake[0].y === manage.food.y) {
            let highscore = localStorage.getItem("highscore");
            this.score += 10;

            if(highscore !== null) {
                if(this.score > highscore) {
                    localStorage.setItem("highscore", this.score);
                }
            } else {
                localStorage.setItem("highscore", this.score);
            }

            document.getElementById("score").innerHTML = "Score: " + this.score + " HighScore: " + localStorage.getItem("highscore");
            generate_food();
        } else {
            this.snake.pop();
        }   
    }   
}

const snake = new Snake([{x: 200, y: 200}, {x: 190, y: 200}, {x: 180 , y: 200},], 0);

generate_food();
document.addEventListener("keydown", move_controller);

function StartGame() {
            document.getElementById("press").remove();
            document.getElementById("score").innerHTML = "Score: " + 0;
   
            Main();
}


function Main() {
    if(statusGame()) 
        return $(stats).append(`<button id = "restart" onclick = "location.reload();">Try Again</button>`);

    
    manage.changing_direction = false;
    setTimeout(function onTick() {
        clear_board();       
        snake.drawFood();
        snake.move_snake();
        snake.drawSnake();
        
        Main();
    }, 150)
}


function clear_board() {

    ctx.fillStyle = manage.board.background;

    ctx.strokestyle = manage.board.border;

    ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);

    ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function move_controller(event) {
        if(manage.changing_direction) return;
        manage.changing_direction = true;
        
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
      
        const keyPressed = event.keyCode;
        const goingUp = manage.dy === -10;
        const goingDown = manage.dy === 10;
        const goingRight = manage.dx === 10;  
        const goingLeft = manage.dx === -10;
      
        if (keyPressed === LEFT_KEY && !goingRight){    
                manage.dx = -10;
                manage.dy = 0;  
        }
      
        if (keyPressed === UP_KEY && !goingDown) {    
               manage.dx = 0;
               manage.dy = -10;
        }
      
        if (keyPressed === RIGHT_KEY && !goingLeft) {    
               manage.dx = 10;
               manage.dy = 0;
        }
      
        if (keyPressed === DOWN_KEY && !goingUp) {    
               manage.dx = 0;
               manage.dy = 10;
        }
}

function statusGame() {
        let snake1 = snake.getSnake;
        for(let i = 3; i < snake1.length; ++i) {
            const has_collided = snake1[i].x === snake1[0].x && snake1[i].y === snake1[0].y;
            if(has_collided)
                return true;
        }
            const hitLeftWall = snake1[0].x < 0;
            const hitRightWall = snake1[0].x > snakeboard.width - 10;
            const hitTopWall = snake1[0].y < 0;
            const hitBottomWall = snake1[0].y > snakeboard.height - 10;

            return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;       
}

function generate_food() {
    let snake1 = snake.getSnake;
    manage.food.x = snake.getFood(0, snakeboard.width - 20);
    manage.food.y = snake.getFood(0, snakeboard.height - 20);

    snake1.forEach(function has_snake_eaten_food(part) {
            const has_eaten = part.x == manage.food.x && part.y == manage.food.y;
            if(has_eaten) generate_food();
    });
}
