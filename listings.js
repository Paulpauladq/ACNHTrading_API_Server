const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const listing = await db.collection('listings').findOne({ id });
  return listing;
}

const PAGE_SIZE = 10;

async function list(_, {
  status, sellerId, productId, page,
}) {
  const db = getDb();
  const filter = {};

  if (status) filter.status = status;
  if (sellerId) filter.sellerId = sellerId;
  if (productId) filter.productId = sellerId;

  const cursor = db.collection('listings').find(filter)
    .sort({ id: -1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const listingitems = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { listingitems, pages };
}

async function add(_, { issue: listing }) {
  const db = getDb();
  // validate(issue);

  const newListing = Object.assign({}, listing);
  newListing.created = new Date();
  newListing.status = 'New';
  newListing.id = await getNextSequence('listings');

  const result = await db.collection('listings').insertOne(newListing);
  const savedListing = await db.collection('listings')
    .findOne({ _id: result.insertedId });
  return savedListing;
}

async function update(_, { id, changes }) {
  const db = getDb();
  if (changes.productId || changes.status || changes.productCount || changes.note ||
    changes.expired || changes.priceList) {
    const listing = await db.collection('listings').findOne({ id });
    Object.assign(listing, changes);
    // validate(issue);
  }
  await db.collection('listings').updateOne({ id }, { $set: changes });
  const savedListing = await db.collection('listings').findOne({ id });
  return savedListing;
}

async function remove(_, { id }) {
  const db = getDb();
  const listing = await db.collection('listings').findOne({ id });
  if (!listing) return false;
  listing.deleted = new Date();

  let result = await db.collection('deleted_listings').insertOne(listing);
  if (result.insertedId) {
    result = await db.collection('listings').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function restore(_, { id }) {
  const db = getDb();
  const listing = await db.collection('deleted_listings').findOne({ id });
  if (!listing) return false;
  listing.deleted = new Date();

  let result = await db.collection('listings').insertOne(listing);
  if (result.insertedId) {
    result = await db.collection('deleted_listings').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
  delete: mustBeSignedIn(remove),
  restore: mustBeSignedIn(restore),
};
