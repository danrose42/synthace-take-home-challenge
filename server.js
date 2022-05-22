const express = require("express");
const path = require("path");

const app = express();

app.use("/public", express.static(path.resolve(__dirname, "public")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running on 3000..."));