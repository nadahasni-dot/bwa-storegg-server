const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: {
        type: String,
        require: [true, "Nama game harus diisi"],
      },
      category: {
        type: String,
        require: [true, "Kategori game harus diisi"],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        require: [true, "Nama koin harus diisi"],
      },
      coinQuantity: {
        type: String,
        require: [true, "Jumlah koin harus diisi"],
      },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, require: [true, "nama harus diisi"] },
      type: { type: String, require: [true, "tipe pembayaran harus diisi"] },
      bankName: { type: String, require: [true, "nama bank harus diisi"] },
      noRekening: {
        type: String,
        require: [true, "nomor rekening harus diisi"],
      },
    },
    name: {
      type: String,
      require: [true, "nama harus diisi"],
      minlength: [3, "panjang nama harus 3 - 255 karakter"],
      maxlength: [225, "panjang nama harus 3 - 255 karakter"],
    },
    accountUser: {
      type: String,
      require: [true, "nama harus diisi"],
      minlength: [3, "panjang nama harus 3 - 255 karakter"],
      maxlength: [225, "panjang nama harus 3 - 255 karakter"],
    },
    tax: { type: Number, default: 0 },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "nama player harus diisi"] },
      phoneNumber: {
        type: String,
        require: [true, "nomor telepon diisi"],
        minlength: [9, "panjang nama harus 9 - 13 karakter"],
        maxlength: [13, "panjang nama harus 9 - 13 karakter"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
