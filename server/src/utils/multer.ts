import multer from "multer";
// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "images/"); // Destination folder to save the uploaded files
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, `CHATS-SPHERE-IMG-${Date.now()}.${file.mimetype.split("/")[1]}`); // Use the original file name as the saved file name
  },
});

// File filter function
const fileFilter = (req: any, file: any, cb: any) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject the file
  }
};
// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
