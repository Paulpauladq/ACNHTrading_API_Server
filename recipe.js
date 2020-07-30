const { getDb } = require('./db.js');

async function get(_, { uniqueEntryId }) {
  const db = getDb();
  const recipe = await db.collection('recipes').findOne({ uniqueEntryId });
  return recipe;
}

const PAGE_SIZE = 24;

async function list(_, {
  search, page,
}) {
  const db = getDb();
  const filter = {};

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('recipes').find(filter)
    .sort({ name: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const recipes = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { recipes, pages };
}

module.exports = {
  list,
  get,
};
