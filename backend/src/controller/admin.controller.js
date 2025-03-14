import cloudinary from "../lib/cloudinary.js";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
export const getAdmin = (req, res) => {
  res.send("admin route");
};
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading file to Cloudinary:", error);
    return null;
  }
};
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);
    //   req.body.audioUrl = audioUrl.secure_url;
    //   req.body.imageUrl = imageUrl.secure_url;
    const song = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId || null,
    });
    await song.save();
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song } });
    }
    res.status(201).json({ message: "success", song });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: id } });
    }
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new Album({ title, artist, releaseYear, imageUrl });
    await album.save();
    res.status(201).json({ message: "success", album });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Albums deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
