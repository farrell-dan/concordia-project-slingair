"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


// returns an array of all flight numbers
const getFlights = async (req, res) => {
        const client = new MongoClient (MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Slingair")
        const projection = { _id: 0, flight: 1 };
        const result = await db.collection("flights").find().project(projection).toArray();
        const flightKeys = result.map(flight => flight.flight);

        res.status(200).json({ status: 200, data: flightKeys, message: "Flights available"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    } finally {
        client.close();
    }
};

module.exports = getFlights;
