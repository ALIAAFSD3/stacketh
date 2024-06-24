// pages/api/dune.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const myHeaders = new Headers();
  myHeaders.append("X-Dune-API-Key", "e9xqHrg6qRMo0qyhc1VE7nAPIzyXfGaY");
  myHeaders.append("Cookie", "__cf_bm=XLAsBF.UqibK2OcF16zzCFrdc1WJEdPJZlcaWNUHO74-1719214080-1.0.1.1-.WqnZfSP3P4OXILfWuX.YresdAf_pFR9zWgwdFYRZk4gpUTAPfYMGa_fMHO17eNY6.iSuZV5ybbRhEStA3CMAg");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://api.dune.com/api/v1/query/2881844/results", requestOptions);
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
