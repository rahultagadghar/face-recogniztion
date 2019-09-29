const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
var r = new AWS.Rekognition();
const { log } = console;

function dis(err, data) {
  if (err) {
    log("Error Occurred: ", data);
    return;
  }

  log("Data", data);
}

// let params = {
//   CollectionId: "myphotos"
// };

// r.listCollections(dis);

// r.describeCollection(params, dis);

function indexImage(
  imageProperty = {},
  nameOfImage = "myphotoid",
  cId = "myphotos"
) {
  return new Promise((resolve, reject) => {
    let indexFaceParams = {
      CollectionId: cId,
      DetectionAttributes: ["DEFAULT"],
      ExternalImageId: nameOfImage
    };

    delete imageProperty.Attributes;

    indexFaceParams = { ...indexFaceParams, ...imageProperty };

    r.indexFaces(indexFaceParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function searchByFace(imageParam, cId = "myphotos") {
  return new Promise((resolve, reject) => {
    let params = {
      CollectionId: cId,
      FaceMatchThreshold: 95, // accuracy
      MaxFaces: 1
    };

    delete imageParam.Attributes;

    params = { ...params, ...imageParam };

    r.searchFacesByImage(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function deleteFaces(faceId = ["sting"], cId = "myphotos") {
  let params = {
    CollectionId: cId,
    FaceIds: [...faceId]
  };

  r.deleteFaces(params, dis);
}

// example // deleteFaces(["240e361b-db22-428b-89e7-d7558da87e9f"]);

function listFace(cId = "myphotos") {
  let listFaceParam = {
    CollectionId: cId,
    MaxResults: 20
  };

  r.listFaces(listFaceParam, dis);
}

listFace();

module.exports = { indexImage, searchByFace, deleteFaces };
