var express = require("express");
var router = express.Router();

// Require controller modules.
var user_controller = require("../controllers/userController");
var message_controller = require("../controllers/messageController");

/// USER ROUTES ///
// GET clubhouse home page.
router.get("/", user_controller.index);

// GET request for creating a User (sign-up). NOTE This must come before routes that display User (uses id).
router.get("/user/sign-up", user_controller.user_create_get);

// POST request for creating a User (sign-up)
router.post("/user/sign-up", user_controller.user_create_post);

// GET request for signing a user in
router.get("/user/log-in", user_controller.user_log_in_get);

// POST request for logging a user in
router.post("/user/log-in", user_controller.user_log_in_post);

// GET request for logging a user out
router.get("/user/log-out", isAuthenticated, user_controller.user_log_out_get);

// GET request for joining the club.
router.get(
  "/user/:id/join_club",
  isAuthenticated,
  user_controller.user_join_club_get
);

// POST request for joining the club.
router.post(
  "/user/:id/join_club",
  isAuthenticated,
  user_controller.user_join_club_post
);

// GET request for one User.
router.get("/user/:id", isAuthenticated, user_controller.user_detail);

// GET request for creating a Message
router.get(
  "/message/new",
  isAuthenticated,
  message_controller.message_create_get
);

// POST request for creating a Message
router.post(
  "/message/new",
  isAuthenticated,
  message_controller.message_create_post
);

// GET request to delete a Message.
router.get("/message/:id/delete", message_controller.message_delete_get);

// POST request to delete a Message.
router.post("/message/:id/delete", message_controller.message_delete_post);

// GET request for one Message.
router.get("/message/:id", isAuthenticated, message_controller.message_detail);

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect("/clubhouse/user/log-in");
}

module.exports = router;
