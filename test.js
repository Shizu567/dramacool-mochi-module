const DramacoolModule = require('./dramacool');

async function testModule() {
  const module = new DramacoolModule();

  console.log("Discover Listings:");
  const listings = await module.discoverListings({});
  console.log(listings);

  console.log("Search:");
  const searchResults = await module.search({ query: 'love' });
  console.log(searchResults);

  console.log("Playlist Details:");
  if (listings.length > 0) {
    const details = await module.playlistDetails({ id: listings[0].id });
    console.log(details);
  } else {
    console.log("No listings found to test playlist details.");
  }
}

testModule();
