"use strict";

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// returns all reservations
const getReservations = async (req, res) => { 
    const client = new MongoClient(MONGO_URI, options);
  
    try {
      await client.connect();
      const db = client.db("Slingair");
      const reservations = await db.collection("reservations").find().toArray();
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    } finally {
      client.close();
    }
  };

module.exports = getReservations;
