const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const bank = await Bank.find();

      res.render("admin/bank/view_bank", { bank, alert });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/bank/create", { alert });
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
      const { name, nameBank, noRekening } = req.body;
      const bank = Bank({ name, nameBank, noRekening });
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
  //   viewEdit: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const nominal = await Nominal.findOne({ _id: id });

  //       const alertMessage = req.flash("alertMessage");
  //       const alertStatus = req.flash("alertStatus");
  //       const alert = { message: alertMessage, status: alertStatus };

  //       res.render("admin/nominal/edit", { nominal, alert });
  //     } catch (error) {
  //       console.log(error);
  //       req.flash("alertMessage", `${error.message}`);
  //       req.flash("alertStatus", `danger`);

  //       console.log(error);
  //       res.redirect("/nominal/edit");
  //     }
  //   },
  //   actionEdit: async (req, res) => {
  //     const { id } = req.params;

  //     try {
  //       const { coinName, coinQuantity, price } = req.body;

  //       await Nominal.findOneAndUpdate(
  //         { _id: id },
  //         { coinName, coinQuantity, price }
  //       );

  //       req.flash("alertMessage", "Berhasil update data");
  //       req.flash("alertStatus", "success");

  //       res.redirect("/nominal");
  //     } catch (error) {
  //       console.log(error);
  //       req.flash("alertMessage", `${error.message}`);
  //       req.flash("alertStatus", `danger`);

  //       res.redirect(`/nominal/edit/${id}`);
  //     }
  //   },
  //   actionDelete: async (req, res) => {
  //     try {
  //       const { id } = req.params;

  //       await Nominal.deleteOne({ _id: id });

  //       req.flash("alertMessage", "Berhasil hapus data");
  //       req.flash("alertStatus", "success");

  //       res.redirect("/nominal");
  //     } catch (error) {
  //       console.log(error);
  //       req.flash("alertMessage", `${error.message}`);
  //       req.flash("alertStatus", `danger`);

  //       console.log(error);
  //       res.redirect("/nominal");
  //     }
  //   },
};
