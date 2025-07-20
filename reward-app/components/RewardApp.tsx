import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const getAdToCoinRatio = (coins: number) => {
  if (coins < 500) return 1;
  if (coins < 1000) return 2;
  return 3;
};

const RewardApp: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [email, setEmail] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const [adWatching, setAdWatching] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(15);
  const [canSkip, setCanSkip] = useState(false);

  const adToCoin = getAdToCoinRatio(coins);

  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3689581405597356';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // Initialize adsbygoogle array
    window.adsbygoogle = window.adsbygoogle || [];

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showAd, adTimer]);

  const handleWatchAd = () => {
    setAdWatching(true);
    setShowAd(true);
    setAdTimer(15);
    setCanSkip(false);

    // Push ad to AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log('AdSense error:', e);
    }
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setAdWatching(false);
    setAdTimer(15);
    setCanSkip(false);

    const newAdsWatched = adsWatched + 1;
    if (newAdsWatched >= adToCoin) {
      setCoins(coins + 1);
      setAdsWatched(0);
    } else {
      setAdsWatched(newAdsWatched);
    }
  };

  const handleSkipAd = () => {
    if (canSkip) {
      handleAdComplete();
    }
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg text-center relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎁 Reward System</h1>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl mr-2">🪙</span>
          <span className="text-2xl font-bold">{coins}</span>
        </div>
        <div className="text-sm opacity-90">
          Progress: {adsWatched}/{adToCoin} ads watched
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(adsWatched / adToCoin) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-blue-600">Current ratio: </span>
        <span className="font-semibold text-blue-800">{adToCoin} ad(s) = 1 coin</span>
      </div>

      <button
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 mb-6"
        onClick={handleWatchAd}
        disabled={adWatching}
      >
        {adWatching ? '📺 Watching Ad...' : '▶️ Watch Ad & Earn'}
      </button>

      {/* Ad Modal */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">📺 Advertisement</h3>
              <div className="text-sm text-gray-600 mb-4">
                {adTimer > 0 ? (
                  <span>Ad will be skippable in {adTimer} seconds...</span>
                ) : (
                  <span className="text-green-600 font-semibold">You can now skip this ad!</span>
                )}
              </div>
            </div>

            {/* AdSense Ad Unit */}
            <div className="mb-4 min-h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
              <ins 
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '250px' }}
                data-ad-client="ca-pub-3689581405597356"
                data-ad-slot="6536518954"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>

            {/* Demo Ad Content (fallback) */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6 rounded-lg text-center mb-4">
              <h4 className="text-lg font-bold mb-2">🎮 Amazing Game App!</h4>
              <p className="text-sm mb-3">Download now and get 1000 free coins!</p>
              <div className="bg-white text-purple-600 px-4 py-2 rounded-full inline-block font-semibold">
                Download Now
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {canSkip && (
                <button
                  onClick={handleSkipAd}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  ✅ Skip Ad & Claim Reward
                </button>
              )}
              
              <button
                onClick={handleAdComplete}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                🎁 Complete Ad
              </button>
            </div>

            {/* Timer Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((15 - adTimer) / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 Withdraw Coins</h2>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email address"
            className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="🔑 Redeem code"
            className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={redeemCode}
            onChange={e => setRedeemCode(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-teal-700 transition-all duration-300"
            disabled={coins === 0}
          >
            💸 Withdraw {coins} Coins
          </button>
        </form>
        {withdrawMessage && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-700">
            {withdrawMessage}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>🔒 Secure • 🚀 Fast Rewards • 📱 Mobile Friendly</p>
      </div>
    </div>
  );
};

export default RewardApp;