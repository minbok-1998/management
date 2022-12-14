import express from "express";
import multer from "multer";
import connection from "../config";
import authJWT from "../middleware/authJWT";

const router = express.Router();
const upload = multer({ dest: "./upload" });

router.get("/", async (req, res) => {
  let sql = "SELECT * FROM CUSTOMER WHERE isDeleted = 0";
  try {
    const result = await connection.query(sql);
    res.send(result[0]);
  } catch (err) {
    res.send("err");
  }
});

router.get("/:id", async (req, res) => {
  let sql = "SELECT * FROM CUSTOMER WHERE id = ?";
  const params = [req.params.id];

  try {
    const result = await connection.query(sql, params);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", authJWT, upload.single("image"), async (req, res) => {
  let sql = "INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)";
  let image = "/image/" + req.file.filename;
  let { name, birthday, gender, job } = req.body;
  let params = [image, name, birthday, gender, job];

  try {
    const result = await connection.query(sql, params);

    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(`log ${err}`);
    res.send(null);
  }
});

router.delete("/:id", authJWT, async (req, res) => {
  let sql = "UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?";
  let params = [req.params.id];

  try {
    const result = await connection.query(sql, params);
    res.send(result);
  } catch (err) {
    // res.status(401).json({ error: "로그인이 필요합니다!" });
  }
});

router.put("/:id", authJWT, upload.single("image"), async (req, res) => {
  const id = req.params.id;
  let sql = `UPDATE CUSTOMER SET image = ?,name = ?,birthday = ?,gender = ?,job = ? WHERE id = ?`;
  let { image, name, birthday, gender, job } = req.body;
  let imagePath = "/image/" + req.file?.filename;
  if (!req?.file?.filename) {
    imagePath = image;
  }
  let params = [imagePath, name, birthday, gender, job, id];

  try {
    const result = await connection.query(sql, params);
    res.send(result);
  } catch (err) {
    res.send(null);
  }
});

module.exports = router;
