/*
* Title : JET STORM - The Video Game
* By: Abhi Upadhyay - 12 years old
* Date: 12/7/2013
*/

//--------------------VARIABLES--------------------//
var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0,0%,0%,0.5)"
ctxHUD.font = "bold 20px Arial";
var canvasLose = document.getElementById('canvasLose');
var ctxLose = canvasLose.getContext('2d');
ctxLose.fillStyle = "hsla(0,0%,0%,0.5)"
ctxLose.font = "bold 32px Arial";

var enemiesGone = 0;

var mouseX = 0;
var mouseY = 0;
var btnPlay = new Button(0,gameWidth,0,gameHeight);

//music variables
var gameMusic = document.getElementById("gameMusic");
var laserEffect = document.getElementById("laserEffect");


var isPlaying = false;
var gameEvent = '';

var bgDrawX1 = 0;
var bgDrawX2 = 1600;

var jet1 = new Jet();
var enemies = [];


var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;

var requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.oRequestAnimationFrame;

var imgSprite = new Image();
imgSprite.src = "images/sprite.png";
imgSprite.addEventListener("load",init,false);
//--------------------END OF VARIABLES--------------------//













//--------------------MAIN FUNCTIONS--------------------//
function init () {
	spawnEnemy(7);
	drawMenu();

	document.addEventListener("mousedown",mouseClicked,false);
}

function playGame () {
	startLoop();
	drawBg();
	updateHUD();
	document.addEventListener('keydown',keyPressed,false);
	document.addEventListener('keyup',keyReleased,false);
}

function startLoop () {
	isPlaying = true;
	loop();
}

function stopLoop () {
	isPlaying = false;
}

function drawMenu () {
	//gameMusic.play();
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,0,580,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}


function loop () {
	if (isPlaying) {
		jet1.draw();
		moveBg();
		drawAllEnemies();

		if(enemiesGone == 5){
			loseGame();
		}

		requestAnimFrame(loop);
	};
}

function drawBg () {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,0,0,1600,gameHeight,bgDrawX1,0,1600,gameHeight + 10);
	ctxBg.drawImage(imgSprite,0,0,1600,gameHeight,bgDrawX2,0,1600,gameHeight + 10);
}

function moveBg () {
	bgDrawX1 -= 5;
	bgDrawX2 -= 5;
	if (bgDrawX1 <= -1600) {
		bgDrawX1 = 1600;
	}
	else if (bgDrawX2 <= -1600) {
		bgDrawX2 = 1600;
	}


	drawBg();
}

function spawnEnemy (number) {
	for (var i = 0; i < number; i++) {
		enemies[i] = new Enemy();
	};
}

function drawAllEnemies () {
	clearCtxEnemy();
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
	};
}

function clearCtxEnemy () {
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

function updateHUD () {
	ctxHUD.clearRect(0,0,gameWidth,gameHeight)
	ctxHUD.fillText("Enemies Gone:  " + enemiesGone ,500,20)
	ctxHUD.fillText("Score: " + jet1.score,680,20);
}

function loseGame () {
	stopLoop();
	ctxLose.clearRect(0,0,gameWidth,gameHeight);
	ctxLose.fillText("YOU LOSE! Try Again!", gameWidth/2 - 160, gameHeight/2 - 100);
	ctxLose.fillText("Press 'R' to restart the game.", gameWidth/2 - 200, gameHeight/2 - 50);
	ctxLose.fillText("Score:  " + jet1.score, gameWidth/2 - 75, gameHeight/2);
	gameEvent = 'lose';
}

function resetVar () {
	jet1.score = 0;
	jet1.drawX = 220;
	jet1.drawY = gameHeight/2 - jet1.height;
	enemies =[];
	enemiesGone = 0;
	isPlaying = false;
	gameEvent = '';
	bgDrawX1 = 0;
	bgDrawX2 = 1600;
	clearAllCanvas();
	init();
}

function clearAllCanvas () {
	clearCtxEnemy();
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
	ctxHUD.clearRect(0,0,gameWidth,gameHeight);
}
//--------------------END OF MAIN FUNCTIONS--------------------//





















//--------------------JET FUNCTIONS--------------------//

function Jet () {
	this.srcX = 0;
	this.srcY = 500;
	this.width = 100;
	this.height = 40;
	this.drawX = 200;
	this.drawY = 210;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
	this.isSpacebar = false;
	this.isShooting = false;
	this.noseX = this.drawX + this.width;
	this.noseY = this.drawY + this.height/2;
	this.bullets = [];
	for (var i = 0; i < 25; i++) {
		this.bullets[i] = new Bullet();
	};

	this.hitEnemy = false;
	this.currentBullet = 0;
	this.speed = 2;
	this.score = 0;

}
Jet.prototype.draw = function() {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
	this.checkDirection();
	this.updateCoors();
	this.checkShooting();
	this.drawAllBullets();
	ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
}

Jet.prototype.updateCoors = function() {
	this.noseX = this.drawX + this.width;
	this.noseY = this.drawY + this.height/2;
};

Jet.prototype.checkDirection = function() {
	if(this.isUpKey && this.drawY > 0){
		this.drawY -= this.speed;
	}
	if(this.isDownKey && this.drawY + this.height < gameHeight){
		this.drawY += this.speed;
	}
	if(this.isRightKey && this.drawX + this.width < gameWidth){
		this.drawX += this.speed;
	}
	if(this.isLeftKey && this.drawX > 0){
		this.drawX -= this.speed;
	}
};


Jet.prototype.checkShooting = function() {
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.noseX,this.noseY);
		this.currentBullet++;
		if(this.currentBullet >= this.bullets.length){
			this.currentBullet = 0;
		}
	}
	else if(!this.isSpacebar){
		this.isShooting = false;
	}
};
Jet.prototype.drawAllBullets = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].draw();
		if(this.bullets[i].explosion.hasHit){
			this.score += 5;
			updateHUD();
			this.bullets[i].explosion.draw();
		}
	};
};

//--------------------END OF JET FUNCTIONS--------------------//










//--------------------ENEMY FUNCTIONS--------------------//
function Enemy () {
	this.srcX = 0;
	this.srcY = 540;
	this.drawX = Math.floor(Math.random() * 1000) + 800;
	this.drawY =  Math.floor(Math.random() * 360);
	this.width = 100;
	this.height = 40;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
	this.speed = 2;
}

Enemy.prototype.draw = function() {
	this.drawX -= this.speed;
	this.checkEscaped();
	ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Enemy.prototype.checkEscaped = function() {
	if(this.drawX <= -100){
		this.recycle();;
		enemiesGone ++;
		updateHUD();
	}
};

Enemy.prototype.recycle = function() {
	this.drawX = Math.floor(Math.random() * 1000) + 800;
	this.drawY = Math.floor(Math.random() * 360);
};
//--------------------END OF ENEMY FUNCTIONS--------------------//












//--------------------BULLET FUNCTIONS--------------------//

function Bullet () {
	this.srcX = 100;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY =  0;
	this.width = 5;
	this.height = 5;
	this.speed = 3;

	this.explosion = new Explosion();
}

Bullet.prototype.draw = function() {
	if(this.drawX > 0){
		this.drawX += this.speed;
		this.checkHitEnemy();
		this.checkEscaped();
		ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	}
};

Bullet.prototype.fire = function(startX,startY) {
	laserEffect.play();
	this.drawX = startX;
	this.drawY = startY;
};

Bullet.prototype.checkEscaped = function() {
	if(this.drawX >= gameWidth){
		this.recycle();
	}
};

Bullet.prototype.checkHitEnemy = function() {
	for (var i = 0; i < enemies.length; i++) {
		if(this.drawX >= enemies[i].drawX &&
			this.drawX <= enemies[i].drawX + enemies[i].width &&
			this.drawY + this.height <= enemies[i].drawY + enemies[i].height && 
			this.drawY >= enemies[i].drawY){
			
			this.explosion.drawX = enemies[i].drawX - (this.explosion.width/2);
			this.explosion.drawY = enemies[i].drawY;
			this.explosion.hasHit = true;
			jet1.score -= 10;
			updateHUD();
			this.recycle();
			enemies[i].recycle();

		}
	};

};


Bullet.prototype.recycle = function() {
	this.drawX = -20;
	this.drawY = 0;
};

//--------------------END OF BULLET FUNCTIONS--------------------//










//--------------------EXPLOSION FUNCTIONS--------------------//
function Explosion () {
	this.srcX = 750;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY =  0;
	this.width = 50;
	this.height = 50;
	this.totalFrames = 10;
	this.currentFrame = 0;
	this.hasHit = false;
}

Explosion.prototype.draw = function() {
	if(this.currentFrame <= this.totalFrames){
		ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.currentFrame++;
	}
	else {
		this.hasHit = false;
		currentFrame = 0;
	}

};
//--------------------END OF EXPLOSION FUNCTIONS--------------------//











//--------------------BUTTON FUNCTIONS--------------------//
function Button (xL, xR, yT, yB) {
	this.xLeft = xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
}

Button.prototype.checkClicked = function() {
	if(mouseY > this.yTop &&
		mouseY < 500 &&
		mouseX < 800 &&
		mouseX > this.xLeft){
		return true;r
	}
};

//--------------------END OF BUTTON FUNCTIONS--------------------//











//--------------------EVENT FUNCTIONS--------------------//

function keyPressed (e) {
	var keyCode = e.keyCode;

	if(keyCode == 32){ // spacebar key
		jet1.isSpacebar = true;
		e.preventDefault();
	}
	if(keyCode == 38 || keyCode == 87){ //up arrow and w keys
		jet1.isUpKey = true;
		e.preventDefault();

	}
	if(keyCode == 40 || keyCode == 83){ //down arrow and s keys
		jet1.isDownKey = true;
		e.preventDefault();
	}
	if(keyCode == 39 || keyCode == 68){ //right arrow and d keys
		jet1.isRightKey = true;
		e.preventDefault();
	}
	if(keyCode == 37 || keyCode == 65){ //left arrow and a keys
		jet1.isLeftKey = true;
		e.preventDefault();
	}
	if(keyCode == 82){ // r key for Restarting
		if(gameEvent == 'lose'){
			gameEvent = '';
			ctxLose.clearRect(0,0,gameWidth,gameHeight);
			resetVar();
		}
	}

}

function keyReleased (e) {
	var keyCode = e.keyCode;

	if(keyCode == 32){ //spacebar key
		jet1.isSpacebar = false;
		e.preventDefault();
	}
	if(keyCode == 38 || keyCode == 87){ //up arrow and w keys
		jet1.isUpKey = false;
		e.preventDefault();

	}
	if(keyCode == 40 || keyCode == 83){ //down arrow and s keys
		jet1.isDownKey = false;
		e.preventDefault();
	}
	if(keyCode == 39 || keyCode == 68){ //right arrow and d keys
		jet1.isRightKey = false;
		e.preventDefault();
	}
	if(keyCode == 37 || keyCode == 65){ //left arrow and a keys
		jet1.isLeftKey = false;
		e.preventDefault();
	}

}


function mouseClicked (e) {
	mouseX = e.pageX - canvasBg.offsetLeft;
	mouseY = e.pageY - canvasBg.offsetTop;

	if(btnPlay.checkClicked()){
		playGame();

		document.removeEventListener('mousedown',mouseClicked,false);
	}
}

//-------------------- END OF EVENT FUNCTIONS--------------------//
