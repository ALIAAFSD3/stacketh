'use client';

import { useEffect, useState } from 'react';
import { Card, SparkAreaChart, AreaChart } from '@tremor/react';
import Modal from 'react-modal';

interface ChartData {
  date: string;
  priceUsd: string;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  chartData: ChartData[];
}

// تنظیمات برای Modal
Modal.setAppElement('#__next');  // تغییر به id عنصر اصلی

const CoinCard: React.FC<{ coin: CoinData; onClick: () => void }> = ({ coin, onClick }) => (
  <Card className="flex-1 mx-2 flex items-center justify-between px-4 py-3.5 mb-4 cursor-pointer" onClick={onClick}>
    <div className="flex items-center space-x-2.5">
      <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">{coin.symbol}</p>
      <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{coin.name}</span>
    </div>
    <SparkAreaChart
      data={coin.chartData}
      categories={['priceUsd']}
      index={'date'}
      colors={['emerald']}
      className="h-8 w-20 sm:h-10 sm:w-36"
    />
    <div className="flex items-center space-x-2.5">
      <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {parseFloat(coin.priceUsd).toFixed(2)}
      </span>
      <span className={`rounded px-2 py-1 text-tremor-default font-medium ${parseFloat(coin.changePercent24Hr) >= 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
        {parseFloat(coin.changePercent24Hr).toFixed(2)}%
      </span>
    </div>
  </Card>
);

const CoinDetails: React.FC<{ coin: CoinData; isOpen: boolean; onClose: () => void }> = ({ coin, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-content" overlayClassName="modal-overlay">
    <Card>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{coin.name} Details</h3>
      <AreaChart
        className="mt-4 h-72"
        data={coin.chartData}
        index="date"
        categories={['priceUsd']}
        colors={['blue']}
        yAxisWidth={30}
      />
      <div className="mt-4">
        <p>Current Price: {parseFloat(coin.priceUsd).toFixed(2)}</p>
        <p>Change (24h): {parseFloat(coin.changePercent24Hr).toFixed(2)}%</p>
      </div>
      <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
    </Card>
  </Modal>
);

export default function CoinsPage() {
  const [data, setData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchData = () => {
    fetch('/api/getC')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching coins data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const openModal = (coin: CoinData) => {
    setSelectedCoin(coin);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCoin(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data.length) {
    return <p>No data available</p>;
  }

  return (
    <div className="relative overflow-hidden h-36">
      <div className="flex animate-scroll">
        {data.map(coin => (
          <CoinCard key={coin.id} coin={coin} onClick={() => openModal(coin)} />
        ))}
        {data.map(coin => (
          <CoinCard key={`duplicate-${coin.id}`} coin={coin} onClick={() => openModal(coin)} />
        ))}
      </div>
      {selectedCoin && (
        <CoinDetails coin={selectedCoin} isOpen={modalIsOpen} onClose={closeModal} />
      )}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 20s linear infinite;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 4px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }
      `}</style>
    </div>
  );
}
