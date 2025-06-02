const Song = require("../models/Song");
const User = require("../models/User");
const cloudinary = require("../../utils/cloudinary");

class SongsController {
  async showSongsByArtist(req, res) {
    try {
      const { artistId } = req.params;
      const songs = await Song.find({ artistId })
        .populate("artistId", "name genre image_artist") // Lấy thông tin artist
        .exec();
      res.status(200).json({ songs });
    } catch (err) {
      console.log(err);
    }
  }
  async addSong(req, res) {
    try {
      const { artistId } = req.params;
      const { name, composer, imageSong, duration } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ err: "No audio file uploaded" });
      }
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const steam = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "songs",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          steam.end(fileBuffer);
        });
      };
      const result = await streamUpload(file.buffer);

      const newSong = new Song({
        name,
        composer,
        imageSong,
        url: result.secure_url,
        duration,
        artistId,
      });
      await newSong.save();
      res.status(201).json({ message: "Song added successfully" });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new SongsController();
