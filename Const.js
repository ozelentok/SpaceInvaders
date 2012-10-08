var SI = {};
/*
 * Constructs a new Game
 */
SI.Game = function() {
	// canvas context
	this.xpainter;
	// current pressed key
	this.currentKey;
	// rockets on the game grid
	// rockets launched by player
	this.rocketsPlayer;
	// rockets launched by enemies
	this.rocketsEnemies;
	// player ship
	this.playerShip;
	// enemy ships
	this.enemyShips;
	// clearance to fire again (player)
	this.okToFire;
	// clearance to fire again (enemies)
	this.turnToFire;
	// collison detecor
	this.detector;
	// amount of points
	this.points
	// lives left
	this.lives;
}
/*
 * Sizes for drawing and computing
 */
SI.Sizes = {
	height:	900,
	width:	800,

	playerShipWidth: 60,
	playerShipHeight: 30,
	playerStep: 20,

	enemyInRow: 6,
	enemyInColumn: 10,
	enemyWidth: 40,
	enemyHeight: 30,
	enemyStepHort: 5,
	enemyStepVert: 10,
	enemySpacing: 15,

	rocketHeight: 28,
	rocketWidth: 7,
	rocketStep: 20,

	lineWidth: 1,
	maxRockets: 8,

	pointModifer: 5,
	//miliseconds per frame
	MSPF: 1000 / 30,

	turnUntilFire: 25,
	font: '25px Arial',
	messageFont: '100px Arial',

}
	SI.Sizes.topMargin = 0;
	SI.Sizes.leftMargin =  10;
	SI.Sizes.bottomMargin = SI.Sizes.height - 60;
	SI.Sizes.rightMargin = SI.Sizes.width - 10;

	SI.Sizes.textMargin = SI.Sizes.bottomMargin + 45;
	SI.Sizes.textRightMargin = SI.Sizes.width - 140;

	SI.Sizes.popUpX = 50;
	SI.Sizes.popUpY = 100;
	SI.Sizes.popUpWidth = SI.Sizes.width - 100;
	SI.Sizes.popUpHeight = SI.Sizes.height - 400;

SI.Images = {};

SI.Images.backgroundImg = new Image();
SI.Images.backgroundImg.src = 'images/background.png';

SI.Images.playerImg = new Image();
SI.Images.playerImg.src = 'images/player.png';

SI.Images.enemyImg = new Image();
SI.Images.enemyImg.src = 'images/enemy.png';

SI.Images.rocketUpImg = new Image();
SI.Images.rocketUpImg.src = 'images/rocketUp.png';

SI.Images.rocketDownImg = new Image();
SI.Images.rocketDownImg.src = 'images/rocketUp.png';

/*
 * Colors for fillStyle and strokeStyle
 */
SI.Colors = {
	rocket: '#07f',
	ground: 'green',
	text: 'white',
	gold: '#ff0',
	popUpBackground: 'rgba(0, 0, 0, 0.5)'
}
/*
 * Directions for rockets and spaceships
 */
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

