// pages/api/dune.js

export default async function handler(req, res) {
  try {
    const request = await fetch(
      "https://api.dune.com/api/v1/endpoints/aliahanch/fff/results",
      {
        headers: {
          "X-Dune-API-Key": "e9xqHrg6qRMo0qyhc1VE7nAPIzyXfGaY"
        },
      }
    );

    if (!request.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await request.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
