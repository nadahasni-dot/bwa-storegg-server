const mongoose = require("mongoose");

const playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: ["true", "Email harus diisi"],
    },
    name: {
      type: String,
      required: ["true", "Nama harus diisi"],
    },
    username: {
      type: String,
      required: ["true", "Username harus diisi"],
    },
    password: {
      type: String,
      required: ["true", "Password harus diisi"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: { type: String },
    fileName: { type: String },
    phoneNumber: {
      type: String,
      required: ["true", "Telepon harus diisi"],
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
