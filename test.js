// making votes
var Game = require("./game.js").Game;

// create a new game 10x10 with the two teams as shown
var g = new Game(['tom', 'sid', 'leo'], ['hannes', 'monique', 'hannes2'], 10, 10);
g.init();

// do some voting
g.vote('tom', 'A1');
g.vote('sid', 'A1');
g.vote('leo', 'A2');

// have someones from the other team vote
// this will count in the next round.
g.vote('hannes2', 'A2');

console.log(g.nextTurn());

g.vote('hannes', 'A2');
g.vote('monique', 'A1');

console.log(g.nextTurn());


var a = g.remainingATiles().join(' ');
var b = g.remainingBTiles().join(' ');
console.log('A can choose from the following tiles: ' + a);
console.log('B can choose from the following tiles: ' + b);
