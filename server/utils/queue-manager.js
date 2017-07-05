/**
 * Created by dev on 7/5/2017.
 */
var users = require('./users.js');

// anonymous object to expose member functions
var queueManager = function() {};

// holds all active queues
var queues = {};

/*
  Checks whether or not the user is currently in the queue, then either
  if the requested queue is empty, creates new queue with user or
  if the requested queue is not empty, pushes the user to existing queue.
  Returns boolean if the addition to the queue was successful or not.
 */
queueManager.prototype.add = function(username, queue) {
  if (queueManager.prototype.existsInQueue(username, queue)) {
    return false;
  }
  // add user to queue
  if (queues[queue] === undefined) {
    queues[queue] = [username];
  } else {
    queues[queue].push(username);
  }
  // add queue to user's active queue list
  users.addActiveQueue(username, queue);
  return true;
};

/*
  Iterate through the selected queue.
  If a user is found, splice out.
  Returns true if user is successfully removed, false otherwise.
 */
queueManager.prototype.remove = function(username, queue) {
  for (var i = 0; i < queues[queue].length; i++) {
    if (queues[queue][i] === username) {
      queues[queue].splice(i, 1);
      console.log(username + ' has been removed from ' + queue);
      users.removeActiveQueue(username, queue); // remove from user's active list
      return true;
    }
  }
  console.log('user does not exist in the selected queue');
  return false;
};

/*
  Iterate through user's activeQueues list. Use the names of each queue to access
  global queue object, check each queue to remove user.
 */
queueManager.prototype.removeAll = function(username) {
  var user = users.map[username];
  // save length of activeQueues to avoid for loop exiting early
  // .slice() copies array by value, otherwise reference will be copied
  var activeQueues = user.activeQueues.slice();
  for (var i = 0; i < activeQueues.length; i++) {
    var qName = activeQueues[i];
    for (var k = 0; k < queues[qName].length; k++) {
      if (queues[qName][k] === username) {
        queues[qName].splice(k, 1); // remove element at k
        users.removeActiveQueue(username, qName); // remove qName from activeQueue list
      }
    }
  }
  // returns true if user has been removed from all active queues
  return users.map[username].activeQueues.length === 0;
};

queueManager.prototype.existsInQueue = function(username, queue) {
  var queues = users.map[username].activeQueues;
  for (var i = 0; i < queues.length; i++) {
    if (queue === queues[i]) {
      return true;
    }
  }
  return false;
};

/*
  HELPER FUNCTIONS
*/

/**
 * Creates a new lobby ID and assigns users to it.
 * @param lobbyMembers: array of usernames to assign to lobby
 */
function createLobby(lobbyMembers) {
  var lobby = makeLobbyId();
  for (var i = 0; i < lobbyMembers.length; i++) {
    users.map[lobbyMembers[i]].lobby = lobbyId;
    users.removeAllActiveQueues(lobbyMembers[i]);
    console.log(lobbyMembers[i] + ' has been assigned to lobby: ' + lobbyId);
  }
}

// creates a unique lobby name
var makeLobbyId = function() {
  var length = 16;
  var text = "";
  var potential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    text += potential.charAt(Math.floor(Math.random() * potential.length));
  }
  return text;
};

module.exports = new queueManager();
