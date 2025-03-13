const mongoose = require("mongoose");

const QuestionPaperSchema = new mongoose.Schema({
    year: Number,
    subject: String,
    questions: [String]
});

module.exports = mongoose.model("QuestionPaper", QuestionPaperSchema);
