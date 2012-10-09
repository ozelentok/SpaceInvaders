
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
	this.xpainter.font = SI.Sizes.font;
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
	this.rocketsPlayer = [];
	this.rocketsEnemies = [];
	this.enemies = this.createEnemyShips(SI.Sizes.enemyInRow, SI.Sizes.enemyInColumn);
	this.detector = new SI.CDetection();
	// clearance to fire again (for player)
	this.okToFire = true;

	// clearance to fire again (for enemies), if equals SI.Sizes.turnsUntilFire, an enemy fires
	this.turnToFire = 0;
	this.points = 0;
	this.lives = 3;
	this.enemyPhase = 0;
	this.frames = 0;

	var self = this;
	this.clock = setInterval(function () {	
		self.moveAllElements();
		self.deleteExplodedRockets();
		self.deleteExplodedEnemyShips();
		self.checkPlayerStatus();
		self.drawAllElements();
		self.launchEnemyRocket();
		self.freeRocketLauncher();
		self.checkEndGame();
	}, SI.Sizes.MSPF);

}

SI.Game.prototype.checkEndGame = function () {
	if(this.enemies.ships.length == 0) {
		clearInterval(this.clock);
		this.popUpMessage("You Win!");
	}
	else if(this.lives == 0) {
		clearInterval(this.clock);
		this.popUpMessage("You Lost!");
	}
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
	for (var i = 0; i < this.rocketsPlayer.length; i += 1) {
		if(!this.rocketsPlayer[i].exploded) {
			aliveRockets.push(this.rocketsPlayer[i]);
		}
	}
	this.rocketsPlayer = aliveRockets;
	aliveRockets = [];
	for (var i = 0; i < this.rocketsEnemies.length; i += 1) {
		if(!this.rocketsEnemies[i].exploded) {
			aliveRockets.push(this.rocketsEnemies[i]);
		}
	}
	this.rocketsEnemies = aliveRockets;
}

SI.Game.prototype.deleteExplodedEnemyShips = function () {
	var toDelete = this.detector.detectHitEnemies(this.rocketsPlayer, this.enemies.ships);
	// deletes a single ship every time
	for (var i = 0; i < toDelete.length; i += 1) {
		this.enemies.ships[toDelete[i].row].splice(toDelete[i].col, 1);
		this.points += SI.Sizes.pointModifer;
	}
	// if a row is empty, remove it
	var i = 0;
	while (i < this.enemies.ships.length) {
		if(this.enemies.ships[i].length == 0) {
			this.enemies.ships.splice(i, 1);
		}
		else {
			i += 1;
		}
	}
}
SI.Game.prototype.checkPlayerStatus = function () {
	var playerHit = this.detector.detectHitPlayer(this.rocketsEnemies, this.playerShip);
	if(playerHit) {
		this.lives -= 1;
	}
}
SI.Game.prototype.launchEnemyRocket = function () {
	if(this.turnToFire == SI.Sizes.turnUntilFire) {
		var row = this.enemies.ships.length - 1;
		var last = Math.floor(Math.random() * this.enemies.ships[row].length);
		var ship = this.enemies.ships[row][last]
		this.rocketsEnemies.push(new SI.Rocket(ship.x + ship.width / 2,
					ship.y + ship.height / 2, SI.Directions.Down, SI.Images.rocketImg));
		this.turnToFire = 0;
	}
	else {
		this.turnToFire += 1;
	}
}

/*
 * Chnage the current key pressed
 */
SI.Game.prototype.onKeyDown = function (e) {
	this.currentKey = e.which;
	if(this.currentKey == SI.Keys.Up && this.okToFire &&
			this.rocketsPlayer.length < SI.Sizes.maxRockets) {
		this.lockRocketLauncher();
		this.rocketsPlayer.push(new SI.Rocket(this.playerShip.x + this.playerShip.width / 2 - SI.Sizes.rocketWidth / 2,
					this.playerShip.y, SI.Directions.Up, SI.Images.rocketImg));
	}
}
SI.Game.prototype.onKeyUp = function (e) {
	this.currentKey = 0;
}

