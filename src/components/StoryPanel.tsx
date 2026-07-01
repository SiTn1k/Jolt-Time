import { useState, useEffect } from 'react';
import { Book, Lock, Crown, Zap, Gift, X } from 'lucide-react';
import { STORY_CHAPTERS, StoryChapter } from '../data/epochs';
import { hapticNotification } from '../lib/telegram';

interface StoryPanelProps {
  prestigeLevel: number;
  currentEpochId: string;
  completedChapters: string[];
  onChapterComplete: (chapterId: string) => void;
}

export function StoryPanel({
  prestigeLevel,
  currentEpochId,
  completedChapters,
  onChapterComplete,
}: StoryPanelProps) {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);

  const availableChapters = STORY_CHAPTERS.filter(ch =>
    ch.prestigeRequired <= prestigeLevel &&
    (!ch.epochRequired || ch.epochRequired === currentEpochId || completedChapters.includes(ch.id))
  );

  const currentChapter = availableChapters.find(ch =>
    !completedChapters.includes(ch.id) &&
    ch.prestigeRequired <= prestigeLevel
  );

  // Show notification when new chapter unlocks
  useEffect(() => {
    if (currentChapter && !completedChapters.includes(currentChapter.id)) {
      // Could show a modal or notification here
    }
  }, [currentChapter, completedChapters]);

  const handleCompleteChapter = (chapter: StoryChapter) => {
    if (!completedChapters.includes(chapter.id)) {
      onChapterComplete(chapter.id);
      hapticNotification('success');
    }
    setSelectedChapter(null);
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Book className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-lg text-white">Сюжет гри</h3>
        <span className="text-xs text-gray-400 ml-auto">
          {completedChapters.length}/{STORY_CHAPTERS.length} розділів
        </span>
      </div>

      {/* Current Chapter Highlight */}
      {currentChapter && (
        <div
          className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/40 rounded-xl p-3 mb-3 cursor-pointer"
          onClick={() => setSelectedChapter(currentChapter)}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-semibold text-yellow-400">Поточний розділ</span>
          </div>
          <h4 className="text-white font-medium">{currentChapter.title.ua}</h4>
          <p className="text-gray-300 text-xs mt-1 line-clamp-2">{currentChapter.content.ua}</p>
        </div>
      )}

      {/* Chapter List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {STORY_CHAPTERS.map(chapter => {
          const isCompleted = completedChapters.includes(chapter.id);
          const isLocked = chapter.prestigeRequired > prestigeLevel;
          const isAvailable = !isLocked && (!chapter.epochRequired || chapter.epochRequired === currentEpochId || isCompleted);

          return (
            <button
              key={chapter.id}
              onClick={() => isAvailable && setSelectedChapter(chapter)}
              disabled={isLocked}
              className={`w-full p-2 rounded-lg text-left transition-all ${
                isCompleted
                  ? 'bg-green-900/30 border border-green-500/30'
                  : isLocked
                  ? 'bg-gray-900/50 opacity-50'
                  : isAvailable
                  ? 'bg-gray-700/50 hover:bg-gray-600/50'
                  : 'bg-gray-800/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCompleted && <Crown className="w-4 h-4 text-green-400" />}
                {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                {!isCompleted && !isLocked && <Book className="w-4 h-4 text-purple-400" />}
                <span className={`text-sm font-medium ${isCompleted ? 'text-green-400' : isLocked ? 'text-gray-500' : 'text-white'}`}>
                  {chapter.title.ua}
                </span>
                {isLocked && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Престиж {chapter.prestigeRequired}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapter Detail Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/40">
            <button
              onClick={() => setSelectedChapter(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-purple-400 mb-4">{selectedChapter.title.ua}</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedChapter.content.ua}</p>

            {selectedChapter.reward && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                  <Gift className="w-4 h-4" />
                  Нагорода за завершення:
                </div>
                <div className="mt-1 text-sm">
                  {selectedChapter.reward.xp && <span className="text-green-400">+{selectedChapter.reward.xp} XP </span>}
                  {selectedChapter.reward.currency && <span className="text-yellow-400">+{selectedChapter.reward.currency} валюти </span>}
                  {selectedChapter.reward.artifact && <span className="text-purple-400">Артефакт!</span>}
                </div>
              </div>
            )}

            {!completedChapters.includes(selectedChapter.id) ? (
              <button
                onClick={() => handleCompleteChapter(selectedChapter)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Завершити розділ
              </button>
            ) : (
              <div className="text-center text-green-400 py-2">
                <Crown className="w-5 h-5 inline mr-2" />
                Розділ завершено!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
