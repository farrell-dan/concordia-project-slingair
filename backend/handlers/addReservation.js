"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// creates a new reservation
const addReservation = async (req, res) => {
    const { flightCode, passengerName, seatNumber } = req.body;
    const reservationId = uuidv4(); // generates a random id for the reso
    const client = new MongoClient(MONGO_URI, options);
  
    try {
      await client.connect();
      const db = client.db("Slingair");
  
      const flight = await db.collection("flights").findOne({ _id: flightCode });
  
      if (flight && flight.seats.includes(seatNumber)) {
        await db.collection("flights").updateOne({ _id: flightCode }, { $pull: { seats: seatNumber } });
  
        const result = await db.collection("reservations").insertOne({
          _id: reservationId,
          flightCode,
          passengerName,
          seatNumber,
        });
  
        res.status(201).json({ _id: result.insertedId });
      } else {
        res.status(400).json({ error: "Invalid seat number or flight code" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    } finally {
      client.close();
    }
  };
  
  module.exports = addReservation;