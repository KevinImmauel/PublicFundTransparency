const axios = require('axios');

// Firebase Realtime Database URL and API Key
const FIREBASE_HOST = 'https://moulya-6964c-default-rtdb.asia-southeast1.firebasedatabase.app';
const API_KEY = 'AIzaSyAcpC5oegNCHWwJu3us7i8RafNc29Z4X8Y';

// Function to generate random values within a given range (to prevent extreme differences)
function getRandomData() {
  const temperature = (Math.random() * (32 - 25) + 25).toFixed(2);  // Random temperature between 25 and 32°C
  const humidity = (Math.random() * 100).toFixed(2);  // Random humidity between 0 and 100%
  const pressure = (Math.random() * (1020 - 1015) + 1015).toFixed(2);  // Random pressure between 1015 and 1020 hPa
  const rainLevel = Math.random() < 0.5 ? 0 : 100;  // Random rain level (0 or 100)
  return { temperature, humidity, pressure, rainLevel };
}

// Function to update data in Firebase Realtime Database
async function updateFirebaseData() {
  const randomData = getRandomData();

  try {
    const path = '/road_weather.json'; // Path to store data in Firebase
    const payload = randomData;

    const url = `${FIREBASE_HOST}${path}?auth=${API_KEY}`; // Include API key in URL

    // Send the data to Firebase
    const response = await axios.put(url, payload);
    
    console.log('Data sent to Firebase successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error updating Firebase:', error);
  }
}

// Update data every 10 seconds
setInterval(updateFirebaseData, 10000); // 10 seconds interval
