const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const offer = await db.collection('offers').findOne({ id });
  return offer;
}

const PAGE_SIZE = 24;

async function list(_, {
  status, listingId, sellerId, buyerId, page,
}) {
  const db = getDb();
  const filter = {};

  if (status) filter.status = status;
  if (listingId) filter.listingId = listingId;
  if (sellerId) filter.sellerId = sellerId;
  if (buyerId) filter.buyerId = buyerId;

  const cursor = db.collection('offers').find(filter)
    .sort({ id: -1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const offers = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { offers, pages };
}

async function add(_, { offer }) {
  const db = getDb();
  const newOffer = Object.assign({}, offer);

  newOffer.status = 'New';
  newOffer.created = new Date();
  newOffer.id = await getNextSequence('offers');

  const result = await db.collection('offers').insertOne(newOffer);
  const savedOffer = await db.collection('offers').findOne({ _id: result.insertedId });
  return savedOffer;
}

async function update(_, { id, changes }) {
  const db = getDb();

  if (changes.status || changes.productId || changes.productCount) {
    const offer = await db.collection('offers').findOne({ id });
    Object.assign(offer, changes);
  }

  await db.collection('offers').updateOne({ id }, { $set: changes });
  const savedOffer = await db.collection('offers').findOne({ id });
  return savedOffer;
}

async function remove(_, { id }) {
  const db = getDb();
  const offer = await db.collection('offers').findOne({ id });

  if (!offer) return false;
  offer.deleted = new Date();

  let result = await db.collection('deleted_offers').insertOne(offer);
  if (result.insertedId) {
    result = await db.collection('offers').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function restore(_, { id }) {
  const db = getDb();
  const offer = await db.collection('deleted_offers').findOne({ id });

  if (!offer) return false;
  offer.deleted = new Date();

  let result = await db.collection('offers').insertOne(offer);
  if (result.insertedId) {
    result = await db.collection('deleted_offers').removeOne({ id });
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
