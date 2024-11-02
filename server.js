const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

const RequestSchema = new mongoose.Schema({
  name: String,
  contact: String,
  resources: [String],
  details: String,
  latitude: Number,
  longitude: Number,
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", RequestSchema);

app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error al obtener solicitudes:", err);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

app.post("/requests", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { name, contact, resources, details, latitude, longitude } = req.body;
    const newRequest = new Request({
      name,
      contact,
      resources,
      details,
      latitude,
      longitude,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error al crear solicitud:", err);
    res.status(400).json({ error: "Error al crear solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
