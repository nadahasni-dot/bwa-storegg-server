const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "nama kategori harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
