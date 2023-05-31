const { Author, Book } = require("../model/model");

const authorController = {
    // ADD AUTHOR
    addAuthor: async (req, res) => {
        // res.status(200).json(req.body); // gửi lại những gì client đã gửi
        try {
            const newAuthor = new Author(req.body);
            const savedAuthor = await newAuthor.save();
            res.status(200).json(savedAuthor);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // GET ALL AUTHORS
    getAllAuthors: async (req, res) => {
        try {
            const authors = await Author.find();
            res.status(200).json(authors);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // GET AN AUTHOR
    getAnAuthor: async (req, res) => {
        try {
            const theAuthor = await Author.findById(req.params.id).populate("books");
            res.status(200).json(theAuthor);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // UPDATE AN AUTHOR
    updateAnAuthor: async (req, res) => {
        try {
            const author = await Author.findById(req.params.id);
            await author.updateOne({$set: req.body});
            res.status(200).json(" Updated an author successfully! ");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // DELETE AN AUTHOR
    deleteAnAuthor: async (req, res) => {
        try {
            await Book.updateMany({author: req.params.id}, {author: null});
            await Author.findByIdAndDelete(req.params.id);
            res.status(200).json(" Deleted an author successfully! ");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = authorController;