const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const banks = await Bank.find();

      res.render("admin/bank/view_bank", { banks, alert, name, title: "Bank" });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/bank/create", { alert, name, title: "Bank" });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank/create");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, noRekening } = req.body;
      const bank = Bank({ name, bankName, noRekening });
      await bank.save();

      req.flash("alertMessage", "Berhasil tambah bank");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank/create");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/bank/edit", { bank, alert, name, title: "Bank" });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank/edit");
    }
  },
  actionEdit: async (req, res) => {
    const { id } = req.params;

    try {
      const { name, bankName, noRekening } = req.body;

      await Bank.findOneAndUpdate({ _id: id }, { name, bankName, noRekening });

      req.flash("alertMessage", "Berhasil update data");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect(`/bank/edit/${id}`);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Bank.deleteOne({ _id: id });

      req.flash("alertMessage", "Berhasil hapus data");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank");
    }
  },
};
