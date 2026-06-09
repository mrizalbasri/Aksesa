import { useEffect, useState } from 'react';
import { getCreditsBalance, type CreditsBalance } from '../lib/api';

export function CreditsDisplay() {
  const [credits, setCredits] = useState<CreditsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const balance = await getCreditsBalance(token);
        setCredits(balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();

    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !credits) {
    return null;
  }

  if (error) {
    console.error('Credits error:', error);
    return null;
  }

  const isPremium = credits.is_premium;
  const totalCredits = credits.total_credits;
  const isLow = !isPremium && totalCredits <= 1;

  return (
    <div className="flex items-center gap-2">
      {/* Credits Badge */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isPremium
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
            : isLow
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}
      >
        {isPremium ? (
          <>
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-white">Premium</span>
          </>
        ) : (
          <>
            <svg
              className={`w-5 h-5 ${isLow ? 'text-red-600' : 'text-blue-600'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Kredit</span>
              <span
                className={`text-lg font-bold ${
                  isLow ? 'text-red-600' : 'text-blue-600'
                }`}
              >
                {totalCredits}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Upgrade Button (only for non-premium) */}
      {!isPremium && (
        <button
          onClick={() => (window.location.href = '/pricing')}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}

export function CreditsWarning({ credits }: { credits: number }) {
  if (credits > 1) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {credits === 0 ? 'Kredit Anda Habis!' : 'Kredit Hampir Habis!'}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            {credits === 0 ? (
              <p>
                Anda tidak memiliki kredit tersisa. Upgrade ke Premium untuk
                unlimited scoring atau tunggu reset harian.
              </p>
            ) : (
              <p>
                Tersisa {credits} kredit. Kredit akan direset dalam 24 jam atau
                upgrade sekarang untuk unlimited access.
              </p>
            )}
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                onClick={() => (window.location.href = '/pricing')}
                className="bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
              >
                Upgrade Sekarang
              </button>
              <button
                onClick={() => (window.location.href = '/credits/history')}
                className="ml-3 bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
              >
                Lihat Riwayat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WelcomeBonusBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user just registered (has welcome bonus flag)
    const hasWelcomeBonus = localStorage.getItem('welcome_bonus_shown');
    if (!hasWelcomeBonus) {
      setShow(true);
      localStorage.setItem('welcome_bonus_shown', 'true');
    }
  }, []);

  if (!show) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            Selamat Datang di Aksesa! 🎉
          </h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>
              Sebagai bonus, Anda mendapat <strong>5 kredit gratis</strong>{' '}
              untuk mencoba fitur credit scoring kami. Mulai sekarang dan
              buktikan kelayakan kredit UMKM Anda!
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => (window.location.href = '/scoring')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mulai Scoring Sekarang
            </button>
            <button
              onClick={() => setShow(false)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
