"use strict";

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = require("graphql");
const category = require("../models/category.js");
const species = require("../models/species.js");
const animal = require("../models/animal.js");

const animalType = new GraphQLObjectType({
  name: "animal",
  description: "Animal name and species",
  fields: () => ({
    id: { type: GraphQLID },
    animalName: { type: GraphQLString },
    species: {
      type: speciesType,
      resolve: async (parent, args) => {
        //console.log(parent)
        try {
          return await species.findById(parent.species);
        } catch (error) {
          return new Error(error.message)
        }
      }
    }
  })
});

const speciesType = new GraphQLObjectType({
  name: "species",
  description: "Animal species",
  fields: () => ({
    id: { type: GraphQLID },
    speciesName: { type: GraphQLString },
    category: {
      type: categoryType,
      resolve: async (parent, args) => {
        //console.log(parent)
        try {
          return await category.findById(parent.category);
        } catch (error) {
          return new Error(error.message)
        }
      }
    }
  })
});

const categoryType = new GraphQLObjectType({
  name: "category",
  description: "Animal category",
  fields: () => ({
    id: { type: GraphQLID },
    categoryName: { type: GraphQLString }
  })
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations...",
  fields: {
    addCategory: {
      type: categoryType,
      description: "Add animal category like Fish, Mammal, etc.",
      args: {
        categoryName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args/*{ req, res, checkAuth } */) =>{
        // checkAuth() 
        const newCategory = new category({
          categoryName: args.categoryName
        });
        return await newCategory.save();
      }
    },
    addSpecies: {
      type: speciesType,
      description: "Add animal species like cat, dog, etc. and category id",
      args: {
        speciesName: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        const newSpecies = new species({
          speciesName: args.speciesName,
          category: args.category
        });
        return await newSpecies.save();
      }
    },
    addAnimal: {
      type: animalType,
      description: "Add animals",
      args: {
        animalName: { type: new GraphQLNonNull(GraphQLString) },
        species: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) =>{
        const newAnimal = new animal(args);
        return await newAnimal.save();
      }
    },
    modifyAnimal: {
      type: animalType,
      description: "Modify animals",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        animalName: { type: GraphQLString },
        species: { type: GraphQLID }
      },
      resolve: async (parent, args, {req, res, checkAuth}) =>{
        try {
          checkAuth(req, res) // add to every resolve that needs authentication
          return await animal.findByIdAndUpdate(args.id, args, {new:true});
        } catch (error) {
          return new Error(error)
        }
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    animals: {
      type: new GraphQLList(animalType),
      description: "Get all animals",
      resolve: async (parent, args) => {
        return await animal.find();
      }
    },
    animal: {
      type: animalType,
      description: "Get animal by id",
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        return await animal.findById(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
