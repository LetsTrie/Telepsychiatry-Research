module.exports.getForum = async (req, res) => {
  return res.render('forum');
};

module.exports.getSingleDiscussion = async (req, res) => {
  return res.render('singleDiscussion');
};

module.exports.getNewDiscussion = async (req, res) => {
  return res.render('createDiscussion');
};
