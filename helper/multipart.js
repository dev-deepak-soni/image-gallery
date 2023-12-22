const fs = require("fs");
const path = require("path");
const multer = require("multer");
/* -------------------------------------------------------------------------- */
/*                                   Multer                                   */
/* -------------------------------------------------------------------------- */

const uploadFiles = (folder) => {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const Storage = multer.diskStorage({
      destination: (req, file, cb) => {
        if (file) {
          cb(null, folder);
        }
      },

      filename: (req, file, cb) => {
        if (file) {
          const fileNameCheck = file.originalname.replace(
            /[-&\/\\#.,+()$~%'":*?<>{} ]/g,
            ""
          );
          cb(
            null,
            `${fileNameCheck}-${Date.now()}${path.extname(file.originalname)}`
          );
        }
      },
    });
    return multer({ storage: Storage });
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  uploadFiles,
};
