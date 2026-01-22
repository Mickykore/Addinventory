const multer = require('multer');

// define file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
    },
});



// specify the file type to be uploaded
function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg') {
        // accept a file
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

// size formater
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
};


module.exports = { upload,
    fileSizeFormatter };