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
    sellerId: 1,
    productId: 'EpywQXABBcv2dipsP',
    productCount: 1,
    created: new Date('2020-07-13'),
    expired: undefined,
    note: 'Don\'t send me empty offers.',
    priceList: [
      {
        productId: 'bell',
        productCount: 1000000,
      },
      {
        productId: 'FAn9xRZvpBRAad3E6',
        productCount: 20,
      },
      {
        productId: 'J4inuBziPCSGZNEPM',
        productCount: 2,
      },
    ],
  },
  {
    id: 2,
    status: 'Pending',
    sellerId: 2,
    productId: 'XAnaYsJ8wouWyBBsu',
    productCount: 3,
    created: new Date('2020-07-15'),
    expired: undefined,
    note: 'Yohooooooooo',
    priceList: [
      {
        productId: 'FAn9xRZvpBRAad3E6',
        productCount: 20,
      },
      {
        productId: 't2LzAKDofAZYyqZ6r',
        productCount: 2,
      },
    ],
  },
  {
    id: 3,
    status: 'Closed',
    sellerId: 1,
    productId: '54WzSWz3bv4j4279w',
    productCount: 1,
    created: new Date('2020-07-10'),
    expired: undefined,
    note: 'Accepting touch trade',
    priceList: [
      {
        productId: '6wyLNus8QqXkbBu72',
        productCount: 1,
      },
    ],
  },
];

const offersDB = [
  {
    id: 1,
    status: 'New',
    listingId: 2,
    sellerId: 2,
    buyerId: 1,
    productId: 'FAn9xRZvpBRAad3E6',
    productCount: 20,
  },
  {
    id: 2,
    status: 'Rejected',
    listingId: 3,
    sellerId: 1,
    buyerId: 2,
    productId: '6wyLNus8QqXkbBu72',
    productCount: 1,
  },
  {
    id: 3,
    status: 'Accepted',
    listingId: 1,
    sellerId: 1,
    buyerId: 2,
    productId: 'bell',
    productCount: 1000000,
  },
];

const usersDB = [
  {
    id: 1,
    username: 'ppt',
    email: 'ppt@gmail.com',
    switchId: '1111-1111-1111',
    islandName: 'ppt_island',
    villagerList: ['B3RyfNEqwGmcccRC3'],
    wishlist: ['QiRLGPEKXAy9CnsnD', 'EFHuxMqC34e4se2EB', 'dRTnqq9pYTtLGmZZt'],
  },
  {
    id: 2,
    username: 'sfz',
    email: 'sfz@gmail.com',
    switchId: '2222-2222-2222',
    islandName: 'sfz_island',
    villagerList: ['SGMdki6dzpDZyXAw5'],
    wishlist: ['dRTnqq9pYTtLGmZZt', 'ihA8W7QC64yvcX4Dd', 'hyZvWM6kXL5S7qcbN'],
  },
];

db.listings.insertMany(listingsDB);
db.offers.insertMany(offersDB);
db.users.insertMany(usersDB);

const listingCount = db.listings.count();
const offerCount = db.offers.count();
const userCount = db.users.count();

print('Inserted', listingCount, 'listings');
print('Inserted', offerCount, 'offers');
print('Inserted', userCount, 'users');

db.counters.remove({ _id: 'listings' });
db.counters.remove({ _id: 'offers' });
db.counters.remove({ _id: 'users' });

db.counters.insert({ _id: 'listings', current: listingCount });
db.counters.insert({ _id: 'offers', current: offerCount });
db.counters.insert({ _id: 'users', current: userCount });

db.listings.createIndex({ id: 1 }, { unique: true });
db.listings.createIndex({ status: 1 });
db.listings.createIndex({ sellerId: 1 });
db.listings.createIndex({ productId: 1 });
db.listings.createIndex({ created: 1 });
db.listings.createIndex({ expired: 1 });

db.deleted_listings.createIndex({ id: 1 }, { unique: true });

db.offers.createIndex({ id: 1 }, { unique: true });
db.offers.createIndex({ status: 1 });
db.offers.createIndex({ listingId: 1 });
db.offers.createIndex({ sellerId: 1 });
db.offers.createIndex({ buyerId: 1 });

db.deleted_offers.createIndex({ id: 1 }, { unique: true });

db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ username: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ switchId: 1 }, { unique: true });
db.users.createIndex({
  username: 'text', email: 'text', switchId: 'text', islandName: 'text',
});

// use mongo import 4 json data file
db.items.createIndex({ 'variants.uniqueEntryId': 1 }, { unique: true });
db.items.createIndex({ sourceSheet: 1 });
db.items.createIndex({ name: 'text' });

db.villagers.createIndex({ uniqueEntryId: 1 }, { unique: true });
db.villagers.createIndex({ personality: 1 });
db.villagers.createIndex({ species: 1 });
db.villagers.createIndex({ name: 'text' });

db.recipes.createIndex({ uniqueEntryId: 1 }, { unique: true });
db.recipes.createIndex({ name: 'text' });

db.nookmiles.createIndex({ uniqueEntryId: 1 }, { unique: true });
db.nookmiles.createIndex({ name: 'text' });
