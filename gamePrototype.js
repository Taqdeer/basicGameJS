let ctx = document.getElementById("canvas").getContext("2d");
let first, levelArray=[[50, 450],[200, 400],[300,300],[400,170],[500,200],[700,150],[600, 100], [600,0]];
let birdArray=[], bulletArray=[];
let destinationReached = false;
let destination = {x: 600, y: 0};
let jump, win, shootSound; //audios
let shoot= false;
let enableUp= true, enableLeft= true, enableRight = true;
let collisionLeft = false, collisionRight = false, collisionUp = false, collisionDown = false;
setup();
function setup(){
   // level(5);  
   let dir = "left";
    first = new makePlayer(10, 430, "pink");
    jump = new Audio("jump.wav");
    win = new Audio("win.wav");
    shootSound = new Audio("shoot.wav");
    fillBirds(5);
    document.addEventListener("keydown", decidePlayer);
    let game = setInterval(function(){
        drawBackground();
        drawDestination();
        drawLevel();
        moveSlide(levelArray[5], dir);
        first.draw();
        flyBirds();
        shootBullet(first);
        if(destinationReached == true){ 
            finishGame()
            clearInterval(game)   
        };
    }, 10)
    setInterval(function(){
        if(dir == "left") dir = "right"
        else if (dir == "right") dir = "left"
    }, 3000)
}
function finishGame(){
    win.play();
    ctx.fillStyle = "yellow";
    ctx.font = "50px Georgia";
    ctx.fillText("Level Passed", 250, 250);
}
function drawDestination(){
    ctx.fillStyle = "yellow"
    ctx.fillRect(levelArray[levelArray.length-1][0], levelArray[levelArray.length-1][1], 100, 10)
}
function fillBirds(numberOfBirds){
    for(let i=0; i<numberOfBirds; i++){
        let randomNumX = randomizer(800) + 800;
        let randomNumY = randomizer(500)
        let newBird = new makeBird(randomNumX, randomNumY)
        birdArray.push(newBird);
    }
    console.log(birdArray);
}
function fillBullet(obj){
    let mybullet = new makeBullet(obj.x, obj.y+20)
    bulletArray.push(mybullet);
}

function shootBullet(){  
    for(let i=0; i<bulletArray.length; i++){
        bulletArray[i].x++;
    }
    
    drawBullet();
}
function drawBullet(){
    for(let i=0; i<bulletArray.length; i++){
        bulletArray[i].draw();
    }
}
function makeBullet(bulletX, bulletY){
    this.x = bulletX;
    this.y = bulletY;
    this.color = "black"
    this.draw = function(){
        bullet(this.x, this.y, this.color)
    }
}
function bullet(bulletX, bulletY, bulletColor){
    ctx.fillStyle = bulletColor;
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 7, 0, 2*Math.PI);
    ctx.fill();
}
function flyBirds(){
    for(let i=0; i<birdArray.length; i++){
        birdArray[i].x--;
        if(birdArray[i].x == 0){
            birdArray[i].x = randomizer(800) + 800;
            birdArray[i].y = randomizer(500);
        }
    }
    drawBirds();
}
function drawBirds(){
    for(let i=0; i<birdArray.length; i++){
        birdArray[i].draw();
    }
}
function makeBird(birdX, birdY){
    this.x = birdX;
    this.y=  birdY;
    this.length = 50;
    this.color = "red";
    this.draw = function(){
       drawBird(this.x, this.y, this.length, this.color)
    }
}
function drawBird(birdX, birdY, birdLength, birdColor){
    ctx.fillStyle = "red"
    ctx.fillRect(birdX, birdY, birdLength, 2);
    ctx.fillStyle = birdColor;
    //leftFeather
    ctx.beginPath();
    ctx.moveTo(birdX + birdLength/2, birdY);
    ctx.lineTo(birdX + 5, birdY - 10);
    ctx.lineTo(birdX + 7, birdY);
    ctx.fill();
    //rightFeather
    ctx.beginPath();
    ctx.moveTo(birdX + birdLength/2, birdY);
    ctx.lineTo(birdX + birdLength - 5, birdY - 10);
    ctx.lineTo(birdX + birdLength - 7, birdY);
    ctx.fill();
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
    shootBullet(obj)
    if(destinationReached){
        finishGame()  
    }
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
       down(obj);
    }
    else if(event.keyCode == 32){ //space
        shoot = true;
        fillBullet(obj);
        shootSound.play();
    }
}
function up(obj){
    if(!enableUp) return;
    let keepGoingUp = 0;
    jump.play();
    let goingUp = setInterval(function(){
        keepGoingUp++;
        testSlideCollision(obj);
        if(obj.y <= 0 || collisionUp == true){
            obj.y -= 0;
        }
        else obj.y -= 10;
        redraw(obj);
        if(keepGoingUp == 10){
            clearInterval(goingUp);
            down(obj);
            enableUp = true;
        }
        collisionUp = false;
    }, 40)    
}
function down(obj){
    let keepGoingDown = 0;
    let goingDown = setInterval(function(){
        testSlideCollision(obj);
        keepGoingDown++;
        if(obj.y + obj.height >= 500 || collisionDown == true){
            obj.y+=0;
        } 
        else obj.y += 10;
        redraw(obj);
        testSlideCollision(obj);
        if(obj.y + obj.height >= 500 || collisionDown == true){
            clearInterval(goingDown);
        }
        collisionDown = false;
    }, 40) 
}
function testSlideCollision(obj){
    for(let i=0; i<levelArray.length; i++){
        if(obj.x + 10 == levelArray[i][0] && levelArray[i][1] >= (obj.y - 10) && levelArray[i][1] <= (obj.y + obj.height)){
            collisionRight = true;
            if( i == levelArray.length - 1){
                collisionRight = false;
                console.log("destination reached")
                destinationReached = true;
            } 
        }
        if(obj.y + obj.height == levelArray[i][1] && levelArray[i][0] <= (obj.x -10) && (levelArray[i][0] + 100) >= (obj.x+10)){
            collisionDown = true;
            if( i == levelArray.length - 1){
                collisionDown = false;
                console.log("destination reached")
                destinationReached = true;
            } 
        }
        if(obj.x - 10 == (levelArray[i][0] + 100) && (levelArray[i][1]) >= (obj.y - 10) && (levelArray[i][1]) <= (obj.y + obj.height)){
            collisionLeft = true;
            if( i == levelArray.length - 1){
                collisionLeft = false;
                console.log("destination reached")
                destinationReached = true;
            } 
        }
       // console.log(obj.y-10 == levelArray[1][1]);
        if(obj.y-10 == levelArray[i][1] && levelArray[i][0] <= (obj.x-10) && (levelArray[i][0] + 100) >= (obj.x + 10)){
            collisionUp = true;
            if( i == levelArray.length - 1){
                collisionUp = false;
                console.log("destination reached")
                destinationReached = true;
            } 
        }
    }
}
function Collision(obj){
    //console.log(y + 70)
    if(obj.y + 70 >= 500 ){//|| x - 10 <= 0 || x + 10 >= 800 || y - 10 <=0){
        obj.y-=10;
        return true;
    }
    return false;
}
function leftAndRight(obj, dir){
    let keepGoing = 0;
    let going = setInterval(function(){
        keepGoing++;
        if(dir == "left"){
            testSlideCollision(obj);
            if(obj.x-10 <= 0 || collisionLeft == true) obj.x -= 0;
            else obj.x -= 10;
            collisionLeft = false;
        } 
        if(dir == "right"){
            testSlideCollision(obj);
            if(obj.x+10 >= 800 || collisionRight == true) obj.x += 0; 
            else obj.x += 10;
            collisionRight = false;
        }
        redraw(obj);
        if(keepGoing == 5){
            clearInterval(going);
            enableLeft = true;
            enableRight = true;
            down(obj);
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
    //moveSlide(levelArray[movingSlide], moveDirection);
}
function moveSlide(movingSlide, moveDirection){
    if(moveDirection == "left") movingSlide[0]--;
    else movingSlide[0]++;  
    drawSlide(movingSlide[0],movingSlide[1]);
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

