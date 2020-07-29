const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const user = await db.collection('users').findOne({ id });
  return user;
}

const PAGE_SIZE = 10;

async function list(_, {
  search, page,
}) {
  const db = getDb();
  const filter = {};

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('users').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const users = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { users, pages };
}

async function add(_, { user }) {
  const db = getDb();

  const newUser = Object.assign({}, user);
  newUser.created = new Date();
  newUser.id = await getNextSequence('users');

  const result = await db.collection('users').insertOne(newUser);
  const savedUser = await db.collection('users').findOne({ _id: result.insertedId });
  return savedUser;
}

async function update(_, { id, changes }) {
  const db = getDb();

  if (changes.username || changes.switchId || changes.islandName
      || changes.villagerList || changes.wishlist) {
    const user = await db.collection('users').findOne({ id });
    Object.assign(user, changes);
  }

  await db.collection('users').updateOne({ id }, { $set: changes });
  const savedUser = await db.collection('users').findOne({ id });
  return savedUser;
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
};
