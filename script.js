


const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillStyle = '#000000';
context.fillRect(0,0,canvas.width,canvas.height)

const KEY_UP = 38;
const KEY_DOWN = 40;

const keyPressed =[];


window.addEventListener('keydown',function(e){
    keyPressed[e.keyCode] = true;
})

window.addEventListener('keyup',function(e){
    keyPressed[e.keyCode] = false;
})

// 40 down
// 38 up
function  ballPadlleCollision(ball,paddle)
{
    let halfPaddleWidth = (paddle.width / 2);
    let halfPaddleHeight = (paddle.height / 2);
    let dx =  Math.abs(ball.pos.x - (paddle.pos.x + halfPaddleWidth) );;
    let dy = Math.abs(ball.pos.y - (paddle.pos.y + halfPaddleHeight) );



    if(dx <= halfPaddleWidth + ball.radius && dy <= ( halfPaddleHeight +  ball.radius))
    {
        ball.velocity.x *= -1;
    }
}
function paddlesCollisionWIthEdges(paddle)
{
    if(paddle.pos.y <= 0)
    {
        paddle.pos.y = 0;
    }
    if(paddle.pos.y + paddle.height >= canvas.height)
    {
        paddle.pos.y = canvas.height - paddle.height;
    }
}
function ballCollisionWidthTheEdges(ball)
{
    if(ball.pos.y + ball.radius >= canvas.height)
    {
        ball.velocity.y *=-1;
    }
    if(ball.pos.y - ball.radius <= 0)
    {
        ball.velocity.y*=-1;
    }
 
}

function respawnBall(ball)
{
    if(ball.velocity.x >0)
    {
        ball.pos.x = canvas.width - 150;
        ball.pos.y = (Math.random() *(canvas.height - 200) +100);
    }

    if(ball.velocity.x < 0)
    {
        ball.pos.x = 150;
        ball.pos.y = (Math.random() *(canvas.height - 200) +100);
    }
    ball.velocity.x *= -1;
    ball.velocity.y *= -1;

}
function increaseScore(ball ,paddle1,paddle2)
{
    if(ball.pos.x <= -ball.radius)
    {
        paddle2.score+=1;
        document.getElementById('player2Score').innerHTML = paddle2.score;
    respawnBall(ball);

    }
    if(ball.pos.x >= canvas.width +ball.radius)
    {
        paddle1.score +=1;
        document.getElementById('player1Score').innerHTML = paddle1.score;
        respawnBall(ball);
    }
}
const ball = new  Ball(vec2(200,200),vec2(5,5),20)
const paddle1 =  new paddles(vec2(2,50),vec2(6,6),20,160);
const paddle2 =  new paddles(vec2(canvas.width - 20,30),vec2(6,6),20,160);

function vec2(x,y)
{

    return {x: x ,y: y};
}

function drawGameScene()
{
    context.strokeStyle = "#34495E";
    context.beginPath();
    context.lineWidth = 20;
    context.moveTo(0,0);
    context.lineTo(canvas.width,0);
    context.stroke();

    context.beginPath();
    context.lineWidth = 20;
    context.moveTo(0,canvas.height);
    context.lineTo(canvas.width,canvas.height);
    context.stroke();

    context.beginPath();
    context.lineWidth = 20;
    context.moveTo(0,0);
    context.lineTo(0,canvas.height);
    context.stroke();

    context.beginPath();
    context.lineWidth = 20;
    context.moveTo(canvas.width,0);
    context.lineTo(canvas.width,canvas.height);
    context.stroke();


    context.strokeStyle = "#ECF0F1";
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(canvas.width / 2,0);
    context.lineTo(canvas.width / 2,canvas.height);
    context.stroke();

    // context.strokeStyle = "#34495E";
    context.beginPath();
    context.arc(canvas.width / 2 , canvas.height / 2, 50,0,Math.PI *2)
    context.stroke();
}
function Ball(pos,velocity,radius)
{
    this.pos = pos;
    this.velocity = velocity;
    this.radius = radius;
    this.update = function(){
        this.pos.x  += this.velocity.x;
        this.pos.y  += this.velocity.y;

    };
    this.draw = function()
    {
        context.fillStyle = '#F39C12';
        context.strokeStyle = '#F39C12';
        context.beginPath();
        context.arc(this.pos.x,this.pos.y,radius,0,Math.PI *2)
        context.fill();
        context.stroke()
    };
}
function player2AI(ball,paddle)
{
    if(ball.velocity.x > 0)
    {
        if(ball.pos.y > paddle.pos.y)
        {
            paddle.pos.y += paddle.velocity.y;
            if(paddle.pos.y + paddle.height >= canvas.height)
            {
                paddle.pos.y = canvas.height- paddle.height;
            }

        }
        if(ball.pos.y < paddle.pos.y)
        {
            paddle.pos.y -=paddle.velocity.y;
            if(paddle.pos.y <=0)
            {
                paddle.pos.y = 0;
            }
        }
    }
}
function paddles(pos,velocity,width,height)
{
    this.pos = pos;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.update = function (){
        if(keyPressed[KEY_UP]){
            this.pos.y -=this.velocity.y;
        }
        if(keyPressed[KEY_DOWN])
        {
            this.pos.y += this.velocity.y;
        }
    };

    this.draw = function(){
        context.fillStyle = "#E74C3C";
        context.fillRect(this.pos.x,this.pos.y,this.width,this.height);

    }
   

}
function gameUpdate()
{
    ball.update();
    paddle1.update();
    paddlesCollisionWIthEdges(paddle1);
    ballCollisionWidthTheEdges(ball);
    player2AI(ball,paddle2);

    ballPadlleCollision(ball,paddle2);
    ballPadlleCollision(ball,paddle1);
    increaseScore(ball,paddle1,paddle2)

}

function gameDraw()
{
    ball.draw();
    paddle1.draw();
    paddle2.draw();
}

function gameLoop()
{
    context.fillStyle = "#2C3E50";
    context.fillRect(0,0,canvas.width,canvas.height);
    window.requestAnimationFrame(gameLoop);

    gameUpdate()
    gameDraw();
    drawGameScene();
}


gameLoop();
