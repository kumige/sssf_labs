"use strict";
const stationModel = require("../models/station");

const station_list_get = async (req, res) => {
  try {
    let limit;
    let topRight;
    let bottomLeft;

    // check for limit set by user, default is 10
    if (req.query.limit == undefined) {
      limit = 10;
    } else {
      limit = req.query.limit;
    }

    // check for geospatial query
    if (req.query.topRight != undefined && req.query.bottomLeft != undefined) {
      topRight = JSON.parse(req.query.topRight);
      bottomLeft = JSON.parse(req.query.bottomLeft);
      getStationsWithLocation(res, limit, req.query, topRight, bottomLeft);
    } else {
      getStations(res, limit, req.query);
    }

    /*
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
    */
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

const station_post = async (req, res) => {
  const station = await stationModel.create({
    Title: "test station 2",
    AddressLine1: "test address",
    Town: "Helsinki",
    StateOrProvince: "Uusimaa",
    Postcode: "0161",
    Connections: [{ _id: "5e39eecac5598269fdad81a4", Quantity: 1 }],
    Locations: {
      type: "Point",
      coordinates: [
        60.3821946,
        25.036108 //first is longitude, second latitude
      ]
    }
  });
  res.send(`added station ${station.Title} with id ${station._id}`);
  console.log(station);
};

const station_modify = async (req, res) => {
  try {
    const station = await stationModel.findByIdAndUpdate(req.params.id, req.query);
    res.send(`modified station ${station.Title} with id ${station._id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("station_modify", error);
  }
};

const station_delete = async (req, res) => {
  try {
    const station = await stationModel.findByIdAndDelete(req.params.id);
    res.send(`deleted station ${station.Title} with id ${station._id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("station_modify", error);
  }
};

const getStations = async (res, limit, query) => {
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
      .skip(Number.parseInt(query.start))
      .limit(Number.parseInt(limit))
  );
};

const getStationsWithLocation = async (
  res,
  limit,
  query,
  topRight,
  bottomLeft
) => {
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
      .skip(Number.parseInt(query.start))
      .limit(Number.parseInt(limit))
      .where("Location")
      .within({
        box: [
          [topRight.lng, topRight.lat],
          [bottomLeft.lng, bottomLeft.lat]
        ]
      })
  );
};

module.exports = {
  station_list_get,
  station_get,
  station_post,
  station_modify,
  station_delete
};
