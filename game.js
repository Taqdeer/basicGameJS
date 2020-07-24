let ctx = document.getElementById("canvas").getContext("2d");
let first, levelArray=[];
let enableUp= true, enableLeft= true, enableRight = true, collision= false;
setup();
function setup(){
    drawBackground();
    level(5);
    drawLevel();
    first = new makePlayer(50, 300, "pink");
    first.draw();
    document.addEventListener("keydown", decidePlayer);
}
function decidePlayer(event){
    movePlayer(event, first)
}
function makePlayer(playerX, playerY, playerColor){
    this.x = playerX;
    this.y= playerY;
    this.color = playerColor;
    this.height = 70 // height of player is always 70 - calculated from drawPlayer
    this.draw = function (){
        player(this.x, this.y, this.color);
    }      
    // this.move = function(event){
    //    movePlayer(event, this.x, this.y);
    // }
}
function redraw(obj){
    ctx.clearRect(0,0,800,500);
    drawBackground();
    drawLevel();
    obj.draw();
}
function movePlayer(event, obj){
    
    if(event.key == "ArrowLeft"){
        leftAndRight(obj, "left")
        enableLeft = false;
    }
    else if(event.key == "ArrowRight"){
        leftAndRight(obj, "right")
        enableRight = false;
    }
    else if(event.key == "ArrowUp"){
        up(obj);
        enableUp = false;
    }
    else if(event.key == "ArrowDown"){
        obj.y += 10;
        redraw(obj);
    }
}
function up(obj){
   // console.log("in up")
    if(!enableUp) return;
    let keepGoingUp = 0;
    let goingUp = setInterval(function(){
        keepGoingUp++;
        if(Collision(obj.x,obj.y)==true) obj.y -= 0;
        else obj.y -= 10;
        redraw(obj);
        if(keepGoingUp == 10){
            clearInterval(goingUp);
            down(obj);
            enableUp = true;
        }
    }, 40)    
}
function down(obj){
  //  console.log("in Down")
    let keepGoingDown = 0;
    let goingDown = setInterval(function(){
        keepGoingDown++;
        console.log(obj.y+obj.height)
        if(Collision(obj.x,obj.y)==true){
            obj.y += 0;
            collision = false;
        } 
        else obj.y += 10;
        redraw(obj);
        if(keepGoingDown == 10){
            clearInterval(goingDown);
        }
    }, 40) 
}
function Collision(x,y){
    //console.log(y + 70)
    if(y + 70 >= 500 || x - 10 <= 0 || x + 10 >= 800 || y - 10 <=0){
      collision  = true;
    }
    else collision = false;
    return collision;
}
function leftAndRight(obj, dir){
 //   console.log("in Left and Right")
    let keepGoing = 0;
    let going = setInterval(function(){
        keepGoing++;
        if(dir == "left"){
            if(Collision(obj.x,obj.y)==true) obj.x += 0;
            else obj.x -= 10;
        } 
        if(dir == "right"){
            if(Collision(obj.x,obj.y)==true) obj.x += 0;
            else obj.x += 10;
        }
        redraw(obj);
        if(keepGoing == 5){
            clearInterval(going);
            enableLeft = true;
            enableRight = true;
        }
    }, 30) 
   
}
function player(playerX, playerY, playerColor){
    ctx.fillStyle=playerColor;
    ctx.beginPath();
    ctx.arc(playerX,playerY,10, 0, 2* Math.PI);
    ctx.fill();
    ctx.fillStyle="orange";
    ctx.fillRect(playerX-10, playerY+10, 20, 20);
    ctx.fillStyle="green";
    ctx.fillRect(playerX-10, playerY+30, 20, 30);
    ctx.fillStyle="black";
    ctx.fillRect(playerX-10, playerY+60, 20, 10);
}
function level(levelNumber){
    for(let i=1; i<=levelNumber; i++){
        let randomNumX = randomizer(i*200) % 700
        let randomNumY = ((randomizer(i*100) + 100) % 500) 
        levelArray.push([randomNumX, randomNumY]);
    }
 //   console.log(levelArray)
}
function drawLevel(){
    for(let i=0; i<levelArray.length; i++){
        drawSlide(levelArray[i][0],levelArray[i][1]);
    }
}
function drawSlide(slideX, slideY){
    ctx.fillStyle="brown";
    ctx.fillRect(slideX, slideY, 100, 2);
}
function randomizer(range){
    return Math.floor(Math.random() * range);
}
function drawBackground(){
    ctx.fillStyle="skyblue";
    ctx.fillRect(0,0,800,500);
    clouds(200, 200,"white");
    clouds(700, 100,"white");
    clouds(450, 400,"white");
}

function clouds(cloudX, cloudY, cloudColor){
    ctx.fillStyle=cloudColor;
    ctx.beginPath();
    ctx.arc(cloudX,cloudY,30,Math.PI, 2* Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cloudX-50,cloudY,50,Math.PI, 2* Math.PI);
    ctx.fill();
}

