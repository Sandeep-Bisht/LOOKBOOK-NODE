const imagekit = require('imagekit');
const path = require('path');

const multer = require('multer');

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.upload = upload;

// Initialize the ImageKit.io client with your API Key and API Secret
const imagekitClient = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "Checkyourenvfile",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "Checkyourenvfile",
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT || "Checkyourenvfile",
  });


exports.uploadFileToImagekit = async (req) =>{
    try{

        if(req.file && req.file.buffer){
            const fileBuffer = req.file.buffer;
            const originalFileName = req.file.originalname;

            // Get the file extension from the original file name
            const fileExtension = path.extname(originalFileName).toLowerCase();

            // List of allowed image and video file extensions
            const allowedExtensions = ['.jpg', '.jpeg', '.png','.svg', '.gif', '.webp', '.mp4', '.avi', '.mov','.pdf'];

            if (allowedExtensions.includes(fileExtension)) {
                // It's an image or video; you can proceed to upload to ImageKit.io

                // Upload the image to ImageKit.io
                const response = await imagekitClient.upload({
                    file: fileBuffer,
                    fileName: `${Date.now()}--${originalFileName}`, // Provide a unique filename
                });

                return {...response,mimetype:req.file.mimetype};
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

exports.uploadFilesToImagekit = async (req) => {
    try {
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const responses = [];

            for (const file of req.files) {
                if (file.buffer) {
                    const fileBuffer = file.buffer;
                    const originalFileName = file.originalname;
                    const fileExtension = path.extname(originalFileName).toLowerCase();
                    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp', '.mp4', '.avi', '.mov','.pdf'];

                    if (allowedExtensions.includes(fileExtension)) {
                        try {
                            var response = await imagekitClient.upload({
                                file: fileBuffer,
                                fileName: `${Date.now()}--${originalFileName}`, // Provide a unique filename
                            });
                            response = {...response,mimetype:file.mimetype}
                            responses.push({ fieldName: file.fieldname, response });
                        } catch (err) {
                            console.log(`Error uploading ${originalFileName} to ImageKit: ${err}`);
                        }
                    } else {
                        console.log(`File type not allowed to upload on ImageKit: ${originalFileName}`);
                    }
                } else {
                    console.log('Invalid file found while uploading to ImageKit');
                }
            }

            if (responses.length === 0) {
                console.log('No valid files to upload.');
                return null;
            }

            return responses;
        } else {
            console.log('No files found while uploading to ImageKit.');
            return null;
        }
    } catch (err) {
        console.log('Error uploading files to ImageKit:', err);
        return null;
    }
}
