module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;
      res.render("index", { name, title: "Dashboard" });
    } catch (error) {
      console.log(error);
    }
  },
};
