const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CITY_FILE = path.join(__dirname, "cities.json");

//api to get all cities
app.get("api/cities", (req, res) => {
    fs.readFile(CITY_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({error: "failed to read file"});
        res.json(JSON.parse(data));
    });
});

//api to add new cities
app.post("api/add-city", (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).json({error: "City name cannot be empty"});

    fs.readFile(CITY_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({error: "Failed to read the file"});

        let cities = JSON.parse(data);
        if (!cities.includes(city)) cities.push(city);

        fs.writeFile(CITY_FILE, JSON.stringify(cities, null, 2), (err) => {
            if (err) return res.status(500).json({error: "Failed to write to file"});
            res.json({success: true, cities});
        });
    });
});

const PORT=5000;
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});