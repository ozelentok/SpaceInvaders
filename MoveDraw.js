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
	var dropDown = false;
	var lastRow = this.enemies.ships.length - 1;
	for (var i = lastRow; i >= 0; i -= 1) {
		if(this.enemies.ships[i][0].x <= SI.Sizes.leftMargin) {
			this.enemies.directions[i] = SI.Directions.Right;
			if(i == lastRow) {
				dropDown = true;
			}
		}
		else if(this.enemies.ships[i][this.enemies.ships[i].length - 1].x + this.enemies.ships[i][0].width >= SI.Sizes.rightMargin) {
			this.enemies.directions[i] = SI.Directions.Left;
			if(i == lastRow) {
				dropDown = true;
			}
		}
		for (var j = 0; j < this.enemies.ships[i].length; j += 1) {
			if(dropDown) {
				this.enemies.ships[i][j].move(this.enemies.directions[i] * this.enemySpeed, SI.Sizes.enemyStepVert);
			}
			else {
				this.enemies.ships[i][j].move(this.enemies.directions[i] * this.enemySpeed, 0);
			}
		}
	}
}
/*
 * Moves the rockets
 */
SI.Game.prototype.moveRockets = function () {
	for (var i = 0; i < this.rocketsPlayer.length; i += 1) {
		this.rocketsPlayer[i].move(SI.Sizes.rocketStep);
	}
	for (var i = 0; i < this.rocketsEnemies.length; i += 1) {
		this.rocketsEnemies[i].move(SI.Sizes.rocketStep);
	}
}


//===================Drawing Elements==============================

/*
 * Draws all the elements in the game
 * Game grid, player ship, and enemy ships and rockets
 */
SI.Game.prototype.drawAllElements = function () {
	if(this.frames % 5 == 0) {
		this.ChangeEnemySpritePhase(this.enemies.ships);
	}
	this.ChangeExplosionPhase(this.explosions);
	this.frames += 1;
	this.drawGrid();
	this.drawGround();
	this.drawPlayerShip();
	this.drawEnemyShips();
	this.drawExplosions();
	this.drawRockets();
	this.drawStatus();
}

/*
 * Draws the game grid
 */
SI.Game.prototype.drawGrid = function () {
	this.xpainter.drawImage(SI.Images.backgroundImg, 0, 0, SI.Sizes.width, SI.Sizes.height);
}
/*
 * Draws the player ship
 */
SI.Game.prototype.drawPlayerShip = function () {
	this.playerShip.draw(this.xpainter);
}
/*
 * Draws the enemy ships
 */
SI.Game.prototype.drawEnemyShips = function () {
	for (var i = 0; i < this.enemies.ships.length; i += 1) {
		for (var j = 0; j < this.enemies.ships[i].length; j += 1) {
			this.enemies.ships[i][j].draw(this.xpainter);
		}
	}
}
/*
 * Draws the rockets
 */
SI.Game.prototype.drawRockets = function () {
	for (var i = 0; i < this.rocketsPlayer.length; i += 1) {
		this.rocketsPlayer[i].draw(this.xpainter);
	}
	for (var i = 0; i < this.rocketsEnemies.length; i += 1) {
		this.rocketsEnemies[i].draw(this.xpainter);
	}
}
/*
 * Draws the explosions
 */
SI.Game.prototype.drawExplosions = function () {
	for (var i = 0; i < this.explosions.length; i += 1) {
		this.explosions[i].draw(this.xpainter);
	}
}
/*
 * Draws the ground
 */
SI.Game.prototype.drawGround = function () {
	this.xpainter.fillStyle = SI.Colors.ground;
	this.xpainter.fillRect(0,SI.Sizes.bottomMargin, SI.Sizes.width, 10);
}

SI.Game.prototype.drawStatus = function () {
	this.xpainter.fillStyle  = SI.Colors.text;
	this.xpainter.lineWidth = SI.Sizes.lineWidth;

	var output = 'Points: ' + this.points;
	this.xpainter.fillText(output, SI.Sizes.leftMargin, SI.Sizes.textMargin); 

	output = 'Lives left: ' + this.lives;
	this.xpainter.fillText(output, SI.Sizes.textRightMargin, SI.Sizes.textMargin); 
}

SI.Game.prototype.popUpMessage = function (message) {
	this.xpainter.fillStyle = SI.Colors.popUpBackground
	this.xpainter.strokeStyle = SI.Colors.gold;
	this.xpainter.fillRect(SI.Sizes.popUpX,
			SI.Sizes.popUpY,
			SI.Sizes.popUpWidth,
			SI.Sizes.popUpHeight);
	this.xpainter.strokeRect(SI.Sizes.popUpX,
			SI.Sizes.popUpY,
			SI.Sizes.popUpWidth,
			SI.Sizes.popUpHeight);
	this.xpainter.fillStyle = SI.Colors.text;
	this.xpainter.font = SI.Sizes.messageFont;
	this.xpainter.fillText(message,
			(SI.Sizes.popUpX + SI.Sizes.popUpWidth) / 2 - 180,
			(SI.Sizes.popUpY + SI.Sizes.popUpHeight) / 2);
}



//===================Sprite Change==============================
SI.Game.prototype.ChangeEnemySpritePhase = function (ships) {
	var newImgX;
	if(this.enemyPhase == SI.Images.enemyImg.phases) {
		newImgX = 0;
		this.enemyPhase = 0;
	}
	else {
		newImgX = (this.enemyPhase + 1) * SI.Sizes.enemyWidth;
		this.enemyPhase += 1;
	}
	for (var i = 0; i < ships.length; i += 1) {
		for (var j = 0; j < ships[i].length; j += 1) {
			ships[i][j].imgX = newImgX;
		}
	}
}
SI.Game.prototype.ChangeExplosionPhase = function (explosions) {
	for (var i = 0; i < explosions.length; i += 1) {
		// explosion expanding
		if(explosions[i].expanding) {
			if(explosions[i].imgX == SI.Images.explosionImg.phases * SI.Sizes.explosionWidth) {
				explosions[i].expanding = false;
			}
			else {
				explosions[i].imgX += SI.Sizes.explosionWidth;
			}
		}
		//explosion disappearing
		else {
			// last sprite img
			if(explosions[i].imgX == 0) {
				explosions[i].done = true;
			}
			else {
				explosions[i].imgX -= SI.Sizes.explosionWidth;
			}
		}
	}
}
