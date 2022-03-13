const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const voucher = await Voucher.find();

      res.render("admin/voucher/view_voucher", { voucher, alert });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const categories = await Category.find();
      const nominals = await Nominal.find();

      res.render("admin/voucher/create", { alert, categories, nominals });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/voucher/create");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let fileName = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${fileName}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);
        src.on("end", async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: fileName,
            });

            await voucher.save();

            req.flash("alertMessage", "Berhasil tambah nominal");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (error) {
            console.log(error);

            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", `danger`);

            res.redirect("/voucher/create");
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });

        await voucher.save();

        req.flash("alertMessage", "Berhasil tambah nominal");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      res.redirect("/voucher/create");
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
