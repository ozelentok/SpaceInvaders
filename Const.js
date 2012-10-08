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
	this.rockets;
	// player ship
	this.playerShip;
	// enemy ships
	this.enemyShips;
	// clearance to fire again
	this.okToFire;
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

	playerShipWidth: 50,
	playerShipHeight: 10,
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
	MSPF: 1000 / 30,
	
	font: '25px Arial',

}
	SI.Sizes.topMargin = 50,
	SI.Sizes.leftMargin =  10,
	SI.Sizes.bottomMargin = SI.Sizes.height - 60,
	SI.Sizes.rightMargin = SI.Sizes.width - 10,

	SI.Sizes.textMargin = SI.Sizes.bottomMargin + 45,
	SI.Sizes.textRightMargin = SI.Sizes.width - 140;
SI.Images = {};

SI.Images.backgroundImg = new Image();
SI.Images.backgroundImg.src = 'images/background.png';

SI.Images.playerImg = new Image();
SI.Images.playerImg.src = 'images/player.png';

SI.Images.enemyImg = new Image();
SI.Images.enemyImg.src = 'images/enemy.png';

/*
 * Colors for fillStyle and strokeStyle
 */
SI.Colors = {
	player: '#0f0',
	enemy: '#f30',
	rocket: '#07f',
	ground: 'green',
	text: 'white',
	background: 'black'
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

