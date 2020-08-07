const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, {
  lookup, lookupType,
}) {
  const db = getDb();
  let ancher = null;
  if (lookupType === 'id') {
    ancher = await db.collection('acnhers').findOne({ id: parseInt(lookup, 10) });
  } else if (lookupType === 'email') {
    ancher = await db.collection('acnhers').findOne({ email: lookup });
  }
  return ancher;
}

const PAGE_SIZE = 24;

async function list(_, {
  search, page,
}) {
  const db = getDb();
  const filter = {};

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('acnhers').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const acnhers = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { acnhers, pages };
}

async function add(_, { acnher }) {
  const db = getDb();

  const newAcnher = Object.assign({}, acnher);
  newAcnher.created = new Date();
  newAcnher.id = await getNextSequence('acnhers');

  const result = await db.collection('acnhers').insertOne(newAcnher);
  const savedAcnher = await db.collection('acnhers').findOne({ _id: result.insertedId });
  return savedAcnher;
}

async function update(_, { id, changes }) {
  const db = getDb();

  if (changes.nickname || changes.switchId || changes.islandName
      || changes.villagerList || changes.wishlist) {
    const acnher = await db.collection('acnhers').findOne({ id });
    Object.assign(acnher, changes);
  }

  await db.collection('acnhers').updateOne({ id }, { $set: changes });
  const savedAcnher = await db.collection('acnhers').findOne({ id });
  return savedAcnher;
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
};
