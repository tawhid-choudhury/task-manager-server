require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
// MIDDLE_WARES
app.use(cors());
app.use(express.json());
