//===================Moving Elements==============================

/*
 * Moves all the moveable elements in the game
 * Player's ship, enemy ships and rockets
 */
SI.Game.prototype.moveAllElements = function () {
	this.movePlayerShip();
	this.moveEnemyShips();
	this.moveRockets();
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

/*
 * Moves the enemy ships
 * If one ship in a row hits one of the margins
 * then the whole row will change their direction
 */
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
 * Moves the rockets
 */
SI.Game.prototype.moveRockets = function () {
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].move(SI.Sizes.rocketStep);
	}
}


//===================Drawing Elements==============================

/*
 * Draws all the elements in the game
 * Game grid, player ship, and enemy ships and rockets
 */
SI.Game.prototype.drawAllElements = function () {
	this.drawGrid();
	this.drawGround();
	this.drawPlayerShip();
	this.drawEnemyShips();
	this.drawRockets();
}

/*
 * Draws the game grid
 */
SI.Game.prototype.drawGrid = function () {
	this.xpainter.fillStyle = SI.Colors.background;
	this.xpainter.fillRect(0, 0, SI.Sizes.width, SI.Sizes.height);
}
/*
 * Draws the player ship
 */
SI.Game.prototype.drawPlayerShip = function () {
	this.xpainter.lineWidth = SI.Sizes.lineWidth;
	this.xpainter.fillStyle = SI.Colors.player;
	this.playerShip.draw(this.xpainter);
}
/*
 * Draws the enemy ships
 */
SI.Game.prototype.drawEnemyShips = function () {
	this.xpainter.fillStyle = SI.Colors.enemy;
	for (var i = 0; i < this.enemyShips.ships.length; i += 1) {
		for (var j = 0; j < this.enemyShips.ships[i].length; j += 1) {
			this.enemyShips.ships[i][j].draw(this.xpainter);
		}
	}
}
/*
 * Draws the rockets
 */
SI.Game.prototype.drawRockets = function () {
	this.xpainter.strokeStyle = SI.Colors.rocket;
	this.xpainter.lineWidth = SI.Sizes.rocketWidth;
	for (var i = 0; i < this.rockets.length; i += 1) {
		this.rockets[i].draw(this.xpainter);
	}
}

/*
 * Draws the ground
 */
SI.Game.prototype.drawGround = function () {
	this.xpainter.fillStyle = SI.Colors.ground;
	this.xpainter.fillRect(0,SI.Sizes.bottomMargin, SI.Sizes.width, 10);
}
