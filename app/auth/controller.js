const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

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
            const player = new Player({ ...payload, avatar: fileName });
            await player.save();
            delete player._doc.password;

            res
              .status(201)
              .json({ status: true, message: "success", data: player });
          } catch (error) {
            if (error && error.name === "ValidationError") {
              return res.status(422).json({
                error: 1,
                message: error.message || "Internal server error",
                fields: error.errors,
              });
            }

            next(error);
          }
        });
      } else {
        let player = new Player(payload);
        await player.save();
        delete player._doc.password;

        res
          .status(201)
          .json({ status: true, message: "success", data: player });
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: error.message || "Internal server error",
          fields: error.errors,
        });
      }

      next(error);
    }
  },
  signin: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const player = await Player.findOne({ email: email });

      if (player) {
        const checkPassword = bcrypt.compareSync(password, player.password);

        if (checkPassword) {
          const token = jwt.sign(
            {
              player: {
                id: player._id,
                username: player.username,
                email: player.email,
                nama: player.nama,
                phoneNumber: player.phoneNumber,
                avatar: player.avatar,
              },
            },
            config.jwtKey
          );

          return res
            .status(200)
            .json({ status: true, message: "success", data: { token } });
        } else {
          return res
            .status(403)
            .json({ status: false, message: "Password salah" });
        }
      } else {
        return res
          .status(403)
          .json({ status: false, message: "Email tidak terdaftar" });
      }
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(500).json({
          error: 1,
          message: error.message || "Internal server error",
          fields: error.errors,
        });
      }

      next(error);
    }
  },
};
