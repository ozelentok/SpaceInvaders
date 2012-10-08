
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
}
/*
 * Creates the player ship and enemy ships
 * Cleans the rocket list and allows firing
 */

SI.Game.prototype.initializeGame = function () {
	this.playerShip = new SI.SpaceShip(SI.Sizes.width / 2 - SI.Sizes.playerShipWidth / 2,
			SI.Sizes.bottomMargin - SI.Sizes.playerShipHeight,
			SI.Sizes.playerShipWidth,
			SI.Sizes.playerShipHeight,
			SI.Images.playerImg);
	this.rockets = [];
	this.enemyShips = this.createEnemyShips(SI.Sizes.enemyInRow, SI.Sizes.enemyInColumn);
	this.detector = new SI.CDetection();
	// clearance to fire again
	this.okToFire = true;

	this.points = 0;

	this.lives = 3;
	var self = this;
	setInterval(function () {	
		self.moveAllElements();
		self.deleteExplodedRockets();
		self.deleteExplodedEnemyShips();
		self.drawAllElements();
		self.freeRocketLauncher();
	}, SI.Sizes.MSPF);

}


/*
 * Creates enemy ships
 * Parameters
 * rows - number of rows of ships
 * coulmns - number of coulmn of ships
 */
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
							SI.Sizes.enemyHeight,
							SI.Images.enemyImg));
				xPos += SI.Sizes.enemyWidth + SI.Sizes.enemySpacing;
		}
		yPos += SI.Sizes.enemyHeight + SI.Sizes.enemySpacing;
		enemyShipsData.ships.push(row);
		enemyShipsData.directions.push(SI.Directions.Right);
	}
	return enemyShipsData;
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

SI.Game.prototype.deleteExplodedEnemyShips = function () {
	var toDelete = this.detector.detect(this.rockets, this.enemyShips.ships);
	for (var i = 0; i < toDelete.length; i += 1) {
		this.enemyShips.ships[toDelete[i].row].splice(toDelete[i].col, 1);
	}
	var i = 0;
	while (i < this.enemyShips.ships.length) {
		if(this.enemyShips.ships[i].length == 0) {
			this.enemyShips.ships.splice(i, 1);
		}
		else {
			i += 1;
		}
	}
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

