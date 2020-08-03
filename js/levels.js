var levels = new Array();

var levelTiles = new Array();
levels[0] = {tiles : levelTiles, jumps: 10, name: "Testlevel"};

for(var i = 0; i < 300; i += 2) {
    levelTiles[i] = [0, (i % 2 <= 2) ? 4 : 1, 0, (i % 20 <= 0) ? 9 : 1, 0];
    levelTiles[i + 1] = [1, (i % 2 <= 2) ? 4 : 0, 1, 0, 1];
}