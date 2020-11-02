const fetch = require('node-fetch');

const fetch = require("node-fetch");

const url = "https://www.weatherapi.com/current.json";
http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London

const get_data = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};

getData(url);
