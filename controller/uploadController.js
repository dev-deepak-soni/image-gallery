const File = require("../model/uploadModel");
exports.upload = async (req, res) => {
    try {
      const { filename, originalname, mimetype, size } = req.file;
  
      const newFile = new File({
        filename,
        originalname,
        mimetype,
        size,
      });
  
      await newFile.save();
  
      res.status(201).json({
        status: 200,
        success: true,
        message: "Image uploaded successfully",
        file: newFile,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
      });
    }
  };
  exports.showFiles = async (req, res) => {
    try {
      const files = await File.find();
  
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Data found',
        files,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: 'Internal server error',
      });
    }
  };