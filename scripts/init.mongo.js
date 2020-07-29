/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo acnhtrading scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/acnhtrading scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/acnhtrading scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

db.listings.remove({});
db.offers.remove({});
db.users.remove({});
db.deleted_listings.remove({});
db.deleted_offers.remove({});

const listingsDB = [
  {
    id: 1,
    status: 'New',
    seller_id: 1,
    product_id: 'EpywQXABBcv2dipsP',
    product_count: 1,
    created: new Date('2020-07-13'),
    expired: undefined,
    note: 'Don\'t send me empty offers.',
    price_list: [
      {
        product_id: "bell",
        product_count: 1000000,
      },
      {
        product_id: "FAn9xRZvpBRAad3E6",
        product_count: 20,
      },
      {
        product_id: "J4inuBziPCSGZNEPM",
        product_count: 2,
      },
    ],
  },
  {
    id: 2,
    status: 'Pending',
    seller_id: 2,
    product_id: "XAnaYsJ8wouWyBBsu",
    product_count: 3,
    created: new Date('2020-07-15'),
    expired: undefined,
    note: 'Yohooooooooo',
    price_list: [
      {
        product_id: "FAn9xRZvpBRAad3E6",
        product_count: 20,
      },
      {
        product_id: "t2LzAKDofAZYyqZ6r",
        product_count: 2,
      },
    ],
  },
  {
    id: 3,
    status: 'Closed',
    seller_id: 1,
    product_id: "54WzSWz3bv4j4279w",
    product_count: 1,
    created: new Date('2020-07-10'),
    expired: undefined,
    note: 'Accepting touch trade',
    price_list: [
      {
        product_id: "6wyLNus8QqXkbBu72",
        product_count: 1,
      },
    ],
  },
];

const offersDB = [
  {
    id: 1,
    status: 'New',
    listing_id: 2,
    seller_id: 2,
    buyer_id: 1,
    product_id: "FAn9xRZvpBRAad3E6",
    product_count: 20,
  },
  {
    id: 2,
    status: 'Rejected',
    listing_id: 3,
    seller_id: 1,
    buyer_id: 2,
    product_id: "6wyLNus8QqXkbBu72",
    product_count: 1,
  },
  {
    id: 3,
    status: 'Accepted',
    listing_id: 1,
    seller_id: 1,
    buyer_id: 2,
    product_id: "bell",
    product_count: 1000000,
  },
];

const usersDB = [
  {
    id: 1,
    username: 'ppt',
    email: 'ppt@gmail.com',
    switch_id: '1111-1111-1111',
    island_name: 'ppt_island',
    villager_list: ["B3RyfNEqwGmcccRC3"],
    wishlist: ["QiRLGPEKXAy9CnsnD", "EFHuxMqC34e4se2EB", "dRTnqq9pYTtLGmZZt"],
  },
  {
    id: 2,
    username: 'sfz',
    email: 'sfz@gmail.com',
    switch_id: '2222-2222-2222',
    island_name: 'sfz_island',
    villager_list: ["SGMdki6dzpDZyXAw5"],
    wishlist: ["dRTnqq9pYTtLGmZZt", "ihA8W7QC64yvcX4Dd", "hyZvWM6kXL5S7qcbN"],
  },
];

db.listings.insertMany(listingsDB);
db.offers.insertMany(offersDB);
db.users.insertMany(usersDB);

const listing_count = db.listings.count();
const offer_count = db.offers.count();
const user_count = db.users.count();

print('Inserted', listing_count, 'listings');
print('Inserted', offer_count, 'offers');
print('Inserted', user_count, 'users');

db.counters.remove({ _id: 'listings' });
db.counters.remove({ _id: 'offers' });
db.counters.remove({ _id: 'users' });

db.counters.insert({ _id: 'listings', current: listing_count });
db.counters.insert({ _id: 'offers', current: offer_count });
db.counters.insert({ _id: 'users', current: user_count });

db.listings.createIndex({ id: 1 }, { unique: true });
db.listings.createIndex({ status: 1 });
db.listings.createIndex({ seller_id: 1 });
db.listings.createIndex({ product_id: 1 });
db.listings.createIndex({ created: 1 });
db.listings.createIndex({ expired: 1 });

db.deleted_listings.createIndex({ id: 1 }, { unique: true });

db.offers.createIndex({ id: 1 }, { unique: true });
db.offers.createIndex({ status: 1 });
db.offers.createIndex({ listing_id: 1 });
db.offers.createIndex({ seller_id: 1 });
db.offers.createIndex({ buyer_id: 1 });

db.deleted_offers.createIndex({ id: 1 }, { unique: true });

db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ switch_id: 1 }, { unique: true });
db.users.createIndex({ 'username': 'text', 'email': 'text', 'switch_id': 'text', 'island_name': 'text', });

// use mongo import 4 json data file
db.items.createIndex({ 'variants.uniqueEntryId': 1 }, { unique: true });
db.items.createIndex({ 'sourceSheet': 1 });
db.items.createIndex({ 'name': 'text' });

db.villagers.createIndex({ 'uniqueEntryId': 1 }, { unique: true });
db.villagers.createIndex({ 'personality': 1 });
db.villagers.createIndex({ 'species': 1 });
db.villagers.createIndex({ 'name': 'text' });

db.recipes.createIndex({ 'uniqueEntryId': 1 }, { unique: true });
db.recipes.createIndex({ 'name': 'text' });

db.nookmiles.createIndex({ 'uniqueEntryId': 1 }, { unique: true });
db.nookmiles.createIndex({ 'name': 'text' });
