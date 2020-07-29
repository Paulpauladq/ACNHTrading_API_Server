const { getDb } = require('./db.js');

async function get(_, { uniqueEntryId }) {
  const db = getDb();
  const item = await db.collection('items').findOne({ 'variants.uniqueEntryId': uniqueEntryId });
  return item;
}

const PAGE_SIZE = 10;

async function list(_, {
  sourceSheet, search, page,
}) {
  const db = getDb();
  const filter = {};

  if (sourceSheet) filter.sourceSheet = sourceSheet;
  if (search) filter.$text = { $search: search };

  const cursor = db.collection('items').find(filter)
    .sort({ name: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const items = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { items, pages };
}

module.exports = {
  list,
  get,
};
