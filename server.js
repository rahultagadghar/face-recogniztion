const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
var r = new AWS.Rekognition();
const { log } = console;

// r.listCollections((err, data) => {
//   log(err);
//   log(data);
// });

function getEmotions(file = null) {
  return new Promise(async (resolve, reject) => {
    // var params = {
    //   Image: {
    //     S3Object: {
    //       Bucket: "testrahulimg",
    //       Name: "one.jpeg"
    //     }
    //   },
    //   Attributes: ["ALL"]
    // };

    r.detectFaces(await convertIntoBytes(file), function(err, data) {
      if (err) {
        reject(err);
      }
      // log(err);
      // log("full", data);

      // log("FaceDetail", data.FaceDetails[0].Emotions);
      resolve(data);
    });
  });
}

function convertIntoBytes(filePath = null) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    fs.readFile(filePath, "base64", (err, data) => {
      const buffer = new Buffer.from(data, "base64");

      let params = {
        Image: {
          Bytes: buffer
        },
        Attributes: ["ALL"]
      };
      log("params", params);
      resolve(params);
    });
  });
}

function cc() {
  let params = {
    CollectionId: "myphotos"
  };
  r.createCollection(params, (err, data) => {
    log("createCollection");
    log(err);
    log(data);

    /* { StatusCode: 200,
    CollectionArn: 'aws:rekognition:us-east-1:685577614147:collection/myphotos',
    FaceModelVersion: '4.0' }
    */
  });
}

module.exports = { convertIntoBytes, getEmotions };
