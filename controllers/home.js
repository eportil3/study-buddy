/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  if (!(req.user)) {
    return res.redirect('/landing');
  }
  res.render('home', {
    title: 'Home'
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