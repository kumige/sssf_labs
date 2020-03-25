"use strict";
const stationModel = require("../models/station");

const station_list_get = async (req, res) => {
  try {

    let limit
    if(req.query.limit == undefined) {
      limit = 10
    } else {
      limit = req.query.limit
    }
    
    const topRight = JSON.parse(req.query.topRight)
    const bottomLeft = JSON.parse(req.query.bottomLeft)

    const geoPolygon = {
      type: 'Polygon',
      coordinates: [[
        [topRight.lat, topRight.lng],
        [bottomLeft.lat, topRight.lng],
        [bottomLeft.lat, bottomLeft.lng], 
        [topRight.lat, bottomLeft.lng],
        [topRight.lat, topRight.lng]
      ]]
    }
    
    console.log(geoPolygon.coordinates)
    res.json(
      await stationModel
        .find()
        .populate({
          path: "Connections",
          populate: { path: "ConnectionTypeID" }
        })
        .populate({
          path: "Connections",
          populate: { path: "LevelID" }
        })
        .populate({
          path: "Connections",
          populate: { path: "CurrentTypeID" }
        })
        .skip(Number.parseInt(req.query.start))
        .limit(Number.parseInt(limit))
        .where("Location")
        //.within(geoPolygon)
        .within({ box: [[topRight.lng, topRight.lat], [bottomLeft.lng, bottomLeft.lat]] })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("station_list_get", error);
  }
};

const station_get = async (req, res) => {
  try {
    res.json(await stationModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("station_list_get", error);
  }
};

const station_post = (req, res) => {
  res.send("With this endpoint you can add stations");
};

module.exports = {
  station_list_get,
  station_get,
  station_post
};
