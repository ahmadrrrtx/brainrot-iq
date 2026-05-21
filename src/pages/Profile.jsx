// src/pages/Profile.jsx
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils';

export default function Profile() {
  const navigate = useNavigate();
  const playerName = storage.get('playerName', '');
  const lastResults = storage.get('lastResults', null);

  const handleClearData = () => {
    storage.remove('playerName');
    storage.remove('lastResults');
    navigate('/');
  };

  if (!playerName) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <h1 className="text-2xl font-black text-white">👤 Profile</h1>
        </div>

        {/* Avatar Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white mx-auto mb-4">
            {playerName[0]?.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white">{playerName}</h2>
          <p className="text-gray-500 text-sm mt-1">BrainRot IQ Player</p>
        </div>

        {/* Last Result */}
        {lastResults && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-4">
              Last Quiz Result
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-black text-white">
                  {lastResults.correctCount}/{lastResults.totalQuestions}
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {lastResults.percentage}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white capitalize">
                  {lastResults.difficulty}
                </div>
                <div className="text-xs text-gray-500">Difficulty</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/quiz')}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl"
          >
            🧠 Take Quiz
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl"
          >
            🏆 View Leaderboard
          </button>
          <button
            onClick={handleClearData}
            className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-xl"
          >
            🗑️ Clear My Data
          </button>
        </div>
      </div>
    </div>
  );
}
