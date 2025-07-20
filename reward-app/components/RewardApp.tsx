import React, { useState } from 'react';

const getAdToCoinRatio = (coins: number) => {
  if (coins < 500) return 1;
  if (coins < 1000) return 2;
  // Add more tiers here if needed
  return 3; // Example: 3 ads per coin for 1000+ coins
};

const RewardApp: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [email, setEmail] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [adWatching, setAdWatching] = useState(false);

  const adToCoin = getAdToCoinRatio(coins);

  const handleWatchAd = () => {
    setAdWatching(true);
    setTimeout(() => {
      setAdWatching(false);
      const newAdsWatched = adsWatched + 1;
      if (newAdsWatched >= adToCoin) {
        setCoins(coins + 1);
        setAdsWatched(0);
      } else {
        setAdsWatched(newAdsWatched);
      }
    }, 2000); // Simulate 2s ad
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !redeemCode) {
      setWithdrawMessage('Please enter both email and redeem code.');
      return;
    }
    if (coins === 0) {
      setWithdrawMessage('You need coins to withdraw.');
      return;
    }
    setWithdrawMessage(`Withdrawal request sent for ${coins} coins to ${email} with code ${redeemCode}.`);
    setCoins(0);
    setAdsWatched(0);
    setEmail('');
    setRedeemCode('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Reward System</h1>
      <div className="mb-4">
        <span className="text-lg">Coins: </span>
        <span className="font-mono text-xl">{coins}</span>
      </div>
      <div className="mb-4">
        <span className="text-sm text-gray-600">Current ad-to-coin ratio: </span>
        <span className="font-semibold">{adToCoin} ad(s) = 1 coin</span>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleWatchAd}
        disabled={adWatching}
      >
        {adWatching ? 'Watching Ad...' : 'Watch Ad'}
      </button>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Withdraw Coins</h2>
        <form onSubmit={handleWithdraw} className="space-y-2">
          <input
            type="email"
            placeholder="Email address"
            className="border px-2 py-1 rounded w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Redeem code"
            className="border px-2 py-1 rounded w-full"
            value={redeemCode}
            onChange={e => setRedeemCode(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            disabled={coins === 0}
          >
            Withdraw
          </button>
        </form>
        {withdrawMessage && (
          <div className="mt-2 text-sm text-blue-600">{withdrawMessage}</div>
        )}
      </div>
    </div>
  );
};

export default RewardApp; 