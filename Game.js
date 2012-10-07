/*
 * Constructs a new Game
 */
SI.Game = function() {
	// canvas context
	this.xpainter;
	// current pressed key
	this.currentKey;
	// rockets on the game grid
	this.rockets;
	// player ship
	this.playerShip;
	// enemy ships
	this.enemyShips;
	// clearance to fire again
	this.okToFire;
}
/*
 * Starts the game
 * Intializes the canvas and draws the board
 */
SI.Game.prototype.start = function () {
	this.initializeCanvas();
	this.initializeGame();
	this.drawAllElements();
}

/*
 * Changes permission to launch rockets
 */
SI.Game.prototype.lockRocketLauncher = function () {
	this.okToFire = false;
}
SI.Game.prototype.freeRocketLauncher = function () {
	this.okToFire = true;
}

/*
 * Deletes Rockets that have exploded
 */
SI.Game.prototype.deleteExplodedRockets = function () {
	var aliveRockets = [];
	for (var i = 0; i < this.rockets.length; i += 1) {
		if(!this.rockets[i].exploded) {
			aliveRockets.push(this.rockets[i]);
		}
	}
	this.rockets = aliveRockets;
}

SI.Game.prototype.createEnemyShips = function (rows, coulmns) {
	var enemyShipsData = {};
	enemyShipsData.ships = [];
	enemyShipsData.directions = [];
	var xPos;
	var yPos = SI.Sizes.topMargin;
	for(var i = 0; i < rows; i += 1) {
		var row = [];
		xPos = SI.Sizes.leftMargin;
		for(var j = 0; j < coulmns; j += 1) {
				row.push(new SI.SpaceShip(xPos, yPos,
							SI.Sizes.enemyWidth,
							SI.Sizes.enemyHeight));
				xPos += SI.Sizes.enemyWidth + SI.Sizes.enemySpacing;
		}
		yPos += SI.Sizes.enemyHeight + SI.Sizes.enemySpacing;
		enemyShipsData.ships.push(row);
		enemyShipsData.directions.push(SI.Directions.Right);
	}
	return enemyShipsData;
}

/*
 * Moves all the moveable elements in the game
 * Player's ship, enemy ships and rockets
 */
SI.Game.prototype.moveAllElements = function () {
	this.movePlayerShip();
	this.moveEnemyShips();
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].move(SI.Sizes.rocketStep);
	}
}

/*
 * Moves the player if a key is currently press(left or right)
 */
SI.Game.prototype.movePlayerShip = function () {
	if(this.currentKey == SI.Keys.Right) {
		this.playerShip.move(SI.Sizes.playerStep, 0);
	}
	else if(this.currentKey == SI.Keys.Left) {
		this.playerShip.move(-SI.Sizes.playerStep, 0);
	}
}

SI.Game.prototype.moveEnemyShips = function () {
	for (var i = 0; i < this.enemyShips.ships.length; i += 1) {
		if(this.enemyShips.ships[i][0].x <= SI.Sizes.leftMargin) {
			this.enemyShips.directions[i] = SI.Directions.Right;
		}
		else if(this.enemyShips.ships[i][this.enemyShips.ships[i].length - 1].x + this.enemyShips.ships[i][0].width >= SI.Sizes.rightMargin) {
			this.enemyShips.directions[i] = SI.Directions.Left;
		}
		for (var j = 0; j < this.enemyShips.ships[i].length; j += 1) {
			this.enemyShips.ships[i][j].move(this.enemyShips.directions[i] * SI.Sizes.enemyStep, 0);
		}
	}
}
/*
 *	Intializes the canvas element
 *	Sets up height and width and context(painter)
 *	Sets up events for keyDown and keyUp
 */
SI.Game.prototype.initializeCanvas = function () {
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

SI.Game.prototype.initializeGame = function () {
	this.playerShip = new SI.SpaceShip(SI.Sizes.width / 2 - SI.Sizes.playerShipWidth / 2,
			SI.Sizes.height - 2*SI.Sizes.playerShipHeight,
			SI.Sizes.playerShipWidth,
			SI.Sizes.playerShipHeight);
	this.rockets = [];

	this.enemyShips = this.createEnemyShips(SI.Sizes.enemyInRow, SI.Sizes.enemyInColumn);
	// clearance to fire again
	this.okToFire = true;
}

/*
 * Chnage the current key pressed
 */
SI.Game.prototype.onKeyDown = function (e) {
	this.currentKey = e.which;
	if(this.currentKey == SI.Keys.Up && this.okToFire &&
			this.rockets.length < SI.Sizes.maxRockets) {
		this.lockRocketLauncher();
		this.rockets.push(new SI.Rocket(this.playerShip.x + this.playerShip.width / 2,
					this.playerShip.y, SI.Directions.Up));
	}
}
SI.Game.prototype.onKeyUp = function (e) {
	this.currentKey = 0;
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
	this.xpainter.lineWidth = SI.Sizes.lineWidth;
	this.xpainter.fillStyle = SI.Colors.player;
	this.playerShip.draw(this.xpainter);
	this.xpainter.fillStyle = SI.Colors.enemy;
	for (var i = 0; i < this.enemyShips.ships.length; i += 1) {
		for (var j = 0; j < this.enemyShips.ships[i].length; j += 1) {
			this.enemyShips.ships[i][j].draw(this.xpainter);
		}
	}
	this.xpainter.strokeStyle = SI.Colors.rocket;
	this.xpainter.lineWidth = SI.Sizes.rocketWidth;
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].draw(this.xpainter);
	}
}

/*
 * Sizes for drawing
 */
SI.Sizes = {
	height:	900,
	width:	800,

	playerShipWidth: 50,
	playerShipHeight: 20,
	playerStep: 20,

	enemyInRow: 6,
	enemyInColumn: 10,
	enemyWidth: 40,
	enemyHeight: 30,
	enemyStep: 5,
	enemySpacing: 15,

	rocketHeight: 15,
	rocketWidth: 5,
	rocketStep: 20,

	lineWidth: 1,
	maxRockets: 8,
	//miliseconds per frame
	MSPF: 1000 / 24 
}
	SI.Sizes.topMargin = 100,
	SI.Sizes.leftMargin =  30,
	SI.Sizes.bottomMargin =  SI.Sizes.height - 100,
	SI.Sizes.rightMargin = SI.Sizes.width - 30,


SI.Colors = {
	player: "green",
	enemy: "#f30",
	rocket: "#07f",
	background: "black"
}
SI.Directions = {
	Down: 1,
	Up: -1,
	
	Right: 1,
	Left: -1
}

/*
 * Events key codes
 */
SI.Keys = {
	Left: 37,
	Right: 39,
	Up: 38
}

