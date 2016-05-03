/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * Get /landing
 * Landing page.
 */
exports.getLanding = function(req, res) {
  res.render('landing', {
    title: 'Landing'
  });
};