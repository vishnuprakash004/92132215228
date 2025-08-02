
const axios = require("axios");


const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aXNobnVwcmFrYXNocG0yMmVjQHBzbmFjZXQuZWR1LmluIiwiZXhwIjoxNzU0MTE1NjUxLCJpYXQiOjE3NTQxMTQ3NTEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4N2Y3MjI0YS05NDRlLTQ4NTgtYTQ5OC0xMGVjZjYyNTkzYjciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ2aXNobnUgcHJha2FzaCBwIG0iLCJzdWIiOiJkYTA3ODgxYS1jOTJmLTQ5YTMtOGIyNy1hMjE2MjBhMWNjZjEifSwiZW1haWwiOiJ2aXNobnVwcmFrYXNocG0yMmVjQHBzbmFjZXQuZWR1LmluIiwibmFtZSI6InZpc2hudSBwcmFrYXNoIHAgbSIsInJvbGxObyI6IjkyMTMyMjE1MjI4IiwiYWNjZXNzQ29kZSI6InJCUGZTUyIsImNsaWVudElEIjoiZGEwNzg4MWEtYzkyZi00OWEzLThiMjctYTIxNjIwYTFjY2YxIiwiY2xpZW50U2VjcmV0IjoicGdjYkFNTWtRU3hyQ0hLQSJ9.cl2M5JXIHmrvh6mwaSFzPJ8DmCLw_Mcyr6TwM4_KeAQ"; 

const BASE_URL = "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, pkg, message) {
  try {
    const payload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message
    };

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": AUTH_TOKEN,
      },
    });

    if (response.status === 200) {
      console.log("[LOG SENT]", response.data.message);
    }
  } catch (err) {
    console.error("[LOGGING ERROR]", err.response?.data || err.message);
  }
}

module.exports = Log;
