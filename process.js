/**
* represents a single voting process
* @param {array} teams A list of teams each represented by a list of members.
* @param {function} validator A function (item, teamId, user) that validates and cleans up input from votes. Should
return a false-ish value when failing.
*/
var Process = function(teams, validator){


  // A list of team members
  this.teams = teams;

  // a list of votes
  this.votes = teams.map(function(){return new Map(); });

  this.voters = [];

  /**
  * Makes a single vote from a user.
  * Returns an integer status code:
  *  0 -- all fine
  *  1 -- you are not in any teams
  *  2 -- you have already voted
  *  3 -- that is not a valid option.
  */
  this.vote = function(user, item){

    // check in which team the user is
    var teamId = -1;
    for(var i = 0; i < this.teams.length; i++){
      if(this.teams[i].indexOf(user) != -1){
        teamId = i;
        break;
      }
    }

    // you are not in any teams.
    if(teamId == -1){
      return 1;
    }

    // user has already voted.
    if(this.voters.indexOf(user) != -1){
        return 2;
    }

    var vote;

    // cleanup whatever the user wants to vote for.
    try {
      vote = validator(item, teamId, user);

      if(! vote){
        throw new Error("Can not vote. ")
      }
    } catch(e){
      return 3;
    }

    // make the vote
    if(this.votes[teamId].has(vote)){
      this.votes[teamId].set(vote, this.votes[teamId].get(vote) + 1);
    } else {
      this.votes[teamId].set(vote, 1);
    }

    // store that the user has voted.
    this.voters.push(user);

    // and done.
    return 0;
  }

  this.reset = function(teamId){
    this.votes[teamId] = new Map();
  }

  this.resetAll = function(){
    var me = this;
    
    this.votes.foreach(function(e, idx){
      this.reset(idx);
    });
  }

  this.getWinner = function(teamId){
    var res = this.votes[teamId];

    var max_votes = 0;
    var winner = undefined;

    // TODO: What to do when we have more than one vote
    // right now we abuse the fact that Map()s preserve the insertation order
    // and just take the item that was voted for FIRST.

    var key, val;

    for(kv of res){

      // extract key / value
      key = kv[0];
      val = kv[1];

      // check if we have more
      if(val > max_votes){
        max_votes = val;
        winner = key;
      }
    }

    // and return the winner
    return winner;

  }

  /* Gets the winners for each vote.  */
  this.getWinners = function(){
    return this.votes.map(this.getWinner.bind(this));
  }
}

module.exports.Process = Process;
