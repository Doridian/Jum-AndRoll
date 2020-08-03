JARBall = function() {
    var ballRadius = (pieceSize / 2);
    this.ballMesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 64, 64), new THREE.MeshLambertMaterial());
    this.ballMesh.material.color = new THREE.Color(0xFFFFFF);
    this.baseY = ballRadius;
    this.jumpHeight = ballRadius;
    this.reset();
    renderScene.add(this.ballMesh);
};
JARBall.prototype.constructor = JARBall;
JARBall.prototype.reset = function() {
    this.ballMesh.position.y = this.baseY;
    this.jumpingState = 0;
    this.isJumping = false;
	this.isDead = false;
    this.speedMultiplier = 1;
    this.controlMultiplier = 1;
    this.targetSpeedMultiplier = 1;
    this.targetControlMultiplier = 1;
    this.positionOnTile(Math.floor(pieceCount / 2));
};
JARBall.prototype.positionOnTile = function(tile) {
    if(tile >= pieceCount)
        return;

    this.posX = tile;
    this.adjustMeshPosition();
};
JARBall.prototype.adjustMeshPosition = function() {
    this.ballMesh.position.x = (this.posX - ((pieceCount - 1) / 2)) * pieceSize;
};
JARBall.prototype.jump = function() {
    this.isJumping = true;
};
JARBall.prototype.kill = function() {
	if(this.isDead) return;
	this.isDead = true;
	this.jumpingState = 0;
	this.positionOnTile(Math.round(this.posX));
};
JARBall.prototype.checkMovement = function(delta) {
	if(this.isDead) {
		this.jumpingState += 0.005 * delta;
		this.speedMultiplier = 1;
        if(this.jumpingState >= Math.PI) {
			currentLevel--;
			nextLevel();
			this.reset();
			return;
		}
		this.ballMesh.position.y = this.baseY + ((Math.cos(this.jumpingState) - 1) * this.jumpHeight * 5);
		return;
	}

    this.speedMultiplier = this.speedMultiplier + ((this.targetSpeedMultiplier - this.speedMultiplier) * (delta / 500));
    this.controlMultiplier = this.controlMultiplier + ((this.targetControlMultiplier - this.controlMultiplier) * (delta / 500));

    if(this.isJumping) {
        this.jumpingState += 0.005 * delta;
        if(this.jumpingState >= Math.PI) {
            this.jumpingState = 0;
            this.isJumping = false;
        }
        this.ballMesh.position.y = this.baseY + (this.isJumping ? (Math.sin(this.jumpingState) * this.jumpHeight) : 0);
    }
    var moveX = 0;
    if(this.moveLeft) {
        moveX += 1;
    }
    if(this.moveRight) {
        moveX -= 1;
    }
    if(moveX != 0) {
        this.posX += delta * moveX * 0.005 * baseMovementSpeed * this.controlMultiplier;

        if(this.posX < 0)
            this.posX = 0;
        else if(this.posX > (pieceCount - 1))
            this.posX = pieceCount - 1;

        this.adjustMeshPosition();
    }
};
var lastTileX = -1;
var lastTileY = -1;
JARBall.prototype.checkTile = function() {
    if(this.isJumping)
        return;

    var tY = currentPos + 1;
    var tX = Math.round(this.posX);

    if(lastTileX == tX && lastTileY == tY)
        return;
    lastTileX = tX; lastTileY = tY;

    this.targetSpeedMultiplier = 1;
    this.targetControlMultiplier = 1;

    var cTile = levelGrid[tY][tX];
    if(pieceEffects[cTile]) {
        pieceEffects[cTile](this);
    }
};

var playerBall;

function makeBall() {
    playerBall = new JARBall();
}

function _onKeyEvent(event, pressed) {
    if(event.keyCode == 37) {
        playerBall.moveLeft = pressed;
    } else if(event.keyCode == 39) {
        playerBall.moveRight = pressed;
    } else if(event.keyCode == 32) {
        if(pressed) {
            playerBall.jump();
        }
    } else {
        return;
    }
    event.preventDefault();
}

document.addEventListener("keydown", function(event) { _onKeyEvent(event, true) }, false);
document.addEventListener("keyup", function(event) { _onKeyEvent(event, false) }, false);