"use strict";

// updates a specified reservation

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const updateReservation = async (req, res) => {
    const {    
        _id,
        flight,
        seat,
        givenName,
        surname,
        email} = req.body
    const client = new MongoClient(MONGO_URI, options);

    console.log("hello")
    console.log(req.body._id)
  
    try {
      await client.connect();
      const db = client.db("Slingair");
      const oldReservation = await db.collection("reservations").findOne({ _id:  req.body._id});
      console.log(oldReservation)

      if(!oldReservation) {
        return res.status(404).json({ error: "Reservation not found :(" });
      }

      await db.collection("flights").updateOne({ flight: oldReservation.flight, "seats.id": oldReservation.seat }, {$set: {"seats.$.isAvailable": true}});
      await db.collection("flights").updateOne({ flight: req.body.flight, "seats.id": req.body.seat }, {$set: {"seats.$.isAvailable": false}});

      const newReservation = await db.collection("reservations").updateOne({ _id:  req.body._id},{$set: req.body});
      
      return res.status(200).json({status: 200, data: newReservation});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    } finally {
      client.close();
    }
};

module.exports = updateReservation;
