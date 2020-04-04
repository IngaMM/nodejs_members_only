#! /usr/bin/env node

console.log(
  "This script populates some test users and messages to your database. Specified database as argument - e.g.: node populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var bcrypt = require("bcryptjs");
var User = require("./models/user");
var Message = require("./models/message");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var users = [];
var messages = [];

function userCreate(username, first_name, family_name, member, admin, cb) {
  bcrypt.hash("foobar", 10, (err, hashedPassword) => {
    if (err) {
      if (err) {
        console.log(err);
      }
    }

    userdetail = {
      username,
      first_name,
      family_name,
      password: hashedPassword,
      member,
      admin
    };

    var user = new User(userdetail);

    user.save(function(err) {
      if (err) {
        cb(err, null);
        return;
      }

      console.log("New User: " + user);
      users.push(user);
      cb(null, user);
    });
  });
}

function messageCreate(title, user, timestamp, content, cb) {
  messagedetail = {
    title,
    user,
    timestamp
  };
  if (content != false) messagedetail.content = content;

  var message = new Message(messagedetail);

  message.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Message: " + message);
    messages.push(message);
    cb(null, message);
  });
}

function createUsers(cb) {
  async.series(
    [
      function(callback) {
        userCreate("john99@gmail.com", "John", "Archer", true, true, callback);
      },
      function(callback) {
        userCreate(
          "bunny12@gmail.com",
          "Mike",
          "Hasbro",
          false,
          false,
          callback
        );
      },
      function(callback) {
        userCreate(
          "petra2205@yahoo.com",
          "Petra",
          "Lanchard",
          true,
          false,
          callback
        );
      },
      function(callback) {
        userCreate(
          "peter_smith@gmail.com",
          "Peter",
          "Smith",
          true,
          true,
          callback
        );
      },
      function(callback) {
        userCreate(
          "lola_ibers@yahoo.com",
          "Lola",
          "Ibers",
          false,
          false,
          callback
        );
      },
      function(callback) {
        userCreate(
          "the_big_faker@gmail.com",
          "Maria",
          "Notham",
          true,
          false,
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

function createMessages(cb) {
  async.parallel(
    [
      function(callback) {
        messageCreate(
          "Hello You",
          users[0],
          new Date(2018, 11, 24, 10, 33),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "I did nothing today",
          users[0],
          new Date(2018, 5, 6, 15, 41),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "My trip was the best",
          users[0],
          new Date(2019, 2, 17, 9, 33),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Do you know what happened?",
          users[1],
          new Date(2020, 3, 15, 22, 18),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "A big secret about...",
          users[2],
          new Date(2018, 10, 5, 10, 37),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Make more money online",
          users[2],
          new Date(2019, 4, 8, 6, 0),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Be on top of the world",
          users[3],
          new Date(2020, 1, 1, 14, 10),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "I am thinking if I should...",
          users[3],
          new Date(2019, 9, 13, 13, 13),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Have you seen the news today",
          users[3],
          new Date(2018, 3, 1, 17, 30),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Tina caused a scandal",
          users[4],
          new Date(2019, 8, 14, 10, 35),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Oh noooo!",
          users[4],
          new Date(2017, 11, 24, 7, 35),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Wow, I have never thought about that",
          users[5],
          new Date(2018, 6, 13, 9, 23),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Will you meet me tonight",
          users[5],
          new Date(2020, 2, 9, 11, 11),
          false,
          callback
        );
      },
      function(callback) {
        messageCreate(
          "Let's go out",
          users[5],
          new Date(2018, 4, 14, 16, 47),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          callback
        );
      },
      function(callback) {
        messageCreate(
          "What you did not expect from Peter",
          users[5],
          new Date(2019, 2, 18, 12, 22),
          false,
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers, createMessages],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Messages: " + messages);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
