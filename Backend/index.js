import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json()); // for JSON bodies

app.get("/", (req, res) => {
    res.send("Backend is running! 🚀");
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
