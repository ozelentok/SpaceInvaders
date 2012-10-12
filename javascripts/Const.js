var SI = {};
/*
 * Sizes for drawing and computing
 */
SI.Sizes = {
	height:	800,
	width:	800,

	playerShipWidth: 40,
	playerShipHeight: 20,
	playerStep: 20,

	enemyInRow: 6,
	enemyInColumn: 11,
	enemyWidth: 40,
	enemyHeight: 30,
	enemyStepHort: 3,
	enemyStepVert: 10,
	enemySpacing: 15,

	rocketHeight: 20,
	rocketWidth: 6,
	rocketStep: 20,

	explosionWidth: 40,
	explosionHeight: 40,

	lineWidth: 1,
	maxRockets: 8,

	pointModifer: 5,
	//miliseconds per frame
	MSPF: 1000 / 30,

	waitSprite: 5, 
	
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
SI.Images.playerImg.phases = 1 - 1;

SI.Images.enemyImg = new Image();
SI.Images.enemyImg.src = 'images/enemy.png';
SI.Images.enemyImg.phases = 2 - 1;

SI.Images.rocketImg = new Image();
SI.Images.rocketImg.src = 'images/rocket.png';

SI.Images.explosionImg = new Image();
SI.Images.explosionImg.src = 'images/explosion.png';
SI.Images.explosionImg.phases = 7 - 1;

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

