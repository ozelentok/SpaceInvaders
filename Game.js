/*
 * Constructs a new Game
 */
SI.Game = function() {
	// canvas context
	this.xpainter;
	// current pressed key
	this.currentKey;
	// rockets on the game grid
	this.rockets = [];
	// player ship
	this.playerShip = new SI.SpaceShip(SI.Sizes.width / 2, SI.Sizes.height - 2*SI.Sizes.playerShipRad, SI.Sizes.playerShipRad);
	// enemy ships
	this.enemyShips = [];
	// clearance to fire again
	this.okToFire = true;
}
/*
 * Starts the game
 * Intializes the canvas and draws the board
 */
SI.Game.prototype.start = function() {
	this.initializeCanvas();
	this.drawAllElements();
}
/*
 * Chnage the current key pressed
 */
SI.Game.prototype.onKeyDown = function(e) {
	this.currentKey = e.which;
	if(this.currentKey == SI.Keys.Up && this.okToFire && this.rockets.length < SI.Sizes.maxRockets) {
		this.lockRocketLauncher();
		this.rockets.push(new SI.Rocket(this.playerShip.x, this.playerShip.y, SI.Directions.Up));
	}
}
SI.Game.prototype.onKeyUp = function(e) {
	this.currentKey = 0;
}

/*
 * Changes permission to launch rockets
 */
SI.Game.prototype.lockRocketLauncher = function() {
	this.okToFire = false;
}
SI.Game.prototype.freeRocketLauncher = function() {
	this.okToFire = true;
}

/*
 * Deletes Rockets that have exploded
 */
SI.Game.prototype.deleteExplodedRockets = function() {
	var i = 0;
	while (i < this.rockets.length && this.rockets[i].exploded) {
		this.rockets.shift();
	}
}

/*
 *	Intializes the canvas element
 *	Sets up height and width and context(painter)
 *	Sets up events for keyDown and keyUp
 */
SI.Game.prototype.initializeCanvas = function() {
	var self = this;
	var $canvas = $('#gameview');
	this.xpainter = $canvas[0].getContext('2d');
	this.xpainter.canvas.height = SI.Sizes.height;
	this.xpainter.canvas.width = SI.Sizes.width;
	$(document).keydown(function (e) {
			self.onKeyDown(e);
	});
	$(document).keyup(function (e) {
		self.onKeyUp(e);
	});
	setInterval(function () {
		self.moveAllElements();
		self.deleteExplodedRockets();
		self.drawAllElements();
		self.freeRocketLauncher();
	}, SI.Sizes.MSPF);
}
/*
 * Draws the game grid
 */
SI.Game.prototype.drawGrid = function () {
	this.xpainter.fillStyle = SI.Colors.background;
	this.xpainter.fillRect(0, 0, SI.Sizes.width, SI.Sizes.height);
}
/*
 * Draws all the elements in the game
 * Game grid, player ship, and enemy ships and rockets
 */
SI.Game.prototype.drawAllElements = function () {
	this.drawGrid();
	this.xpainter.fillStyle = SI.Colors.player;
	this.xpainter.lineWidth = SI.Sizes.lineWidth;
	this.playerShip.draw(this.xpainter);
	this.xpainter.strokeStyle = SI.Colors.rocket;
	this.xpainter.lineWidth = SI.Sizes.rocketWidth;
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].draw(this.xpainter);
	}
}
/*
 * moves all the moveable elements in the game
 * Player's ship, enemy ships and rockets
 */
SI.Game.prototype.moveAllElements = function () {
	this.movePlayerShip();
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].move(SI.Sizes.rocketStep);
	}
}
SI.Game.prototype.movePlayerShip = function () {
	if(this.currentKey == SI.Keys.Right) {
		this.playerShip.move(SI.Sizes.playerStep, 0);
	}
	else if(this.currentKey == SI.Keys.Left) {
		this.playerShip.move(-SI.Sizes.playerStep, 0);
	}
}

/*
 * Sizes for drawing
 */
SI.Sizes = {
	height:	800,
	width:	1000,
	playerShipRad: 25,
	playerStep: 10,
	enemyShipRad: 10,
	rocketHeight: 15,
	rocketWidth: 5,
	rocketStep: 25,
	lineWidth: 1,
	maxRockets: 4,
	//miliseconds per frame
	MSPF: 1000 / 25 
}
SI.Colors = {
	player: "blue",
	enemy: "red",
	rocket: "white",
	background: "black"
}
SI.Directions = {
	Down: 1,
	Up: -1,
}

/*
 * Events key codes
 */
SI.Keys = {
	Left: 37,
	Right: 39,
	Up: 38
}

