"use strict";

const { MongoClient, ObjectId } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// returns a single reservation

const getSingleReservation = async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Slingair");
    const objectId = new ObjectId(id);
    const reservation = await db
      .collection("reservations")
      .findOne({ _id: objectId });

    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: "Reservation not found :(" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  } finally {
    client.close();
  }
};

module.exports = getSingleReservation;
