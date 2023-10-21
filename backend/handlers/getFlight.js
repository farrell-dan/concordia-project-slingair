"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// returns all the seats on a specified flight
const getFlight = async (req, res) => {
        const client = new MongoClient (MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Slingair")
        const flight = req.params.flight
        
        const result = await db.collection("flights").findOne({flight});

        res.status(200).json({ status: 200, data: result.seats, message: `Seats available on flight ${flight}`})
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    } finally {
        client.close();
    }

};

module.exports = getFlight;
