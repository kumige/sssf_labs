"use strict";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt
} = require("graphql");

const connection = require("../models/connection.js");
const connectionTypeId = require("../models/connectionType.js");
const currentType = require("../models/currentType.js");
const level = require("../models/level.js");
const station = require("../models/station.js");

const stationType = new GraphQLObjectType({
  name: "station",
  description: "Station info",
  fields: () => ({
    Title: { type: GraphQLString },
    AddressLine1: { type: GraphQLString },
    Town: { type: GraphQLString },
    StateOrProvince: { type: GraphQLString },
    Postcode: { type: GraphQLString },
    Connections: {
      type: connectionType,
      resolve: async (parent, args) => {
        try {
          return await connection.findById(parent.Connections);
        } catch (error) {
          return new Error(error.message);
        }
      }
    },
    Location: {
      type: new GraphQLObjectType({
        name: "loc",
        fields: () => ({
          type: { type: GraphQLString },
          coordinates: {
            type: new GraphQLList(GraphQLString) //first is longitude, second latitude
          }
        })
      })
    }
  })
});

const connectionType = new GraphQLObjectType({
  name: "connections",
  description: "List of the stations connections",
  fields: () => ({
    ConnectionTypeID: {
      type: connectionTypeType,
      resolve: async (parent, args) => {
        try {
          return await connectionTypeId.findById(parent.ConnectionTypeID);
        } catch (error) {
          return new Error(error.message);
        }
      }
    },
    LevelID: {
      type: levelType,
      resolve: async (parent, args) => {
        try {
          return await level.findById(parent.LevelID);
        } catch (error) {
          return new Error(error.message);
        }
      }
    },
    CurrentTypeID: {
      type: currentTypeType,
      resolve: async (parent, args) => {
        try {
          return await currentType.findById(parent.CurrentTypeID);
        } catch (error) {
          return new Error(error.message);
        }
      }
    },
    Quantity: { type: GraphQLString }
  })
});

const connectionTypeType = new GraphQLObjectType({
  name: "connectiontype",
  description: "Describes the connection type",
  fields: () => ({
    id: { type: GraphQLID },
    FormalName: { type: GraphQLString },
    Title: { type: GraphQLString }
  })
});

const connectionTypeTypeInput = new GraphQLInputObjectType({
  name: "connectiontypeinput",
  description: "defines connection type input",
  fields: () => ({
    id: { type: GraphQLID },
    FormalName: { type: GraphQLString },
    Title: { type: GraphQLString }
  })
});

const levelType = new GraphQLObjectType({
  name: "level",
  description: "Describes the connection level",
  fields: () => ({
    id: { type: GraphQLID },
    Comments: { type: GraphQLString },
    IsFastChargeCapable: { type: GraphQLBoolean },
    Title: { type: GraphQLString }
  })
});

const levelTypeInput = new GraphQLInputObjectType({
  name: "levelinput",
  description: "defines level input",
  fields: () => ({
    id: { type: GraphQLID },
    Comments: { type: GraphQLString },
    IsFastChargeCapable: { type: GraphQLBoolean },
    Title: { type: GraphQLString }
  })
});

const currentTypeType = new GraphQLObjectType({
  name: "currenttype",
  description: "Describes the current type",
  fields: () => ({
    id: { type: GraphQLID },
    Description: { type: GraphQLString },
    Title: { type: GraphQLString }
  })
});

const currentTypeTypeInput = new GraphQLInputObjectType({
  name: "currenttypeinput",
  description: "defines current type input",
  fields: () => ({
    id: { type: GraphQLID },
    Description: { type: GraphQLString },
    Title: { type: GraphQLString }
  })
});

const connectionInputType = new GraphQLInputObjectType({
  name: "connectionsinput",
  description: "defines connection input",
  fields: () => ({
    ConnectionTypeID: {
      type: GraphQLID
    },
    CurrentTypeID: {
      type: GraphQLID
    },
    LevelID: {
      type: GraphQLID
    },
    Quantity: { type: GraphQLInt }
  })
});

const stationInputType = new GraphQLInputObjectType({
  name: "addstation",
  description: "Add a new station",
  fields: () => ({
    Connections: { type: new GraphQLList(connectionInputType) },
    Title: { type: GraphQLString },
    AddressLine1: { type: GraphQLString },
    Town: { type: GraphQLString },
    StateOrProvince: { type: GraphQLString },
    Postcode: { type: GraphQLString },
    Location: {
      type: new GraphQLInputObjectType({
        name: "location",
        fields: () => ({
          type: { type: GraphQLString },
          coordinates: {
            type: new GraphQLList(GraphQLString) //first is longitude, second latitude
          }
        })
      })
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations...",
  fields: {
    addStation: {
      type: stationType,
      description: "Add station",
      args: {
        input: { type: stationInputType }
      },
      resolve: async (parent, args) => {
        // checkAuth()
        const newStation = new station(args.input);
        return await newStation.save();
      }
    }
    /*modifyAnimal: {
      type: animalType,
      description: "Modify animals",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        animalName: { type: GraphQLString },
        species: { type: GraphQLID }
      },
      resolve: async (parent, args, { req, res, checkAuth }) => {
        try {
          checkAuth(req, res); // add to every resolve that needs authentication
          return await animal.findByIdAndUpdate(args.id, args, { new: true });
        } catch (error) {
          return new Error(error);
        }
      }
    }*/
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    stations: {
      type: new GraphQLList(stationType),
      description: "Get all stations",
      args: {
        limit: { type: GraphQLString },
        start: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        if (args.limit == undefined) args.limit = 10;

        return await station
          .find()
          .limit(Number.parseInt(args.limit))
          .skip(Number.parseInt(args.start));
      }
    },
    stationsByBounds: {
      type: new GraphQLList(stationType),
      description: "Get all stations",
      args: {
        limit: { type: GraphQLString },
        start: { type: GraphQLString },
        bounds: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        let northEast;
        let southWest;
        if (args.bounds != undefined) {
          let bounds = JSON.parse(args.bounds);
          console.log(bounds);
          northEast = bounds._northEast;
          southWest = bounds._southWest;
        }

        return await station
          .find()
          .limit(Number.parseInt(args.limit))
          .skip(Number.parseInt(args.start))
          .where("Location")
          .within({
            box: [
              [northEast.lng, northEast.lat],
              [southWest.lng, southWest.lat]
            ]
          });
      }
    },
    station: {
      type: stationType,
      description: "Get station by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        return await station.findById(args.id);
      }
    },
    connectiontypes: {
      type: new GraphQLList(connectionTypeType),
      description: "Get connection types",
      resolve: async (parent, args) => {
        return await connectionTypeId.find();
      }
    },
    currenttypes: {
      type: new GraphQLList(currentTypeType),
      description: "Get current types",
      resolve: async (parent, args) => {
        return await currentType.find();
      }
    },
    leveltypes: {
      type: new GraphQLList(levelType),
      description: "Get current types",
      resolve: async (parent, args) => {
        return await level.find();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
