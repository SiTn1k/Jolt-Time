import { useRef, useCallback, useState, useEffect } from 'react';
import { TapEvent, Epoch } from '../types/game';
import { formatNumber } from '../lib/utils';
import { Sparkles, Zap, Star } from 'lucide-react';

// Easter egg letters for "Sit Studio"
const EASTER_EGG_LETTERS = ['S', 'i', 't', ' ', 'S', 't', 'u', 'd', 'i', 'o'];
const EASTER_EGG_CHANCE = 0.01; // 1% chance (1 in 100 active users)

interface TapAreaProps {
  epoch: Epoch;
  onTap: (x: number, y: number) => void;
  tapEvents: TapEvent[];
  tapPower: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  passiveXp: number;
  currency: number;
  currencyIcon: string;
  topOffset?: number;
  currentEpochIndex?: number;
  totalEpochs?: number;
  prestigeLevel?: number;
}

// Lucky event types for interesting tap mechanics
interface LuckyEvent {
  id: string;
  x: number;
  y: number;
  type: 'crit' | 'frenzy' | 'golden' | 'easter_egg';
  value: number;
  letter?: string;
  createdAt: number;
}

export function TapArea({
  epoch,
  onTap,
  tapEvents,
  tapPower,
  level,
  xp,
  xpToNextLevel,
  passiveXp,
  currency,
  currencyIcon,
  topOffset = 0,
  currentEpochIndex = 0,
  totalEpochs = 12,
  prestigeLevel = 0,
}: TapAreaProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [luckyEvents, setLuckyEvents] = useState<LuckyEvent[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [comboTimer, setComboTimer] = useState<NodeJS.Timeout | null>(null);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [showEasterEggComplete, setShowEasterEggComplete] = useState(false);
  const tapCountRef = useRef(0);

  // Load collected letters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sit_studio_letters');
    if (saved) {
      try {
        setCollectedLetters(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  // Save collected letters
  useEffect(() => {
    localStorage.setItem('sit_studio_letters', JSON.stringify(collectedLetters));
  }, [collectedLetters]);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!areaRef.current) return;

    const rect = areaRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Combo system
    tapCountRef.current++;
    setComboCount(prev => Math.min(prev + 1, 100));

    // Reset combo timer
    if (comboTimer) clearTimeout(comboTimer);
    setComboTimer(setTimeout(() => setComboCount(0), 1500));

    // Lucky events (5% base chance, +1% per prestige level)
    const luckyChance = 0.05 + (prestigeLevel * 0.01);

    // Easter egg check (1% chance)
    if (Math.random() < EASTER_EGG_CHANCE) {
      const missingLetters = EASTER_EGG_LETTERS.filter(l => !collectedLetters.includes(l));
      if (missingLetters.length > 0) {
        const randomLetter = missingLetters[Math.floor(Math.random() * missingLetters.length)];
        const newLetters = [...collectedLetters, randomLetter];
        setCollectedLetters(newLetters);

        const eventId = Math.random().toString(36).substr(2, 9);
        setLuckyEvents(prev => [...prev.slice(-4), {
          id: eventId,
          x, y,
          type: 'easter_egg',
          value: tapPower * 10,
          letter: randomLetter,
          createdAt: Date.now()
        }]);

        // Check for complete word
        if (EASTER_EGG_LETTERS.every(l => newLetters.includes(l))) {
          setShowEasterEggComplete(true);
        }
      }
    } else if (Math.random() < luckyChance) {
      // Regular lucky event
      const eventId = Math.random().toString(36).substr(2, 9);
      const eventType: 'crit' | 'frenzy' | 'golden' = Math.random() < 0.33 ? 'crit' : Math.random() < 0.5 ? 'frenzy' : 'golden';

      setLuckyEvents(prev => [...prev.slice(-4), {
        id: eventId,
        x, y,
        type: eventType,
        value: eventType === 'crit' ? tapPower * 3 : eventType === 'golden' ? tapPower * 5 : tapPower * 2,
        createdAt: Date.now()
      }]);
    }

    onTap(x, y);
  }, [onTap, tapPower, prestigeLevel, collectedLetters, comboTimer]);

  // Clean up old lucky events
  useEffect(() => {
    const interval = setInterval(() => {
      setLuckyEvents(prev => prev.filter(e => Date.now() - e.createdAt < 2000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const xpPercent = (xp / xpToNextLevel) * 100;
  const epochProgress = ((level - epoch.levelRange.min) / (epoch.levelRange.max - epoch.levelRange.min)) * 100;

  // Combo multiplier display
  const comboMultiplier = comboCount >= 10 ? 1.5 : comboCount >= 25 ? 2 : comboCount >= 50 ? 3 : 1;

  return (
    <div className="relative flex-shrink-0 flex flex-col" style={{ height: `calc(50vh - ${topOffset}px)` }}>
      {/* Enhanced Header Stats */}
      <div
        className="p-3 sm:p-4 text-white"
        style={{ background: epoch.bgGradient }}
      >
        {/* Epoch Title & Period */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                Епоха {currentEpochIndex + 1}/{totalEpochs}
              </span>
              {prestigeLevel > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/30 text-yellow-300">
                  <Star className="w-3 h-3 inline mr-1" />
                  Престиж {prestigeLevel}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              {epoch.name.ua}
            </h2>
            <p className="text-[10px] sm:text-xs opacity-80 italic">
              {epoch.period.ua}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold">
              {currencyIcon} {formatNumber(currency)}
            </div>
            <div className="text-[10px] sm:text-xs opacity-80">+{formatNumber(passiveXp)}/с XP</div>
          </div>
        </div>

        {/* Easter Egg Progress (hidden until first letter collected) */}
        {collectedLetters.length > 0 && (
          <div className="mb-2 bg-white/10 rounded-lg px-2 py-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-purple-300">
                {EASTER_EGG_LETTERS.map((l, i) => (
                  <span key={i} className={collectedLetters.includes(l) ? 'text-yellow-400 font-bold' : 'opacity-30'}>
                    {l}
                  </span>
                ))}
              </span>
              <span className="text-gray-400 ml-2">({collectedLetters.length}/{EASTER_EGG_LETTERS.length})</span>
            </div>
          </div>
        )}

        {/* Historical Description */}
        <p className="text-[10px] sm:text-xs opacity-70 mb-2 line-clamp-1">
          {epoch.description.ua}
        </p>

        {/* Level Progress */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] sm:text-xs mb-1">
            <span>Рівень {level}</span>
            <span className="opacity-80">{Math.round(epochProgress)}% епохи</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white/80 to-white transition-all duration-100 rounded-full"
              style={{ width: `${Math.min(epochProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-black/30 rounded-full h-2 sm:h-2.5 overflow-hidden">
          <div
            className="h-full bg-[#FFC72C]/80 transition-all duration-100 rounded-full"
            style={{ width: `${Math.min(xpPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs mt-0.5 opacity-80">
          <span>{formatNumber(xp)}/{formatNumber(xpToNextLevel)} XP</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Тап: +{formatNumber(tapPower)}
          </span>
        </div>
      </div>

      {/* Tap Area */}
      <div
        ref={areaRef}
        className="flex-1 relative overflow-hidden cursor-pointer select-none touch-manipulation"
        style={{
          background: epoch.bgGradient,
        }}
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {/* Combo Counter */}
        {comboCount >= 5 && (
          <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-sm font-bold ${
            comboCount >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black animate-pulse' :
            comboCount >= 25 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
            'bg-white/20 text-white'
          }`}>
            <Zap className="w-4 h-4 inline mr-1" />
            Комбо x{comboCount} {comboMultiplier > 1 && `(${comboMultiplier}x)`}
          </div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Central Icon - pulsing on combo */}
        <div className={`absolute inset-0 flex items-center justify-center ${comboCount >= 25 ? 'animate-pulse' : ''}`}>
          <div className="text-6xl sm:text-8xl transform hover:scale-110 transition-transform duration-150 active:scale-95 drop-shadow-lg">
            {epoch.currencyIcon}
          </div>
        </div>

        {/* Tap Power Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm backdrop-blur-sm">
          Тап: +{tapPower} XP
        </div>

        {/* Floating Tap Events */}
        {tapEvents.map(event => {
          const isBig = event.value >= 100;
          const jitter = ((event.createdAt % 5) - 2) * 8;
          return (
            <div
              key={event.id}
              className={`absolute pointer-events-none font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none ${
                isBig
                  ? 'animate-float-up-big text-yellow-300 text-2xl sm:text-3xl'
                  : 'animate-float-up text-white text-lg sm:text-xl'
              }`}
              style={{
                left: event.x - 20 + jitter,
                top: event.y - 20,
                textShadow: isBig ? '0 0 12px rgba(251,191,36,0.6)' : undefined,
              }}
            >
              +{event.value}
            </div>
          );
        })}

        {/* Lucky Events (Crit, Frenzy, Golden, Easter Egg) */}
        {luckyEvents.map(event => (
          <div
            key={event.id}
            className={`absolute pointer-events-none font-black animate-float-up-big select-none ${
              event.type === 'easter_egg' ? 'text-purple-400 text-3xl' :
              event.type === 'golden' ? 'text-yellow-400 text-3xl animate-pulse' :
              event.type === 'crit' ? 'text-red-400 text-2xl' :
              'text-cyan-400 text-2xl'
            }`}
            style={{
              left: event.x - 30,
              top: event.y - 30,
              textShadow: '0 0 20px rgba(255,255,255,0.8)',
            }}
          >
            {event.type === 'easter_egg' ? (
              <div className="text-center">
                <div className="text-4xl">{event.letter}</div>
                <div className="text-xs">+{event.value}</div>
              </div>
            ) : (
              <>
                {event.type === 'crit' && <span>КРИТ!</span>}
                {event.type === 'frenzy' && <span>FRENZY!</span>}
                {event.type === 'golden' && <span>GOLDEN!</span>}
                <div>+{event.value}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Easter Egg Complete Modal */}
      {showEasterEggComplete && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-6 max-w-sm w-full text-center border border-yellow-500">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">SIT STUDIO</h2>
            <p className="text-white mb-4">Ви зібрали всі букви! Ви один з 100 активних гравців!</p>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-yellow-300 font-bold text-lg">Нагорода: +10,000 XP!</p>
              <p className="text-sm text-gray-300 mt-2">Спеціальна нагорода від Sit Studio</p>
            </div>
            <button
              onClick={() => setShowEasterEggComplete(false)}
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Дякую!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
