const Player = require("./model");
const Category = require("../category/model");
const Voucher = require("../voucher/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");

const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({ status: true, message: "success", data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res
          .status(404)
          .json({ status: false, message: "Voucher game tidak ditemukan" });
      }

      const payments = await Payment.find().populate("banks");

      res.status(200).json({
        status: true,
        message: "success",
        data: {
          detail: voucher,
          payments: payments,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();

      res
        .status(200)
        .json({ status: true, message: "success", data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("_id name category thumbnail user")
        .populate("category")
        .populate("user");

      if (!res_voucher) {
        return res
          .status(404)
          .json({ status: false, message: "voucher game tidak ditemukan" });
      }

      const res_nominal = await Nominal.findOne({ _id: nominal });

      if (!res_nominal) {
        return res
          .status(404)
          .json({ status: false, message: "nominal tidak ditemukan" });
      }

      const res_payment = await Payment.findOne({ _id: payment });

      if (!res_payment) {
        return res
          .status(404)
          .json({ status: false, message: "payment tidak ditemukan" });
      }

      const res_bank = await Bank.findOne({ _id: bank });

      if (!res_bank) {
        return res
          .status(404)
          .json({ status: false, message: "bank tidak ditemukan" });
      }

      let tax = (10 / 100) * res_nominal._doc.price;
      let value = res_nominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : "",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res
        .status(201)
        .json({ status: true, message: "success", data: transaction });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "1" },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        status: false,
        message: "success",
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const history = await Transaction.findOne({ _id: id });

      if (!history) {
        return res.status(404).json({
          status: false,
          message: "History tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: false,
        message: "success",
        data: history,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const categories = await Category.find();
      categories.forEach((category) => {
        count.forEach((data) => {
          if (data._id.toString() === category._id.toString()) {
            data.name = category.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({
        status: true,
        message: "success",
        data: history,
        count,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player.id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        avatar: req.player.avatar,
        phone_number: req.player.phoneNumber,
      };
      res.status(200).json({ status: true, message: "success", data: player });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { name = "", phoneNumber = "" } = req.body;
      const payload = {};

      if (name.length) {
        payload.name = name;
      }

      if (phoneNumber.length) {
        payload.phoneNumber = phoneNumber;
      }

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
            let player = await Player.findOne({ _id: req.player._id });
            let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            player = await Player.findOneAndUpdate(
              { _id: req.player._id },
              { ...payload, avatar: fileName },
              {
                new: true,
                runValidators: true,
              }
            );

            res.status(201).json({
              status: true,
              message: "success",
              data: {
                id: player._id,
                name: player.name,
                phoneNumber: player.phoneNumber,
                avatar: player.avatar,
              },
            });
          } catch (error) {
            res
              .status(500)
              .json({ message: error.message || "Internal server error" });
          }
        });
      } else {
        const player = await Player.findOneAndUpdate(
          { _id: req.player._id },
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(201).json({
          status: true,
          message: "success",
          data: {
            id: player._id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
};
