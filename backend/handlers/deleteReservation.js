"use strict";

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
    const { reservation } = req.params;
    const client = new MongoClient(MONGO_URI, options);
  
    try {
      await client.connect();
      const db = client.db("Slingair");
      const foundReservation = await db.collection("reservations").findOne({ _id:  reservation});
        console.log(foundReservation)
      if(!foundReservation) {
        return res.status(404).json({ error: "Reservation not found :(" });
      }

    

      const flight = await db.collection("flights").updateOne({ flight: foundReservation.flight, "seats.id": foundReservation.seat }, {$set: {"seats.$.isAvailable": true}});

      const deletedReservation = await db.collection("reservations").deleteOne({ _id: reservation });
      
      return res.status(200).json({status: 200, data: deletedReservation});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    } finally {
      client.close();
    }
};

module.exports = deleteReservation;