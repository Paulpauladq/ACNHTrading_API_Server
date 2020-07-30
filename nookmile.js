const { getDb } = require('./db.js');

async function get(_, { uniqueEntryId }) {
  const db = getDb();
  const nookmile = await db.collection('nookmiles').findOne({ uniqueEntryId });
  return nookmile;
}

const PAGE_SIZE = 24;

async function list(_, {
  search, page,
}) {
  const db = getDb();
  const filter = {};

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('nookmiles').find(filter)
    .sort({ name: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const nookmiles = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { nookmiles, pages };
}

module.exports = {
  list,
  get,
};
