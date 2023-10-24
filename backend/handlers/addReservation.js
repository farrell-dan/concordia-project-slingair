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
  const { flight, seat, givenName, surname, email } = req.body;
  const reservationId = uuidv4(); // generates a random id for the reso
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Slingair");

    const flightData = await db.collection("flights").findOne({ _id: flight });

    if (flightData && flightData.seats.includes(seat)) {
      const existingReservation = await db
        .collection("reservations")
        .findOne({ flight, seat });

      if (existingReservation) {
        return res.status(400).json({ error: "Seat already reserved" });
      }

      await db
        .collection("flights")
        .updateOne({ _id: flight }, { $pull: { seats: seat } });

      const result = await db.collection("reservations").insertOne({
        _id: reservationId,
        flight,
        seat,
        givenName,
        surname,
        email,
      });

      return res.status(201).json({ _id: result.insertedId });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid seat number or flight code" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  } finally {
    client.close();
  }
};

module.exports = addReservation;
