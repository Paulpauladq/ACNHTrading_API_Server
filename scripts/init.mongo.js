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

db.listings.drop();
db.offers.drop();
db.acnhers.drop();
db.deleted_listings.drop();
db.deleted_offers.drop();
db.counters.drop();

db.items.dropIndexes();
db.villagers.dropIndexes();
db.recipes.dropIndexes();
db.nookmiles.dropIndexes();

const listingsDB = [
  {
    id: 1,
    status: 'New',
    sellerId: 1,
    sellerName: 'ppt',
    productId: 'EpywQXABBcv2dipsP',
    productName: 'acoustic guitar',
    productCount: 1,
    thumbnail: 'https://acnhcdn.com/latest/FtrIcon/FtrAcorsticguitar_Remake_0_0.png',
    created: new Date('2020-07-13'),
    expired: undefined,
    note: 'Don\'t send me empty offers.',
    priceList: [
      {
        productId: 'bell',
        productCount: 1000000,
      },
      {
        productId: 'nmt',
        productCount: 20,
      },
      {
        productId: 'wishlist',
        productCount: 2,
      },
    ],
  },
  {
    id: 2,
    status: 'New',
    sellerId: 2,
    sellerName: 'sfz',
    productId: 'XAnaYsJ8wouWyBBsu',
    productName: 'antique wardrobe',
    productCount: 3,
    thumbnail: 'https://acnhcdn.com/latest/FtrIcon/FtrAntiqueChest_Remake_0_0.png',
    created: new Date('2020-07-15'),
    expired: undefined,
    note: 'Yohooooooooo',
    priceList: [
      {
        productId: 'nmt',
        productCount: 20,
      },
      {
        productId: 'wishlist',
        productCount: 2,
      },
    ],
  },
  {
    id: 3,
    status: 'Closed',
    sellerId: 1,
    sellerName: 'ppt',
    productId: '54WzSWz3bv4j4279w',
    productName: 'antique clock',
    productCount: 1,
    thumbnail: 'https://acnhcdn.com/latest/FtrIcon/FtrAntiqueClock_Remake_0_0.png',
    created: new Date('2020-07-10'),
    expired: undefined,
    note: 'Accepting touch trade',
    priceList: [
      {
        productId: 'wishlist',
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
    productId: 'wishlist',
    productCount: 20,
    created: new Date('2020-07-10'),
  },
  {
    id: 2,
    status: 'Rejected',
    listingId: 3,
    sellerId: 1,
    buyerId: 2,
    productId: 'nmt',
    productCount: 1,
    created: new Date('2020-07-10'),
  },
  {
    id: 3,
    status: 'Accepted',
    listingId: 1,
    sellerId: 1,
    buyerId: 2,
    productId: 'bell',
    productCount: 1000000,
    created: new Date('2020-07-10'),
  },
];

const acnhersDB = [
  {
    id: 1,
    nickname: 'ppt',
    email: 'ppt@gmail.com',
    switchId: '1111-1111-1111',
    islandName: 'ppt_island',
    villagerList: ['B3RyfNEqwGmcccRC3'],
    created: new Date('2020-07-13'),
    wishlist: [
      {
        uniqueEntryId: 'QiRLGPEKXAy9CnsnD',
        itemName: 'Celeste\'s poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcSpOws.png',
      },
      {
        uniqueEntryId: 'EFHuxMqC34e4se2EB',
        itemName: 'Cinnamoroll poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlElp11.png',
      },
      {
        uniqueEntryId: 'dRTnqq9pYTtLGmZZt',
        itemName: 'Croque\'s poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlFlg17.png',
      },
    ],
  },
  {
    id: 2,
    nickname: 'sfz',
    email: 'sfz@gmail.com',
    switchId: '2222-2222-2222',
    islandName: 'sfz_island',
    villagerList: ['SGMdki6dzpDZyXAw5'],
    created: new Date('2020-07-13'),
    wishlist: [
      {
        uniqueEntryId: 'dRTnqq9pYTtLGmZZt',
        itemName: 'Croque\'s poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlFlg17.png',
      },
      {
        uniqueEntryId: 'ihA8W7QC64yvcX4Dd',
        itemName: 'Deli\'s poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlMnk08.png',
      },
      {
        uniqueEntryId: 'hyZvWM6kXL5S7qcbN',
        itemName: 'Dom\'s poster',
        thumbnail: 'https://acnhcdn.com/latest/FtrIcon/PosterNpcNmlShp15.png',
      },
    ],
  },
];

db.listings.insertMany(listingsDB);
db.offers.insertMany(offersDB);
db.acnhers.insertMany(acnhersDB);

const listingCount = db.listings.count();
const offerCount = db.offers.count();
const acnherCount = db.acnhers.count();

print('Inserted', listingCount, 'listings');
print('Inserted', offerCount, 'offers');
print('Inserted', acnherCount, 'acnhers');

db.counters.insert({ _id: 'listings', current: listingCount });
db.counters.insert({ _id: 'offers', current: offerCount });
db.counters.insert({ _id: 'acnhers', current: acnherCount });

db.listings.createIndex({ id: 1 }, { unique: true });
db.listings.createIndex({ status: 1 });
db.listings.createIndex({ sellerId: 1 });
db.listings.createIndex({ sellerName: 1 });
db.listings.createIndex({ productId: 1 });
db.listings.createIndex({ productName: 1 });
db.listings.createIndex({ created: 1 });
db.listings.createIndex({ expired: 1 });
db.acnhers.createIndex({
  sellerName: 'text', productName: 'text',
});

db.deleted_listings.createIndex({ id: 1 }, { unique: true });

db.offers.createIndex({ id: 1 }, { unique: true });
db.offers.createIndex({ status: 1 });
db.offers.createIndex({ listingId: 1 });
db.offers.createIndex({ sellerId: 1 });
db.offers.createIndex({ buyerId: 1 });

db.deleted_offers.createIndex({ id: 1 }, { unique: true });

db.acnhers.createIndex({ id: 1 }, { unique: true });
db.acnhers.createIndex({ nickname: 1 });
db.acnhers.createIndex({ islandName: 1 });
db.acnhers.createIndex({ email: 1 }, { unique: true });
db.acnhers.createIndex({ switchId: 1 });
db.acnhers.createIndex({
  nickname: 'text', email: 'text', switchId: 'text', islandName: 'text',
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
