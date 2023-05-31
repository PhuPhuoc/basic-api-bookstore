const bookController = require("../controllers/bookController");
const router = require("express").Router();

// ADD BOOK
router.post("/", bookController.addBook);
// GET ALL BOOKS
router.get("/", bookController.getAllBooks);
// GET A BOOK
router.get("/:id", bookController.getABook);
// UPDATE A BOOK
router.put("/:id", bookController.updateABook);
// DELETE A BOOK
router.delete('/:id', bookController.deleteABook);

module.exports = router;