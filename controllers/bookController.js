const { Book, Author } = require("../model/model");

const bookController = {
    // ADD BOOK
    addBook: async (req, res) => {
        try {
            const newBook = new Book(req.body);
            const savedBook = await newBook.save();
            if (req.body.author) {
                const theAuthor = Author.findById(req.body.author);
                await theAuthor.updateOne({ $push: { books: savedBook._id } });
            }
            res.status(200).json(savedBook);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // GET ALL BOOKS
    getAllBooks: async (req, res) => {
        try {
            const books = await Book.find();
            res.status(200).json(books);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // GET A BOOK
    getABook: async (req, res) => {
        try {
            const aBook = await Book.findById(req.params.id).populate("author");
            res.status(200).json(aBook);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // UPDATE A BOOK
    updateABook: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            await book.updateOne({ $set: req.body });
            res.status(200).json(" Updated successfully! ");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // DELETE A BOOK
    deleteABook: async (req, res) => {
        try {
            await Author.updateOne({ books: req.params.id }, { $pull: { books: req.params.id } });
            await Book.findByIdAndDelete(req.params.id);
            res.status(200).json(" Deleted a book successfully! ");
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = bookController;