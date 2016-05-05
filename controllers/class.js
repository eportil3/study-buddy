var mongoose = require('mongoose');
var User = require('../models/User');
var Class = require('../models/Class');

/**
 * POST /subscribe
 * Subscribe to a new class.
 */
exports.postSubscribeToClass = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.body.class);

  User
    .findById(req.user.id)
    .where('classes.classId').equals(id)
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        User.findById(req.user.id, function(err, user) {
          user.classes.push({ classId: id });
          user.save(function(err) {
            if (err) {
              return next(err);
            }

            Class.findById(id, function(err, result) {
              if (err) {
                return next(err);
              }

              result.subscribers.push({ userId: user._id });
              result.save(function(err) {
                if (err) {
                  return next(err);
                }

                res.redirect('/');
              });
            });
          });
        });
      } else {
        res.redirect('/');
      }
    });
};

/**
 * POST /unsubscribe/:subdoc_id
 * Unsubscribe from a class.
 */
exports.postUnsubscribeFromClass = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }

    var id = mongoose.Types.ObjectId(req.params.subdoc_id);
    var subdoc = user.classes.id(id);

    user.classes.pull({ _id: id });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      Class.update(
        { _id: subdoc.classId },
        { $pull: { subscribers: { userId: user._id }, onlineSubscribers: {userId: user._id} } },
        function(err, raw) {
          if (err) {
            return next(err);
          }
          console.log(raw);
          res.redirect('/');
        }
      );
    });
  });
};

/**
 * POST /online/:subdoc_id
 * Go online for a class.
 */

exports.postGoOnline = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }

    var id = mongoose.Types.ObjectId(req.params.subdoc_id);
    var subdoc = user.classes.id(id);

    subdoc.online = true;

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      Class.update(
        { _id: subdoc.classId },
        { $push: { onlineSubscribers: { userId: user._id } } },
        function(err, raw) {
          if (err) {
            return next(err);
          }
          console.log(raw);
          res.redirect('/');
        }
      );
    });
  });
}

/**
 * POST /offline/:subdoc_id
 * Go offline for a class.
 */

exports.postGoOffline = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }

    var id = mongoose.Types.ObjectId(req.params.subdoc_id);
    var subdoc = user.classes.id(id);

    subdoc.online = false;

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      Class.update(
        { _id: subdoc.classId },
        { $pull: { onlineSubscribers: { userId: user._id } } },
        function(err, raw) {
          if (err) {
            return next(err);
          }
          console.log(raw);
          res.redirect('/');
        }
      );
    });
  });
}


