const aws = require('aws-sdk');
const fs = require('fs');

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION
});
const s3 = new aws.S3();

const httpStatus = require('../constants/http_status');
const ACL_ACCESS = 'bucket-owner-full-control';

exports.uploadToS3 = (filePath, originalname) => {
  var params = {
    ACL: ACL_ACCESS,
    Bucket: process.env.BUCKET_NAME,
    Body: fs.createReadStream(filePath),
    Key: `${process.env.BUCKET_NAME}/${originalname}`
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
        reject(err);
      }

      if (data) {
        fs.unlinkSync(filePath); // Empty temp folder
        const locationUrl = data.Location;
        resolve(locationUrl);
      }
    });
  });
}

exports.downloadFromS3 = async (filePath) => {
  // const { filePath } = req.query;
  try {
    if (!filePath) {
      const error = new Error('Expected 1 argument found 0');
      error.statusCode = httpStatus.NOT_ACCEPTABLE;
      throw error;
    }

    //Get the Bucket and Key for the filePath passed
    const bucketDetails = await fetchBucketDetails(filePath);
    const s3Stream = await s3
      .getObject({ Bucket: bucketDetails[0], Key: bucketDetails[1] })
      .createReadStream();
    console.log("BUCKET_DETAILS", bucketDetails);
    // Listen for errors returned by the service
    s3Stream.on("error", function (err) {
      // NoSuchKey: The specified key does not exist
      const error = new Error(err.message);
      error.statusCode = httpStatus.NOT_FOUND;
      throw error;
    });

    const file = bucketDetails[1].split('/')[1];
    const res = fs.createWriteStream(file);

    return new Promise((resolve, reject) => {
      s3Stream
        .pipe(res)
        .on("error", function (err) {
          // capture any errors that occur when piping the read-stream to the response
          console.error("File Stream:", err);
          reject(err);
        })
        .on("close", function () {
          console.log("Done. :)" );
          resolve(file);
        });
    })
  } catch (error) {
    console.log('s3 download error', error)
    // throw error;
  }
}

async function fetchBucketDetails(s3FileUrl) {
  const bucketDetails = [];
  const newString = s3FileUrl.split(".")[0];
  const bucket = newString.split("//")[1];
  const key = s3FileUrl.split(".com/")[1];
  const newItems = [bucket, key];
  bucketDetails.push(...newItems);
  return bucketDetails;
}

