const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const auth = require('./auth.js');
const listing = require('./listing.js');
const offer = require('./offer.js');
const acnher = require('./acnher.js');
const item = require('./item.js');
const recipe = require('./recipe.js');
const villager = require('./villager.js');
const nookmile = require('./nookmile.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    listing: listing.get,
    listingList: listing.list,
    offer: offer.get,
    offerList: offer.list,
    acnher: acnher.get,
    acnherList: acnher.list,
    item: item.get,
    itemList: item.list,
    recipe: recipe.get,
    recipeList: recipe.list,
    villager: villager.get,
    villagerList: villager.list,
    nookmile: nookmile.get,
    nookmileList: nookmile.list,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    listingAdd: listing.add,
    listingUpdate: listing.update,
    listingDelete: listing.delete,
    listingRestore: listing.restore,
    offerAdd: offer.add,
    offerUpdate: offer.update,
    offerDelete: offer.delete,
    offerRestore: offer.restore,
    acnherAdd: acnher.add,
    acnherUpdate: acnher.update,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
