var pieceColors = new Array();
var pieceEffects = new Array();

//Normal colored tiles
pieceColors[0] = new THREE.Color(0xFFFFFF);
pieceEffects[0] = null;
pieceColors[1] = new THREE.Color(0xCCCCCC);
pieceEffects[1] = null;
pieceColors[2] = new THREE.Color(0xF4A460);
pieceEffects[2] = null;
pieceColors[3] = new THREE.Color(0xCD853F);
pieceEffects[3] = null;

//Speed up
pieceColors[4] = new THREE.Color(0xFFFF00);
pieceEffects[4] = function(ball) {
    ball.targetSpeedMultiplier = 2;
    ball.targetControlMultiplier = 2;
};
//Slow down
pieceColors[5] = new THREE.Color(0xFF0000);
pieceEffects[5] = function(ball) {
    ball.targetSpeedMultiplier = 0.5;
    ball.targetControlMultiplier = 0.5;
};

//No control
pieceColors[6] = new THREE.Color(0x00FF00);
pieceEffects[6] = function(ball) {
    ball.targetControlMultiplier = 0;
    ball.controlMultiplier = 0;
};
//Invert control
pieceColors[7] = new THREE.Color(0xFF00FF);
pieceEffects[7] = function(ball) {
    ball.targetControlMultiplier = -1;
    ball.controlMultiplier = -1;
};

//Jump
pieceColors[8] = new THREE.Color(0x0000FF);
pieceEffects[8] = function(ball) {
    ball.jump();
};

//Hole
pieceColors[9] = null;
pieceEffects[9] = function(ball) {
    console.log("death");
    ball.kill();
};