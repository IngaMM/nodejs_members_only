var Message = require("../models/message");
var User = require("../models/user");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.message_create_get = function(req, res, next) {
  res.render("message_form", { title: "New message", current_user: req.user });
};

exports.message_create_post = [
  // Validate fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 }),

  // Sanitize fields (using wildcard).
  sanitizeBody("*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Message object with escaped and trimmed data.
    var message = new Message({
      title: req.body.title,
      user: req.user._id,
      timestamp: Date.now(),
      content: req.body.content
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("message_form", {
        title: "New message",
        message: message,
        errors: errors.array(),
        current_user: req.user
      });
      return;
    } else {
      // Data from form is valid. Save message.
      message.save(function(err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new message record.
        res.redirect(message.url);
      });
    }
  }
];

exports.message_detail = function(req, res, next) {
  Message.findById(req.params.id)
    .populate("user")
    .exec(function(err, message) {
      if (err) {
        return next(err);
      }
      if (message == null) {
        // No results.
        var err = new Error("Message not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("message_detail", {
        title: "Message Detail",
        message: message,
        current_user: req.user
      });
    });
};

exports.message_delete_get = function(req, res, next) {
  if (!req.user || req.user.admin === false) {
    res.redirect("/");
  } else {
    Message.findById(req.params.id).exec(function(err, message) {
      if (err) {
        return next(err);
      }
      if (message == null) {
        // No results.
        res.redirect("/");
      }
      // Successful, so render.
      res.render("message_delete", {
        title: "Delete message",
        message: message
      });
    });
  }
};

exports.message_delete_post = function(req, res, next) {
  Message.findById(req.body.messageid).exec(function(err, results) {
    if (err) {
      return next(err);
    }
    // Success
    Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};
