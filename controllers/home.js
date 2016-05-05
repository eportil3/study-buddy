var async = require('async');
var Class = require('../models/Class');
var User = require('../models/User');

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  if (!(req.user)) {
    return res.redirect('/landing');
  }

  Class.find({}, function(err, classList) {
    if (err) {
      return next(err);
    }

    var getOnlineSubscribersFromDb = function(subscribersObject, callback) {
      User.findById(subscribersObject.userId, function(err, result) {
        if (err) {
          return callback(err, null);
        }

        var returnDict = JSON.parse(JSON.stringify(result));

        returnDict['_id'] = subscribersObject._id;
        returnDict['userId'] = subscribersObject.userId;
        callback(null, returnDict);
      });
    };

    var getClassesFromDb = function(classesObject, callback) {
      Class.findById(classesObject.classId, function(err, result) {
        if (err) {
          return callback(err, null);
        }
        var returnDict = JSON.parse(JSON.stringify(result));
        returnDict['_id'] = classesObject._id;
        returnDict['classId'] = classesObject.classId;
        returnDict['online'] = classesObject.online;

        async.map(result.onlineSubscribers, getOnlineSubscribersFromDb, function(err, result2) {
          if (err) {
            return callback(err, null);
          }
          returnDict['onlineSubscribers'] = JSON.parse(JSON.stringify(result2));
          callback(null, returnDict);
        });
      });
    };

    async.map(req.user.classes, getClassesFromDb, function(err, result) {
      if (err) {
        return next(err);
      }

      res.render('home', {
        title: 'Home',
        classes: result,
        classList: classList
      });
    });
  });
};

/**
 * Get /landing
 * Landing page.
 */
exports.getLanding = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('landing', {
    title: 'Landing'
  });
};