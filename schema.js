const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLInt },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
});

// Rocket type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/launches")
          .then((result) => {
            return result.data;
          });
      },
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then((result) => {
            return result.data;
          });
      },
    },
    rockets: {
        type: new GraphQLList(RocketType),
        resolve(parent, args) {
          return axios
            .get("https://api.spacexdata.com/v3/rockets")
            .then((result) => {
              return result.data;
            });
        },
      },
      rocket: {
        type: RocketType,
        args: {
          id: { type: GraphQLString },
        },
        resolve(parent, args) {
          return axios
            .get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
            .then((result) => {
              return result.data;
            });
        },
      },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
