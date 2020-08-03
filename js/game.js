/* @type THREE.Scene */
var renderScene;
/* @type THREE.Camera */
var renderCamera;
/* @type THREE.WebGLRenderer */
var renderer;
/* @type THREE.Projector */
var projector;

var pieceSize, pieceLineCount, pieceCount;
var viewPortWidth, viewPortHeight;
var masterComposer;
var renderLight;

var viewPortClipFar;
var playerBall;

function initialize(wrapperid)
{
    viewPortWidth = window.innerWidth;
    viewPortHeight = window.innerHeight;
    var     viewPortFOV = 60,
            viewPortAspectRatio = viewPortWidth / viewPortHeight,
            viewPortClipNear = 1;
    viewPortClipFar = 3000;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.autoClear = false;
    renderer.setSize(viewPortWidth, viewPortHeight);

    renderCamera = new THREE.PerspectiveCamera(
        viewPortFOV,
        viewPortAspectRatio,
        viewPortClipNear,
        viewPortClipFar
    );

    renderCamera.position.y = 300;
    renderCamera.rotation.x = Math.PI / 8;
    renderCamera.rotation.y = Math.PI;

    renderScene = new THREE.Scene();
    renderScene.add(renderCamera);

    renderLight = new THREE.PointLight(0xFFFFFF);
    renderLight.position.x = 0;
    renderLight.position.y = 1000;
    renderLight.distance = viewPortClipFar;
    renderScene.add(renderLight);

    var renderContainer = $("#" + wrapperid);
    renderContainer.replaceWith(renderer.domElement);

    projector = new THREE.Projector();

    console.log("Base env setup");

    pieceCount = 5;
    pieceSize = Math.floor((viewPortWidth - 200) / (pieceCount * 3));
    pieceLineCount = Math.floor((viewPortClipFar / pieceSize) + 2);

    baseMovementSpeed = 0.005 * pieceSize;

    makeBall();
    makePieces();

    //Init master composer
    var renderPassMain = new THREE.RenderPass(renderScene, renderCamera);
    masterComposer = new THREE.EffectComposer(renderer);
    masterComposer.addPass(renderPassMain);
    var effectScreenOut = new THREE.ShaderPass(THREE.ShaderExtras["screen"]);
    effectScreenOut.renderToScreen = true;
    masterComposer.addPass(effectScreenOut);

    lastFrameTime = (new Date()).getTime();

    nextLevel();

    animate();
}

var currentPos = 0;
var currentLevel = 0;

var levelGrid = null;

function nextLevel() {
    if(currentLevel >= levels.length) {
        currentLevel = 0;
    }
    currentPos = -1;
    renderCamera.position.z = viewPortClipFar + 1000;
    levelGrid = levels[currentLevel].tiles;
    currentLevel++;
}

var pieceGrid;

var lastFrameTime;
function animate() {
    requestAnimationFrame(animate);

    var curTime = (new Date()).getTime();
    var timeDiff = curTime - lastFrameTime;
    if(timeDiff <= 0)
        return;

    lastFrameTime = curTime;
    nextFrame(timeDiff);
    masterComposer.render(0.1);
}

function makePieces() {
    pieceGrid = new Array();
    for(var y = 0; y < pieceLineCount; y++) {
        pieceGrid[y] = new Array();
        for(var x = 0; x < pieceCount; x++) {
            var cPiece = new THREE.Mesh(new THREE.CubeGeometry(pieceSize, 10, pieceSize), new THREE.MeshLambertMaterial());
            cPiece.position.x = (x - ((pieceCount - 1) / 2)) * pieceSize;
            cPiece.position.y = 0;
            cPiece.position.z = (y + 2) * pieceSize;
            pieceGrid[y][x] = cPiece;
            renderScene.add(cPiece);
        }
    }
}

var baseMovementSpeed;

function nextFrame(delta) {
    renderCamera.position.z += baseMovementSpeed * delta * playerBall.speedMultiplier;

    if(renderCamera.position.z > pieceSize) {
        currentPos++;
        renderCamera.position.z = 0;

        for(var curY = 0; curY < pieceLineCount; curY++) {
            var cLineNum = curY + currentPos;
            if(cLineNum >= levelGrid.length) {
                nextLevel();
                nextFrame(delta);
                return;
            }
            var cLine = levelGrid[cLineNum];
            var cPieces = pieceGrid[curY];
            for(var x = 0; x < pieceCount; x++) {
                var cPieceCol = pieceColors[cLine[x]];
                if(cPieceCol == null) {
                    cPieces[x].visible = false;
                } else {
                    cPieces[x].visible = true;
                    cPieces[x].material.color =  cPieceCol;
                }
            }
        }
    }
    playerBall.ballMesh.position.z = (pieceSize * 3) + renderCamera.position.z;
    playerBall.checkMovement(delta);
    playerBall.checkTile();
    renderLight.position.z = renderCamera.position.z;
}