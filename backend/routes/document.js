const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const Document = require('./models/Document');
const verifyToken = require('./middleware/verifyToken');

const router = express.Router();

// Configure multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Upload Document Route
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname, // Use the original file name
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    const document = new Document({
      userId: req.user.id,
      fileUrl: data.Location, // URL of the uploaded file
    });
    await document.save();
    res.status(201).send(document);
  } catch (err) {
    res.status(500).send({ message: 'Error uploading file', error: err });
  }
});

// Get User Documents Route
router.get('/', verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id });
    res.send(documents);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching documents', error: err });
  }
});

module.exports = router;