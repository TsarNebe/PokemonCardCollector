const axios = require('axios');

// Simple in-memory cache for card search results to speed up repeated queries
const cardSearchCache = {};

// Function to search for Pokémon cards by name (or ID or type)
async function searchCards({ name, type, generation, id }) {
  // Construct a cache key based on query parameters
  const key = `${name || ''}_${type || ''}_${generation || ''}_${id || ''}`.toLowerCase();
  if (cardSearchCache[key]) {
    // Return cached results if available
    return cardSearchCache[key];
  }

  try {
    let results = [];
    // If an ID is specified (e.g., Pokedex number), fetch that specific Pokemon
    if (id) {
      const pokeResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = pokeResponse.data;
      // Construct a dummy card result from PokeAPI data
      results.push({
        name: pokemon.name,
        pokemonId: pokemon.id,
        type: pokemon.types[0]?.type.name || null,
        generation: getGenerationFromId(pokemon.id),
        rarity: null,
        imageUrl: pokemon.sprites?.other['official-artwork']?.front_default || null
      });
    } else {
      // Build query for Pokémon TCG API (filter by name/type if provided)
      let query = [];
      if (name) {
        // Partial name search
        query.push(`name:${name}`);
      }
      if (type) {
        query.push(`types:${type}`);
      }
      if (generation) {
        // Filter by generation via National Pokedex number range
        const [start, end] = getPokedexRangeForGen(generation);
        query.push(`nationalPokedexNumbers:[${start} TO ${end}]`);
      }
      const qString = query.length ? query.join(' ') : '';
      const url = qString
        ? `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(qString)}`
        : `https://api.pokemontcg.io/v2/cards`;
      const headers = {};
      if (process.env.POKETCG_API_KEY) {
        headers['X-Api-Key'] = process.env.POKETCG_API_KEY;
      }
      const response = await axios.get(url, { headers });
      const data = response.data;
      results = data.data ? data.data.map(card => ({
        name: card.name,
        pokemonId: card.nationalPokedexNumbers ? card.nationalPokedexNumbers[0] : null,
        type: card.types ? card.types[0] : null,
        generation: card.nationalPokedexNumbers ? getGenerationFromId(card.nationalPokedexNumbers[0]) : null,
        rarity: card.rarity || null,
        imageUrl: card.images?.large || card.images?.small || null,
        id: card.id  // card ID from the TCG API
      })) : [];
    }

    // Cache the results for subsequent calls
    cardSearchCache[key] = results;
    return results;
  } catch (err) {
    console.error('Error fetching card data:', err.message);
    return [];  // return empty results on error
  }
}

// Helper: determine generation number from Pokedex ID
function getGenerationFromId(pokeId) {
  if (pokeId <= 151) return 1;
  if (pokeId <= 251) return 2;
  if (pokeId <= 386) return 3;
  if (pokeId <= 493) return 4;
  if (pokeId <= 649) return 5;
  if (pokeId <= 721) return 6;
  if (pokeId <= 809) return 7;
  if (pokeId <= 905) return 8;
  return 9; // assuming any beyond 905 as Gen 9+
}

// Helper: get Pokedex ID range for a given generation
function getPokedexRangeForGen(gen) {
  const ranges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1010]  // Gen 9 approximate range
  };
  return ranges[gen] || [1, 151];
}

module.exports = { searchCards };
