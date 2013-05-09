/*
 * Constructs a new Game
 */
SI.Game = function() {
	this.ctx = null;
	this.pressedKey = null;

	this.rocketsByPlayer = [];
	this.rocketsByEnemies = [];
	this.playerShip = null;;
	this.points = 0;
	this.lives = 2;
	this.enemies = {};
	this.frames = 0;
	// collison detector
	this.detector = null;
	// current enemy sprite phase
	this.enemyPhase = 0;
	// clearance to fire again (player)
	this.okToFire = true;
	// clearance to fire again (enemies)
	this.turnToFire = 0;


}

SI.Game.prototype.start = function () {
	this.initializeCanvas();
	this.attachKeyboardEvents();
	this.initializeGame();
	this.drawAllElements();
}


/*
 *	Intializes the canvas element
 *	Sets up height and width and context(painter)
 *	Sets up events for keyDown and keyUp
 */
SI.Game.prototype.initializeCanvas = function () {
	var $canvas = $('#gameview');
	
	var $bgimg = $('#background');
	$bgimg.css('display', 'block');
	$bgimg.attr('width', SI.Sizes.width + 'px');
	$bgimg.attr('height', SI.Sizes.height + 'px');

	this.ctx = $canvas[0].getContext('2d');
	this.ctx.canvas.height = SI.Sizes.height;
	this.ctx.canvas.width = SI.Sizes.width;
	this.ctx.font = SI.Sizes.font;
}

SI.Game.prototype.attachKeyboardEvents = function() {
	var self = this;
	$(document).keydown(function (e) {
		self.onKeyDown(e);
	});
	$(document).keyup(function (e) {
		self.onKeyUp(e);
	});

	$(document).bind('touchmove', function (e) {
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		e.preventDefault();
		self.playerShip.setLocation(touch.pageX - self.ctx.canvas.offsetLeft);
	});
	$(document).bind('touchstart', function (e) {
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		e.preventDefault();
		self.launchPlayerRocket();
	});
}

/*
 * Starts the game itself
 * Creates the player ship and enemy ships
 * Cleans the rocket list and allows firing
 */
SI.Game.prototype.initializeGame = function () {
	this.playerShip = new SI.SpaceShip({
		x: SI.Sizes.width / 2 - SI.Sizes.playerShipWidth / 2,
		y: SI.Sizes.bottomMargin - SI.Sizes.playerShipHeight,
		width: SI.Sizes.playerShipWidth,
		height:	SI.Sizes.playerShipHeight,
		img: SI.Images.playerImg
	});

	this.rocketsByPlayer = [];
	this.rocketsByEnemies = [];
	this.enemies = this.createEnemyShips(SI.Sizes.enemyInRow, SI.Sizes.enemyInColumn);
	this.detector = new SI.CDetection();
	this.explosions = [];
	// clearance to fire again (for player)
	this.okToFire = true;

	// clearance to fire again (for enemies), if equals SI.Sizes.turnsUntilFire, an enemy fires
	this.turnToFire = 0;
	this.points = 0;
	this.lives = 3;
	this.enemyPhase = 0;
	this.frames = 0;
	this.enemySpeed = SI.Sizes.enemyStepHort;

	var self = this;
	this.clock = setInterval(function () {	
		self.moveAllElements();
		self.deleteExplodedRockets();
		self.deleteExplodedEnemyShips();
		self.deleteDoneExplosions();
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
		this.newGamePrompt('You Win!');
	}
	else if(this.lives == 0 ||
			this.enemies.ships[this.enemies.ships.length - 1][0].y >=
			SI.Sizes.bottomMargin - SI.Sizes.enemyHeight) {
		clearInterval(this.clock);
		this.newGamePrompt('You Lost!');
	}
}

/*
 * Creates enemy ships
 * Parameters
 * rows - number of rows of ships
 * coulmns - number of coulmn of ships
 */
SI.Game.prototype.createEnemyShips = function (rows, coulmns) {
	var enemiesData = {};
	enemiesData.ships = [];
	enemiesData.directions = [];
	var xPos;
	var yPos = SI.Sizes.topMargin;
	for(var i = 0; i < rows; i += 1) {
		var row = [];
		xPos = SI.Sizes.leftMargin;
		for(var j = 0; j < coulmns; j += 1) {
				row.push(new SI.SpaceShip({
					x: xPos,
					y: yPos,
					width: SI.Sizes.enemyWidth,
					height: SI.Sizes.enemyHeight,
					img: SI.Images.enemyImg}));
				xPos += SI.Sizes.enemyWidth + SI.Sizes.enemySpacing;
		}
		yPos += SI.Sizes.enemyHeight + SI.Sizes.enemySpacing;
		enemiesData.ships.push(row);
		enemiesData.directions.push(SI.Directions.Right);
	}
	return enemiesData;
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
	for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
		if(!this.rocketsByPlayer[i].exploded) {
			aliveRockets.push(this.rocketsByPlayer[i]);
		}
		else {
			this.explosions.push(new SI.Explosion({
				x: this.rocketsByPlayer[i].x - SI.Sizes.explosionWidth / 2,
				y: this.rocketsByPlayer[i].y}));
		}
	}
	this.rocketsByPlayer = aliveRockets;

	aliveRockets = [];
	for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
		if(!this.rocketsByEnemies[i].exploded) {
			aliveRockets.push(this.rocketsByEnemies[i]);
		}
		else {
			this.explosions.push(new SI.Explosion({
				x: this.rocketsByEnemies[i].x - SI.Sizes.explosionWidth / 2,
				y: this.rocketsByEnemies[i].y  - SI.Sizes.explosionHeight / 2}));
		}
	}
	this.rocketsByEnemies = aliveRockets;
}

SI.Game.prototype.deleteExplodedEnemyShips = function () {
	var toDelete = this.detector.detectHitEnemies(this.rocketsByPlayer, this.enemies.ships);
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
			// increase enemy speed
			this.enemySpeed += SI.Sizes.enemyStepHort;
		}
		else {
			i += 1;
		}
	}
}
SI.Game.prototype.deleteDoneExplosions = function () {
	var indexToSlice;
	for (var i = 0; i < this.explosions.length && this.explosions[i].done; i += 1) {
		indexToSlice = i;
	}
	this.explosions.splice(0, i);
}

SI.Game.prototype.checkPlayerStatus = function () {
	var playerHit = this.detector.detectHitPlayer(this.rocketsByEnemies, this.playerShip);
	if(playerHit) {
		this.lives -= 1;
	}
}
SI.Game.prototype.launchEnemyRocket = function () {
	if(this.turnToFire == SI.Sizes.turnUntilFire) {
		var row = Math.floor(Math.random() * this.enemies.ships.length);
		var last = Math.floor(Math.random() * this.enemies.ships[row].length);
		var ship = this.enemies.ships[row][last];
		this.rocketsByEnemies.push(new SI.Rocket({
			x: ship.x + ship.width / 2,
			y: ship.y + ship.height / 2,
			direction: SI.Directions.Down}));
		this.turnToFire = 0;
	}
	else {
		this.turnToFire += 1;
	}
}

SI.Game.prototype.launchPlayerRocket = function () {
		if (this.okToFire && this.rocketsByPlayer.length < SI.Sizes.maxRockets) {
			this.lockRocketLauncher();
			this.rocketsByPlayer.push(new SI.Rocket({
				x: this.playerShip.x + this.playerShip.width / 2 - SI.Sizes.rocketWidth / 2,
				y: this.playerShip.y,
				direction: SI.Directions.Up}));
		}
}
/*
 * Chnage the current key pressed
 */
SI.Game.prototype.onKeyDown = function (e) {
	if(e.which == SI.Keys.Right)
		this.moveRight = true;
	else if(e.which == SI.Keys.Left)
		this.moveLeft = true;
	else if(e.which == SI.Keys.Up) {
		this.launchPlayerRocket();
	}
}
SI.Game.prototype.onKeyUp = function (e) {
	if(e.which == SI.Keys.Right)
		this.moveRight = false;
	else if(e.which == SI.Keys.Left)
		this.moveLeft = false;
}

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
	if(this.moveRight) {
		this.playerShip.move(SI.Sizes.playerStep, 0);
	}
	else if(this.moveLeft) {
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
	for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
		this.rocketsByPlayer[i].move(SI.Sizes.rocketStep);
	}
	for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
		this.rocketsByEnemies[i].move(SI.Sizes.rocketStep);
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
	this.clearGrid();
	this.drawGround();
	this.drawPlayerShip();
	this.drawEnemyShips();
	this.drawExplosions();
	this.drawRockets();
	this.drawStatus();
}

/*
 * Clears the game grid
 */
SI.Game.prototype.clearGrid = function () {
	this.ctx.clearRect(0, 0, SI.Sizes.width, SI.Sizes.height);
}
/*
 * Draws the player ship
 */
SI.Game.prototype.drawPlayerShip = function () {
	this.playerShip.draw(this.ctx);
}
/*
 * Draws the enemy ships
 */
SI.Game.prototype.drawEnemyShips = function () {
	for (var i = 0; i < this.enemies.ships.length; i += 1) {
		for (var j = 0; j < this.enemies.ships[i].length; j += 1) {
			this.enemies.ships[i][j].draw(this.ctx);
		}
	}
}
/*
 * Draws the rockets
 */
SI.Game.prototype.drawRockets = function () {
	for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
		this.rocketsByPlayer[i].draw(this.ctx);
	}
	for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
		this.rocketsByEnemies[i].draw(this.ctx);
	}
}
/*
 * Draws the explosions
 */
SI.Game.prototype.drawExplosions = function () {
	for (var i = 0; i < this.explosions.length; i += 1) {
		this.explosions[i].draw(this.ctx);
	}
}
/*
 * Draws the ground
 */
SI.Game.prototype.drawGround = function () {
	this.ctx.fillStyle = SI.Colors.ground;
	this.ctx.fillRect(0,SI.Sizes.bottomMargin, SI.Sizes.width, 10);
}

SI.Game.prototype.drawStatus = function () {
	this.ctx.fillStyle  = SI.Colors.text;
	this.ctx.lineWidth = SI.Sizes.lineWidth;

	var output = 'Points: ' + this.points;
	this.ctx.fillText(output, SI.Sizes.leftMargin, SI.Sizes.textMargin); 

	output = 'Lives left: ' + this.lives;
	this.ctx.fillText(output, SI.Sizes.textRightMargin, SI.Sizes.textMargin); 
}

SI.Game.prototype.newGamePrompt = function (message) {
	var promptQuestion = message + '\nPlay Again?';
	var playAgain = confirm(promptQuestion);
	if (playAgain) {
		this.initializeGame();
	}
}
//===================Sprite Change==============================
SI.Game.prototype.ChangeEnemySpritePhase = function (ships) {
	var newImgX;
	if(this.enemyPhase == SI.Images.enemyImg.phases) {
		newImgX = 0;
		this.enemyPhase = 0;
	}
	else {
		newImgX = (this.enemyPhase + 1) * SI.Images.enemyImg.width;
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
			if(explosions[i].imgX == SI.Images.explosionImg.phases * SI.Images.explosionImg.width) {
				explosions[i].expanding = false;
			}
			else {
				explosions[i].imgX += SI.Images.explosionImg.width;
			}
		}
		//explosion disappearing
		else {
			// last sprite img
			if(explosions[i].imgX == 0) {
				explosions[i].done = true;
			}
			else {
				explosions[i].imgX -= SI.Images.explosionImg.width;
			}
		}
	}
}
