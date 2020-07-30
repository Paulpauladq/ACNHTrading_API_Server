const { getDb } = require('./db.js');

async function get(_, { uniqueEntryId }) {
  const db = getDb();
  const villager = await db.collection('villagers').findOne({ uniqueEntryId });
  return villager;
}

const PAGE_SIZE = 24;

async function list(_, {
  personality, species, search, page,
}) {
  const db = getDb();
  const filter = {};

  if (personality) filter.personality = personality;
  if (species) filter.species = species;
  if (search) filter.$text = { $search: search };

  const cursor = db.collection('villagers').find(filter)
    .sort({ name: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const villagers = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { villagers, pages };
}

module.exports = {
  list,
  get,
};
