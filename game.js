var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0,0%,0%,0.5)";
ctxHUD.font = "bold 20px Arial";


var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;


var jet1 = new Jet();
var enemies = [];

var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						window.oRequestAnimationFrame;

var bgDrawX1 = 0;
var bgDrawX2 = 1600;


var imgSprite = new Image();
imgSprite.src = "images/sprite.png";
imgSprite.addEventListener('load',init,false);


function init () {
	spawnEnemy(5);
	playGame();
}

function playGame () {
	startLoop();
	drawBg();
	document.addEventListener('keydown',keyPressed,false);
	document.addEventListener('keyup',keyReleased,false);
}

function startLoop () {
	isPlaying = true;
	loop();
}

function loop () {
	if(isPlaying){
		jet1.draw();
		moveBg();

		drawAllEnemies();
		requestAnimFrame(loop);
	}	
}


function moveBg () {
	bgDrawX1 -= 5;
	bgDrawX2 -= 5;

	if(bgDrawX1 <= -1600){
		bgDrawX1 = 1600;
	}
	if(bgDrawX2 <= -1600){
		bgDrawX2 = 1600;
	}
	drawBg();

}

function drawBg () {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
	ctxBg.drawImage(imgSprite,0,0,1600,gameHeight,bgDrawX1,0,1600,gameHeight + 10);
	ctxBg.drawImage(imgSprite,0,0,1600,gameHeight,bgDrawX2,0,1600,gameHeight + 10);
}

function spawnEnemy (number) {
	for (var i = 0; i < number; i++) {
		enemies[enemies.length] = new Enemy();
	};
}

function drawAllEnemies () {
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
	};
}






function Jet () {
	this.srcX = 0;
	this.srcY = 500;
	this.drawX = 220;
	this.drawY = 100;
	this.width = 100;
	this.height = 40;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isRightKey = false;
	this.isLeftKey = false;
	this.isSpacebar = false;
	this.noseX = 100;
	this.noseY = 100;
	this.isShooting = false;
	this.speed = 2;
	this.bullets = [];
	this.currentBullet = 0;
	for (var i = 0; i < 25; i++) {
		 this.bullets[this.bullets.length] = new Bullet();
	};
}
Jet.prototype.draw = function() {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
	this.checkDirection();
	this.checkShooting();
	this.drawAllBullets();
	ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};
Jet.prototype.checkDirection = function() {
	if(this.isUpKey){
		this.drawY -= this.speed;
	}
	if(this.isDownKey){
		this.drawY += this.speed;
	}
	if(this.isLeftKey){
		this.drawX -= this.speed;
	}
	if(this.isRightKey){
		this.drawX += this.speed;
	}
};
Jet.prototype.checkShooting = function() {
	if (this.isSpacebar && !this.isShooting) {
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.noseX,this.noseY);
		this.currentBullet++;
		if(currentBullet >= this.bullets.length){
			this.currentBullet = 0;
		}
	} else if (!this.isSpacebar) {
		this.isShooting = false;
	}

};
Jet.prototype.drawAllBullets = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		if(this.bullets[i].drawX >= 0){
			this.bullets[i].draw();
		}
	}	
}






function Bullet () {
	this.srcX = 100;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 5;
	this.height = 5;
	this.speed = 3;
}

Bullet.prototype.draw = function() {
	this.drawX += this.speed;
	ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height ,this.drawX,this.drawY,this.width,this.height);
};
Bullet.prototype.fire = function(startX, startY) {
	this.drawX = startX;
	this.drawY = startY;
};






function Enemy () {
	this.srcX = 0;
	this.srcY = 540;
	this.drawX = Math.random() * 800 + 800;
	this.drawY = Math.random() * 360;
	this.width = 100;
	this.height = 39;
	this.speed = 2;
}
Enemy.prototype.draw = function() {
	this.drawX -= this.speed;
	ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height ,this.drawX,this.drawY,this.width,this.height);
};








function keyPressed (e) {
	var keyCode = e.keyCode || e.which;

	if(keyCode == 32){
		jet1.isSpacebar = true;
		e.preventDefault();
	}
	if(keyCode == 38 || keyCode == 87){
		jet1.isUpKey = true;
		e.preventDefault();
	}
	if(keyCode == 39 || keyCode == 68){
		jet1.isRightKey = true;
		e.preventDefault();
	}
	if(keyCode == 37 || keyCode == 65){
		jet1.isLeftKey = true;
		e.preventDefault();
	}
	if(keyCode == 40 || keyCode == 83){
		jet1.isDownKey = true;
		e.preventDefault();
	}
}

function keyReleased (e) {
	var keyCode = e.keyCode || e.which;
	if(keyCode == 32){
		jet1.isSpacebar = false;
		e.preventDefault();
	}
	if(keyCode == 38 || keyCode == 87){
		jet1.isUpKey = false;
		e.preventDefault();
	}
	if(keyCode == 39 || keyCode == 68){
		jet1.isRightKey = false;
		e.preventDefault();
	}
	if(keyCode == 37 || keyCode == 65){
		jet1.isLeftKey = false;
		e.preventDefault();false
	}
	if(keyCode == 40 || keyCode == 83){
		jet1.isDownKey = false;
		e.preventDefault();
	}
}




