const imagekit = require('imagekit');
const path = require('path');
require('dotenv').config();

// Initialize the ImageKit.io client with your API Key and API Secret
const imagekitClient = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
  });


exports.uploadFiles = async (req,res) =>{
    try {
        const response = await this.uploadFileToImagekit(req);
        res.json(response);
    } catch (error) {

      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Error uploading image' });
    }
}

exports.uploadFileToImagekit = async (req) =>{
    try{
        if(req.file && req.file.buffer){
            const fileBuffer = req.file.buffer;
            const originalFileName = req.file.originalname;

            // Get the file extension from the original file name
            const fileExtension = path.extname(originalFileName).toLowerCase();

            // List of allowed image and video file extensions
            const allowedExtensions = ['.jpg', '.jpeg', '.png','.svg', '.gif', '.webp', '.mp4', '.avi', '.mov'];

            if (allowedExtensions.includes(fileExtension)) {
                // It's an image or video; you can proceed to upload to ImageKit.io

                // Upload the image to ImageKit.io
                const response = await imagekitClient.upload({
                    file: fileBuffer,
                    fileName: `${Date.now()}--${originalFileName}`, // Provide a unique filename
                });

                return response;
              } else {
                // It's neither an image nor a video
                console.log('File type not allowed to upload on imagekit')
                return null;
              }
        }
        else{
            console.log("no file found while uploading to image kit.")
            return null
        }
        
    }
    catch(err){
        console.log(err,"erro uploading file in image kit.")
        return null;
    }
}