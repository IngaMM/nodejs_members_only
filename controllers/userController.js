var User = require("../models/user");
var Message = require("../models/message");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const passport = require("passport");

exports.index = function(req, res) {
  Message.find({})
    .populate("user")
    .exec(function(err, messages) {
      if (err) {
        return next(err);
      }
      res.render("index", {
        title: "Welcome to the Clubhouse",
        current_user: req.user,
        messages: messages
      });
    });
};

exports.user_detail = function(req, res, next) {
  if (req.params.id !== req.user.id) {
    res.redirect("/");
  } else {
    async.parallel(
      {
        user: function(callback) {
          User.findById(req.params.id).exec(callback);
        },

        user_messages: function(callback) {
          Message.find({ user: req.params.id }).exec(callback);
        }
      },
      function(err, results) {
        if (err) {
          return next(err);
        }
        if (results.user == null) {
          // No results.
          var err = new Error("User not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render
        res.render("user_detail", {
          title: "User Detail",
          user: results.user,
          user_messages: results.user_messages,
          current_user: req.user
        });
      }
    );
  }
};

exports.user_create_get = function(req, res, next) {
  res.render("sign_up_form", { title: "Sign up" });
};

exports.user_create_post = [
  // Validate input data
  validator
    .body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must be specified.")
    .isEmail()
    .withMessage("Username must be a valid email adress"),

  validator
    .body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  validator
    .body("family_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),

  validator
    .body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must at least be 6 characters long."),

  validator
    .check(
      "passwordConfirmation",
      "Password confirmation field must have the same value as the password field"
    )
    .exists()
    .custom((value, { req }) => value === req.body.password),

  // Sanitize (escape) the input field.
  validator
    .sanitizeBody("username")
    .escape()
    .normalizeEmail(),
  validator.sanitizeBody("first_name").escape(),
  validator.sanitizeBody("family_name").escape(),
  validator.sanitizeBody("password").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        if (err) {
          err.msg = "Invalid Password.";
          return next(err);
        }
      }
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);

      // Create a genre object with escaped and trimmed data.
      var user = new User({
        username: req.body.username,
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        password: hashedPassword,
        member: false,
        admin: Boolean(req.body.admin)
      });

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("sign_up_form", {
          title: "Sign up",
          user: user,
          errors: errors.array()
        });
        return;
      } else {
        // Data from form is valid.
        // Check if User with same username already exists.
        User.findOne({ username: req.body.username }).exec(function(
          err,
          found_user
        ) {
          if (err) {
            return next(err);
          }

          if (found_user) {
            // User exists, render form again.
            res.render("sign_up_form", {
              title: "Sign up",
              user: user,
              errors: [{ msg: "Username is already taken" }]
            });
            return;
          } else {
            user.save(function(err) {
              if (err) {
                return next(err);
              }
              // User saved. Redirect to user detail page.
              req.login(user, function(err) {
                if (!err) {
                  res.redirect(user.url);
                } else {
                  if (err) {
                    return next(err);
                  }
                }
              });
            });
          }
        });
      }
    });
  }
];

exports.user_join_club_get = function(req, res, next) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (user == null) {
      // No results.
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render("user_join_club", {
      title: "Join the club",
      user: user,
      current_user: req.user
    });
  });
};

exports.user_join_club_post = function(req, res, next) {
  async.parallel(
    {
      user: function(callback) {
        User.findById(req.params.id).exec(callback);
      },

      user_messages: function(callback) {
        Message.find({ user: req.params.id }).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        // No results.
        var err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so compare passcodes
      if (req.body.passcode === process.env.CLUB_PASSCODE) {
        results.user.member = true;
        results.user.save(function(err) {
          if (err) {
            return next(err);
          }
          res.render("user_detail", {
            title: "User Detail",
            user: results.user,
            user_messages: results.user_messages,
            info: "You have succesfully joined the club.",
            current_user: req.user
          });
        });
      } else {
        res.render("user_detail", {
          title: "User Detail",
          user: results.user,
          user_messages: results.user_messages,
          info: "Passcode incorrect. You cannot join the club."
        });
      }
    }
  );
};

exports.user_log_in_get = function(req, res, next) {
  res.render("log_in_form", {
    title: "Log in",
    messages: req.session.messages || []
  });
  req.session.messages = [];
};

exports.user_log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/clubhouse/user/log-in",
  failureMessage: "Invalid username or password."
});

exports.user_log_out_get = function(req, res) {
  req.logout();
  res.redirect("/");
};
