"use strict";

const axios = require('axios');
const cheerio = require('cheerio');

class SourceModule {
  constructor() {
    this.metadata = {};
  }
}

const PlaylistType = {
  video: "video",
};

const PlaylistStatus = {
  unknown: "unknown",
};

const DiscoverListingType = {
  default: "default",
};

const DiscoverListingOrientationType = {
  portrait: "portrait",
};

class DramacoolModule extends SourceModule {
  constructor() {
    super();

    this.metadata = {
      id: "dramacool",
      name: "Dramacool",
      version: "1.0.0",
      icon: "https://asianc.to/favicon.ico",
      requestHeaders: { "User-Agent": "Mozilla/5.0" }
    };
  }

  async discoverListings(params) {
    const url = "https://asianc.to/latest";
    const response = await axios.get(url, { headers: this.metadata.requestHeaders });
    const html = response.data;
    const $ = cheerio.load(html);

    const listings = [];
    $(".block-serial-block .block-content .thumb-item-flow").each((index, element) => {
      listings.push({
        id: $(element).find("a").attr("href").split("/").pop(),
        title: $(element).find(".title").text().trim(),
        type: DiscoverListingType.default,
        orientation: DiscoverListingOrientationType.portrait,
        thumbnail: $(element).find("img").attr("src"),
        url: `https://asianc.to${$(element).find("a").attr("href")}`
      });
    });

    return listings;
  }

  async search(params) {
    const url = `https://asianc.to/search?keyword=${encodeURIComponent(params.query)}`;
    const response = await axios.get(url, { headers: this.metadata.requestHeaders });
    const html = response.data;
    const $ = cheerio.load(html);

    const results = [];
    $(".block-serial-block .block-content .thumb-item-flow").each((index, element) => {
      results.push({
        id: $(element).find("a").attr("href").split("/").pop(),
        title: $(element).find(".title").text().trim(),
        url: `https://asianc.to${$(element).find("a").attr("href")}`,
        thumbnail: $(element).find("img").attr("src"),
        description: $(element).find(".desi").text().trim()
      });
    });

    return results;
  }

  async playlistDetails(params) {
    const url = `https://asianc.to/drama/${params.id}`;
    const response = await axios.get(url, { headers: this.metadata.requestHeaders });
    const html = response.data;
    const $ = cheerio.load(html);

    const episodes = [];
    $(".episode").each((index, element) => {
      episodes.push({
        id: $(element).find("a").attr("href").split("/").pop(),
        title: $(element).find(".title").text().trim(),
        url: `https://asianc.to${$(element).find("a").attr("href")}`
      });
    });

    return {
      id: params.id,
      title: $(".info .title").text().trim(),
      episodes: episodes,
      status: PlaylistStatus.unknown,
      type: PlaylistType.video,
      description: $(".info .description").text().trim(),
      thumbnail: $(".info .thumb img").attr("src")
    };
  }
}

module.exports = DramacoolModule;
