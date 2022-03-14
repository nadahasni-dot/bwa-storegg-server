const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const transactions = await Transaction.find();

      res.render("admin/transaction/view_transaction", {
        transactions,
        alert,
        name,
        title: "Transaksi",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/transaction");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/category/create", { alert, name, title: "Kategori" });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/category/create");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      const category = Category({ name });
      await category.save();

      req.flash("alertMessage", "Berhasil tambah kategori");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/category/create");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/category/edit", {
        category,
        alert,
        name,
        title: "Kategori",
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/category/edit");
    }
  },
  actionEdit: async (req, res) => {
    const { id } = req.params;

    try {
      const { name } = req.body;

      await Category.findOneAndUpdate({ _id: id }, { name });

      req.flash("alertMessage", "Berhasil update data");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect(`/category/edit/${id}`);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.deleteOne({ _id: id });

      req.flash("alertMessage", "Berhasil hapus data");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/category");
    }
  },
};
