import axios from 'axios';

const getCoinData = async (coinId) => {
  const response = await axios.get(`https://api.coincap.io/v2/assets/${coinId}`);
  const data = response.data.data;

  const historyResponse = await axios.get(`https://api.coincap.io/v2/assets/${coinId}/history?interval=d1`);
  const historyData = historyResponse.data.data;

  const chartData = historyData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    priceUsd: parseFloat(item.priceUsd),
  }));

  return {
    id: coinId,
    name: data.name,
    symbol: data.symbol,
    priceUsd: parseFloat(data.priceUsd).toFixed(2),
    changePercent24Hr: parseFloat(data.changePercent24Hr).toFixed(2),
    chartData,
  };
};

export async function GET(request) {
  try {
    const coins = ['bitcoin','ethereum', 'binance-coin', 'dogecoin', ];
    const coinDataPromises = coins.map(coinId => getCoinData(coinId));
    const coinsData = await Promise.all(coinDataPromises);

    return new Response(JSON.stringify(coinsData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to fetch data', error }), { status: 500 });
  }
}
