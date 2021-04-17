var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var dy = 1;
var dx = 10;
var speedY = 2;
var gravity = 0.05;
var wallsUp = [];
var wallsDown = [];
var wallDistance = 100;
var wall_len = 0;
var background = [
      "#a5deec"
    , "#89d4e7"
    , "#4bc8e7"
    , "#29badf"
    , "#07b2dd"
    , "#0590b3"
    , "#004c5f"
    , "#012247"
    , "#011a38"
    , "#010f20"
    , "#040d18"
    , "#01050a"
    , "black"
 ]

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
        gravity = -1.5
    }    
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        gravity = 0.9
    }   
}

function Ball(x, y, r, color){
    this.y = y;
    this.x = x;
    this.r = r;
    this.color = color;
}

Ball.prototype.draw = function(){
    var img = document.getElementById("flappyMonster");
    ctx.beginPath()
    ctx.fillStyle = this.color;
    //ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.drawImage(img, this.x-48, this.y-35);
    ctx.fill();
    ctx.closePath()
}

function Wall(posX, posY, x, y, color){
    this.posY = posY;
    this.posX = posX;
    this.x = x;
    this.y = y;
    this.color = color;
}

Wall.prototype.draw = function(){
    var grd = ctx.createLinearGradient(this.posX-50, this.posY, this.x, this.y)

    grd.addColorStop(0,"#0b5302");
    grd.addColorStop(1,"#17b103");

    ctx.beginPath()
    ctx.fillStyle = grd;
    ctx.rect(this.posX, this.posY, this.x, this.y)
    ctx.fill();
    ctx.closePath()
} 

var ball = new Ball(220,200,30,"white")  
var wall = new Wall(800,0,80,150,"Green")
var wall_ = new Wall(800,380,80,600,"Green")
 wallsUp.push(wall)
 wallsDown.push(wall_)

const randLength = () => {
    return Math.floor(Math.random()*250) + 50
}

const update = () => {
    gameOver(wallsUp, wallsDown)

    if(wallsUp.length>8){
        wallsUp = wallsUp.slice(2,wallsUp.length)
        wallsDown = wallsDown.slice(2,wallsDown.length)
    }
  
    if(wallsUp[wallsUp.length-1].posX % 600 == 0){
        var randnum = randLength();
        var newWall_up = new Wall(canvas.width,0,80,randnum,"Green")
        var newWall_down = new Wall(canvas.width,randnum+randLength()+50,80,canvas.height-50-randnum,"Green")
        wallsUp.push(newWall_up)
        wallsDown.push(newWall_down)
        wall_len++
        
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ball.draw()  
    motionY() 

    for(var i = 0; i<wallsUp.length; i++){
        wallsUp[i].posX-=dx;
        wallsUp[i].draw()
        wallsDown[i].posX-=dx;
        wallsDown[i].draw()
    }
 
    document.getElementById('canvas').style.backgroundColor = background[wall_len % 13]
    dispScore(wall_len)
}

const motionY = () => {
    ball.y+=dy+speedY;
    speedY+=gravity
}

const gameOver = (wallsUp,wallsDown) => {
    if(ball.y>canvas.height-ball.r || ball.y-ball.r<0){
        clearInterval(start)
        location.reload();  
    }
    for(var i = 0; i<wallsUp.length; i++){
       
        if(ball.x + ball.r >= wallsUp[i].posX && ball.x + ball.r<= wallsUp[i].posX + wallsUp[i].x + ball.r
        && ball.y - ball.r < wallsUp[i].y 
        || ball.x + ball.r >= wallsDown[i].posX && ball.x + ball.r <= wallsDown[i].posX + wallsDown[i].x + ball.r
        && ball.y + ball.r > wallsDown[i].posY
            ){
                clearInterval(start)
                location.reload();
        }
    }
}

const dispScore = (score) => {
    score = score-1;
    if(score<0) score = 0;
    ctx.fillStyle = "White"   
    ctx.font = "40px Arial";  
    ctx.fillText(`score : ${score}`, 720, 50);
}

 var start = setInterval(update, 30)


