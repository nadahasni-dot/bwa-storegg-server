const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", { alert });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (user) {
        if (user.status === "Y") {
          const checkPassword = await bcrypt.compare(password, user.password);

          if (checkPassword) {
            req.session.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              status: user.status,
            };

            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", `Password salah`);
            req.flash("alertStatus", `danger`);

            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", `User tidak aktif`);
          req.flash("alertStatus", `danger`);

          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Email tidak ditemukan`);
        req.flash("alertStatus", `danger`);

        res.redirect("/");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect("/");
    }
  },
  actionLogout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect("/");
    }
  },
};
