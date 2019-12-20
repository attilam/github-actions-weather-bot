require('dotenv').config();
const fetch = require('node-fetch');
const telegram = require('node-telegram-bot-api');

const bot = new telegram(process.env.TELEGRAM_API_TOKEN);

const weatherToken = process.env.WEATHER_API_TOKEN;

const weatherURL = new URL('https://api.openweathermap.org/data/2.5/weather');
weatherURL.searchParams.set('APPID', weatherToken);
weatherURL.searchParams.set('zip', '2092,hu');
weatherURL.searchParams.set('units', 'metric');

const getWeatherData = async () => {
  const response = await fetch(weatherURL.toString());
  const body = await response.json();

  return body;
}

const generateWeatherMessage = weatherData => {
  const weather = weatherData.weather.length !== undefined ?
    weatherData.weather[0].main : weatherData.weather.main;

  return `The weather in ${weatherData.name}: ${weather}. Current temperature is ${weatherData.main.temp}°C, with a low of ${weatherData.main.temp_min}°C and a high of ${weatherData.main.temp_max}°C.`;
}

const main = async () => {
  const weatherData = await getWeatherData();
  const message = generateWeatherMessage(weatherData);

  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

  console.log(message);
}

main();
