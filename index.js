const app = require("express")();
const { log } = console;
const cors = require("cors");
const port = 3000;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const server = require("./server");
const compare = require("./compare");

app.listen(port, () => log("server on : ", port));
app.use(cors());
log("Env", process.env.NODE_ENV);

app.get("/", (req, res, next) => {
  try {
    send(res, { data: "Server v1" });
  } catch (error) {
    next(error);
  }
});

app.post("/fileUpload", upload.single("avatar"), async (req, res, next) => {
  try {
    log("req.File", req.file);
    let data = await server.getEmotions(req.file.path);
    send(res, data);
  } catch (error) {
    next(error);
  }
});

app.post("/indexImage", upload.single("avatar"), async (req, res, next) => {
  try {
    log("req.query", req.query);
    log("req.File", req.file);
    let { nameOfImage } = req.query;
    let imageRef = await server.convertIntoBytes(req.file.path);
    log("ImageRef", imageRef);
    let indexedImage = await compare.indexImage(imageRef, nameOfImage);
    log("indexedImage", indexedImage);
    await send(res, indexedImage);
  } catch (error) {
    next(error);
  }
});

app.post("/compareImage", upload.single("avatar"), async (req, res, next) => {
  try {
    log("req.File", req.file);
    let imageRef = await server.convertIntoBytes(req.file.path);
    log("ImageRef", imageRef);
    let SearchImage = await compare.searchByFace(imageRef);
    log("SearchImage", SearchImage);
    await send(res, SearchImage);
  } catch (error) {
    next(error);
  }
});

function send(res, data) {
  res.send({
    status: true,
    message: `success`,
    data
  });
}

app.use((err, req, res, next) => {
  log(err);
  res.send({
    status: false,
    message: err.message
  });
});
