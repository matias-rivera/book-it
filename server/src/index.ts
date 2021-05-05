import express from "express";
import { listings } from "./listings";

const app = express();

const port = 5000;

app.use(express.json());

app.get("/", (_req, res) => {
    res.send("hello");
});

// Listing routes

app.get("/listings", (_req, res) => {
    return res.send(listings);
});

app.post("/listings-delete", (req, res) => {
    const id: string = req.body.id;

    for (let i = 0; i < listings.length; i++) {
        if (listings[i].id === id) {
            return res.send(listings.splice(i, 1));
        }
    }

    return res.send("failed");
});

app.listen(port, () => {
    console.log(`running on port ${port}`);
});
