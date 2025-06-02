const Artist = require("../models/Artist");
class HomeController {
  async showArtist(req, res) {
    try {
      let limit = parseInt(req.params.limit) || 6;
      limit = limit > 20 ? 20 : limit;
      const artist = await Artist.aggregate([
        { $sort: { name: 1 } } /*{ $limit: limit }*/,
      ]);
      res.status(200).json(artist);
    } catch (err) {
      res.status(500).json({ message: "Error creating artist", err });
    }
  }
  async randomArtist(req, res) {
    try {
      let limit = parseInt(req.params.limit) || 10;
      // limit = limit > 20 ? 20 : limit;
      const artist = await Artist.aggregate([{ $sample: { size: limit } }]);
      res.status(200).json(artist);
    } catch (err) {
      res.status(500).json({ message: "Error random artist", err });
    }
  }
  async showRapper(req, res) {
    try {
      // let limit = parseInt(req.params.limit) || 6;
      // limit = limit > 20 ? 20 : limit;
      const artist = await Artist.aggregate([
        { $match: { genre: "Rapper" } },
        // { $limit: limit },
      ]);
      res.status(200).json(artist);
    } catch (err) {
      res.status(500).json({ message: "Error show rapper", err });
    }
  }
  async showSinger(req, res) {
    try {
      // let limit = parseInt(req.params.limit) || 6;
      // limit = limit > 20 ? 20 : limit;
      const artist = await Artist.aggregate([
        { $match: { genre: "Singer" } },
        // { $limit: limit },
      ]);
      res.status(200).json(artist);
    } catch (err) {
      res.status(500).json({ message: "Error show singer", err });
    }
  }
  async addArtist(req, res) {
    try {
      const { artist, image_artist, name, genre, imageProfileArtist } =
        req.body;
      const hadArtist = await Artist.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (hadArtist) {
        return res.status(400).json({ message: "Artist already exists" }); // Return error if artist already exists in the database.  // Note: This is a basic example, in a real-world scenario you might want to handle this differently.  // For example, you might want to update the existing artist instead of creating a new one.  // Also, you might want to sanitize the input data to prevent potential security vulnerabilities.  // You should also add more validation checks depending on your specific requirements.  // You should also consider using a database transaction to ensure data integrity in case of errors.  // You should also consider using a validation library like Joi for input validation.  // You should also consider using a rate limiting middleware to prevent abuse.  // You should also consider using a middleware for authentication and authorization.  // You should also consider using a middleware for logging and auditing.  // You should also consider using a middleware for
      }
      const newArtist = new Artist({
        artist,
        image_artist,
        name,
        genre,
        imageProfileArtist,
      });
      await newArtist.save();
      res
        .status(201)
        .json({ message: "Artist created successfully", artist: newArtist });
    } catch (err) {
      res.status(500).json({ message: "Error creating artist", err });
    }
  }
  async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const { artist, image_artist, name, genre, imageProfileArtist } =
        req.body;
      const updatedArtist = await Artist.updateOne(
        { _id: id },
        { artist, image_artist, name, genre, imageProfileArtist }
      );
      res.status(200).json({
        message: "Artist updated successfully",
        artist: updatedArtist,
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating artist", err });
    }
  }
  async forceDeteted(req, res) {
    try {
      const { id } = req.params;
      const deletedArtist = await Artist.delete({ _id: id });
      res.status(200).json({
        message: "Artist deleted successfully",
        artist: deletedArtist,
      });
    } catch (err) {
      res.status(500).json({ message: "Error deleting artist", err });
    }
  }
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const deletedArtist = await Artist.deleteOne({ _id: id });
      res.status(200).json({
        message: "Artist deleted successfully",
        artist: deletedArtist,
      });
    } catch (err) {
      res.status(500).json({ message: "Error deleting artist", err });
    }
  }
  async getArtistPopular(req, res) {
    try {
      const { id } = req.params;
      const getArtistPopular = await Artist.findOne({ _id: id });
      res.status(200).json({ artist: getArtistPopular });
    } catch (err) {
      res.status(500).json({ message: "Error artist found", err });
    }
  }
}
module.exports = new HomeController();
