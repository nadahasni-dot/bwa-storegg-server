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
  // viewEdit: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const nominal = await Nominal.findOne({ _id: id });

  //     const alertMessage = req.flash("alertMessage");
  //     const alertStatus = req.flash("alertStatus");
  //     const alert = { message: alertMessage, status: alertStatus };

  //     res.render("admin/nominal/edit", { nominal, alert });
  //   } catch (error) {
  //     console.log(error);
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", `danger`);

  //     console.log(error);
  //     res.redirect("/nominal/edit");
  //   }
  // },
  // actionEdit: async (req, res) => {
  //   const { id } = req.params;

  //   try {
  //     const { coinName, coinQuantity, price } = req.body;

  //     await Nominal.findOneAndUpdate(
  //       { _id: id },
  //       { coinName, coinQuantity, price }
  //     );

  //     req.flash("alertMessage", "Berhasil update data");
  //     req.flash("alertStatus", "success");

  //     res.redirect("/nominal");
  //   } catch (error) {
  //     console.log(error);
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", `danger`);

  //     res.redirect(`/nominal/edit/${id}`);
  //   }
  // },
  // actionDelete: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     await Nominal.deleteOne({ _id: id });

  //     req.flash("alertMessage", "Berhasil hapus data");
  //     req.flash("alertStatus", "success");

  //     res.redirect("/nominal");
  //   } catch (error) {
  //     console.log(error);
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", `danger`);

  //     console.log(error);
  //     res.redirect("/nominal");
  //   }
  // },
};
