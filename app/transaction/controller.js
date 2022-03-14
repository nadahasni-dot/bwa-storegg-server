const Transaction = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const transactions = await Transaction.find().populate("player");

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
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Berhasil ubah status");
      req.flash("alertStatus", "success");

      res.redirect("/transaction");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/transaction");
    }
  },
};
