import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

const TaskTok = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
      }
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? workTime * 60 : breakTime * 60);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isBreak, workTime, breakTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  const { hours, minutes, secs } = formatTime(timeLeft);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakTime * 60 : workTime * 60);
  };

  const resetSessions = () => {
    setCompletedSessions(0);
  };

  const handleWorkTimeChange = (newTime) => {
    setWorkTime(newTime);
    if (!isBreak) setTimeLeft(newTime * 60);
  };

  const handleBreakTimeChange = (newTime) => {
    setBreakTime(newTime);
    if (isBreak) setTimeLeft(newTime * 60);
  };

  const setPreset = (workMinutes, breakMinutes) => {
    setIsRunning(false);
    setWorkTime(workMinutes);
    setBreakTime(breakMinutes);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 w-8 h-8 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-40 animate-bounce delay-300"></div>
      <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-yellow-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      <div className="absolute top-1/3 right-10 w-5 h-5 bg-blue-300 rounded-full opacity-40 animate-bounce delay-500"></div>

      <div className="max-w-6xl mx-auto">
        {/* Browser window */}
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-purple-300 overflow-hidden">
          {/* Browser header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded-full px-6 py-2 text-purple-700 text-center font-medium border-2 border-purple-200">
              www.tasktok.cute
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-purple-500 hover:text-purple-700 transition-colors p-2 hover:bg-purple-100 rounded-full"
            >
              <Settings size={20} />
            </button>
          </div>

          {/* Main content */}
          <div className="p-8">
            {/* Title and status */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                TASKTOK
              </h1>
              <p className="text-xl text-purple-600 font-medium">
                {isBreak ? '☕ Break Time!' : '🍅 Focus Time!'}
              </p>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="mb-8 p-6 bg-purple-50 rounded-2xl border-2 border-purple-200 max-w-lg mx-auto">
                <h3 className="text-purple-700 font-bold mb-4 text-center text-lg">⚙️ Timer Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-600 mb-2 font-medium">Work Time (minutes)</label>
                    <input
                      type="number"
                      value={workTime}
                      onChange={(e) => handleWorkTimeChange(parseInt(e.target.value) || 25)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none text-lg"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-600 mb-2 font-medium">Break Time (minutes)</label>
                    <input
                      type="number"
                      value={breakTime}
                      onChange={(e) => handleBreakTimeChange(parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none text-lg"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main timer and controls layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left side: Timer */}
              <div className="flex justify-center">
                <div className="relative bg-gradient-to-b from-pink-200 to-pink-300 rounded-3xl p-8 border-4 border-pink-400 shadow-2xl max-w-2xl">
                  {/* Hearts decoration */}
                  <div className="absolute top-4 left-6 text-red-500 text-2xl">❤️</div>
                  <div className="absolute top-4 right-6 text-red-500 text-2xl">❤️</div>
                  
                  {/* Timer display */}
                  <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl p-6 border-4 border-blue-300 shadow-inner">
                    <div className="flex justify-center gap-4 flex-wrap">
                      {/* Hours */}
                      <div className="bg-white rounded-xl border-3 border-yellow-400 p-6 w-24 text-center shadow-lg">
                        <div className="text-4xl font-bold text-purple-700 font-mono">
                          {hours.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-purple-500 mt-1 font-semibold">HRS</div>
                      </div>
                      
                      {/* Minutes */}
                      <div className="bg-white rounded-xl border-3 border-yellow-400 p-6 w-24 text-center shadow-lg">
                        <div className="text-4xl font-bold text-purple-700 font-mono">
                          {minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-purple-500 mt-1 font-semibold">MIN</div>
                      </div>
                      
                      {/* Seconds */}
                      <div className="bg-white rounded-xl border-3 border-yellow-400 p-6 w-24 text-center shadow-lg">
                        <div className="text-4xl font-bold text-purple-700 font-mono">
                          {secs.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-purple-500 mt-1 font-semibold">SEC</div>
                      </div>
                    </div>
                  </div>

                  {/* Slot machine handle */}
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-24 bg-purple-400 rounded-full border-3 border-purple-600 shadow-lg">
                      <div className="w-7 h-7 bg-purple-600 rounded-full -ml-1 mt-2 border-2 border-purple-800 shadow-md"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: Controls and Info */}
              <div className="space-y-8">
                {/* Sessions Counter */}
                <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 border-3 border-orange-300 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🏆</div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-orange-700">
                        {completedSessions} Sessions Complete!
                      </div>
                      <div className="text-orange-600">
                        Keep going, productivity star! ✨
                      </div>
                    </div>
                    <button
                      onClick={resetSessions}
                      className="text-orange-500 hover:text-orange-700 transition-colors underline"
                    >
                      reset
                    </button>
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleStart}
                    disabled={isRunning}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <Play size={20} />
                    START
                  </button>
                  
                  <button
                    onClick={handlePause}
                    disabled={!isRunning}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <Pause size={20} />
                    PAUSE
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <RotateCcw size={20} />
                    RESET
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div>
                  <p className="text-center text-purple-600 text-lg mb-4 font-semibold">✨ Quick Presets ✨</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPreset(25, 5)}
                      className="bg-white hover:bg-pink-50 text-pink-600 font-semibold py-3 px-4 rounded-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      25 min Focus
                    </button>
                    <button
                      onClick={() => setPreset(15, 5)}
                      className="bg-white hover:bg-pink-50 text-pink-600 font-semibold py-3 px-4 rounded-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      5 min Break
                    </button>
                    <button
                      onClick={() => setPreset(15, 15)}
                      className="bg-white hover:bg-pink-50 text-pink-600 font-semibold py-3 px-4 rounded-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      15 min Break
                    </button>
                    <button
                      onClick={() => setPreset(60, 10)}
                      className="bg-white hover:bg-pink-50 text-pink-600 font-semibold py-3 px-4 rounded-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      1 Hour Focus
                    </button>
                  </div>
                </div>

                {/* Footer text */}
                <div className="text-center">
                  <p className="text-purple-600 text-lg font-medium">
                    🌸 Stay focused, stay kawaii! 🌸
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTok;