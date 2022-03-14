const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const nominal = await Nominal.find();

      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
        name,
        title: "Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/nominal/create", { alert, name, title: "Nominal" });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal/create");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;
      const nominal = Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Berhasil tambah nominal");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal/create");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;

      const { id } = req.params;
      const nominal = await Nominal.findOne({ _id: id });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/nominal/edit", {
        nominal,
        alert,
        name,
        title: "Nominal",
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal/edit");
    }
  },
  actionEdit: async (req, res) => {
    const { id } = req.params;

    try {
      const { coinName, coinQuantity, price } = req.body;

      await Nominal.findOneAndUpdate(
        { _id: id },
        { coinName, coinQuantity, price }
      );

      req.flash("alertMessage", "Berhasil update data");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect(`/nominal/edit/${id}`);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Nominal.deleteOne({ _id: id });

      req.flash("alertMessage", "Berhasil hapus data");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal");
    }
  },
};
