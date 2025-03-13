const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const QuestionPaper = require("../models/QuestionPaper");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload & Store Question Paper
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { year, subject } = req.body;
        if (!year || !subject) return res.status(400).json({ error: "Year and subject are required" });

        const fileBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(fileBuffer);
        fs.unlinkSync(req.file.path); // Delete file after processing

        // Extract questions (assuming each question is on a new line)
        const extractedQuestions = data.text.split("\n").filter(line => line.trim().length > 10); 

        // Save to database
        const newPaper = new QuestionPaper({
            year,
            subject,
            questions: extractedQuestions,
        });

        await newPaper.save();
        res.json({ message: "Question paper uploaded successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Failed to process file" });
    }
});

// Predict Question Paper
router.get("/predict/:subject", async (req, res) => {
    try {
        const { subject } = req.params;

        // Get last 5 years' papers
        const pastPapers = await QuestionPaper.find({ subject }).sort({ year: -1 }).limit(5);
        if (pastPapers.length === 0) return res.status(400).json({ error: "No previous papers found" });

        // Combine all questions into one array
        let allQuestions = pastPapers.flatMap(paper => paper.questions);

        // Count occurrences of each question
        const questionCount = {};
        allQuestions.forEach(q => {
            questionCount[q] = (questionCount[q] || 0) + 1;
        });

        
        const predictedQuestions = Object.entries(questionCount)
            .sort((a, b) => b[1] - a[1])
            .slice(15, 100) 
            .map(q => q[0]); // Extract question text

        res.json({ predictedQuestions });

    } catch (error) {
        res.status(500).json({ error: "Prediction failed" });
    }
});

module.exports = router;
