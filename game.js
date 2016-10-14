var Process = require('./process.js').Process;

var Game = function(teamA, teamB, width, height){

  // initialise tiles
  var tilesA = makeTiles(width, height);
  var tilesB = makeTiles(width, height);

  var currentTurn = '';
  var proc = undefined;

  // have someone vote
  this.vote = function(user, vote){
    if(this.currentTurn != ''){
      return proc.vote(user, vote);
    } else {
      return -1;
    }
  }

  this.init = function(){
    currentTurn = 'A';

    proc = new Process([teamA, teamB], function(item, teamId){
      // cleanup the vote
      var vote = item.trim().toLowerCase();

      // make sure it is still there
      return ((teamId == 0)?tilesA:tilesB).indexOf(vote) != -1 && vote
    });
  }

  this.nextTurn = function(){
    // get the team id
    var id = (currentTurn == 'A')?0:1;

    // get the result
    var result = {
      'team': currentTurn,
      'tile': proc.getWinner(id)
    }

    // reset
    proc.reset(id);

    // and switch turns
    if(currentTurn == 'A'){
      tilesA.splice(tilesA.indexOf(result['tile']), 1);
      currentTurn = 'B';
    } else {
      tilesB.splice(tilesB.indexOf(result['tile']), 1);
      currentTurn = 'B';
    }

    return result;
  }

  this.remainingATiles = function(){
    return tilesA.slice();
  }

  this.remainingBTiles = function(){
    return tilesB.slice();
  }

}

var makeTiles = function(w, h){
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';

  var tiles = [];

  for(var x = 0; x < w; x++){
    for(var y = 0; y < h; y++){
      tiles.push(alphabet[x] + (y + 1))
    }
  }

  return tiles;
}

module.exports.Game = Game;
