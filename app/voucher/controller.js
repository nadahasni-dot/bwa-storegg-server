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

      const vouchers = await Voucher.find()
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/view_voucher", { vouchers, alert });
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

            req.flash("alertMessage", "Berhasil tambah voucher");
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

        req.flash("alertMessage", "Berhasil tambah voucher");
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
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const categories = await Category.find();
      const nominals = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals");

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/voucher/edit", {
        voucher,
        categories,
        nominals,
        alert,
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/voucher/edit");
    }
  },
  actionEdit: async (req, res) => {
    const { id } = req.params;

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
            const voucher = await Voucher.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }
            voucher.name = name;
            voucher.category = category;
            voucher.nominals = nominals;
            voucher.thumbnail = fileName;

            await voucher.save();

            req.flash("alertMessage", "Berhasil ubah voucher");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (error) {
            console.log(error);

            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", `danger`);

            res.redirect(`/voucher/edit/${id}`);
          }
        });
      } else {
        const voucher = await Voucher.findOne({ _id: id });
        voucher.name = name;
        voucher.category = category;
        voucher.nominals = nominals;

        await voucher.save();

        req.flash("alertMessage", "Berhasil ubah voucher");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
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

      const voucher = await Voucher.findOneAndRemove({ _id: id });

      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash("alertMessage", "Berhasil hapus data");
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/voucher");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });

      let status = voucher.status === "Y" ? "N" : "Y";
      voucher.status = status;

      await voucher.save();

      req.flash("alertMessage", `Berhasil merubah status ${voucher.name}`);
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", `danger`);

      console.log(error);
      res.redirect("/voucher");
    }
  },
};
