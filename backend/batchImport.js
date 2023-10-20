require("dotenv").config();
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { flights, reservations } = require("./data.js");

const flightsFormatted = Object.keys(flights).map((flightCode) => ({
  _id: flightCode,
  flight: flightCode,
  seats: flights[flightCode],
}));

const batchImportFlights = async () => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("flights").insertMany(flightsFormatted);
    console.log("It worked!");
  } catch (error) {
    console.error("Try again...");
  } finally {
    client.close();
  }
};

const batchImportReservations = async () => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("reservations").insertMany(reservations);
    console.log("It worked!");
  } catch (error) {
    console.error("Try again...");
  } finally {
    client.close();
  }
};

batchImportReservations();
batchImportFlights();
