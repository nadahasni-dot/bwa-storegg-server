const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const nominal = await Nominal.find();

      res.render("admin/nominal/view_nominal", { nominal, alert });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/nominal/create", { alert });
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
//   viewEdit: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const category = await Category.findOne({ _id: id });

//       const alertMessage = req.flash("alertMessage");
//       const alertStatus = req.flash("alertStatus");
//       const alert = { message: alertMessage, status: alertStatus };

//       res.render("admin/category/edit", { category, alert });
//     } catch (error) {
//       console.log(error);
//       req.flash("alertMessage", `${error.message}`);
//       req.flash("alertStatus", `danger`);

//       console.log(error);
//       res.redirect("/category/edit");
//     }
//   },
//   actionEdit: async (req, res) => {
//     const { id } = req.params;

//     try {
//       const { name } = req.body;

//       await Category.findOneAndUpdate({ _id: id }, { name });

//       req.flash("alertMessage", "Berhasil update data");
//       req.flash("alertStatus", "success");

//       res.redirect("/category");
//     } catch (error) {
//       console.log(error);
//       req.flash("alertMessage", `${error.message}`);
//       req.flash("alertStatus", `danger`);

//       res.redirect(`/category/edit/${id}`);
//     }
//   },
//   actionDelete: async (req, res) => {
//     try {
//       const { id } = req.params;

//       await Category.deleteOne({ _id: id });

//       req.flash("alertMessage", "Berhasil hapus data");
//       req.flash("alertStatus", "success");

//       res.redirect("/category");
//     } catch (error) {
//       console.log(error);
//       req.flash("alertMessage", `${error.message}`);
//       req.flash("alertStatus", `danger`);

//       console.log(error);
//       res.redirect("/category");
//     }
//   },
};
