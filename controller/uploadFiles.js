const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const imageUpload = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file Uploaded");
  }

  const questionImage = req.files.image;

  if (!questionImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an Image");
  }

  const result = await cloudinary.uploader.upload(questionImage.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  imageUpload,
};
