import React, { useState, useEffect, useCallback } from "react";
import "./index.css";

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

// Простые SVG иконки
const PlayIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const StopIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const ResetIcon = () => (
  <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="icon-small" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const App: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 5,
    seconds: 0,
    isRunning: false,
    totalSeconds: 300,
  });


  // Таймер обратного отсчета
  useEffect(() => {
    let interval: any;
    if (timer.isRunning && timer.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTotal = prev.totalSeconds - 1;
          if (newTotal <= 0) {
            return {
              ...prev,
              totalSeconds: 0,
              minutes: 0,
              seconds: 0,
              isRunning: false,
            };
          }
          return {
            ...prev,
            totalSeconds: newTotal,
            minutes: Math.floor(newTotal / 60),
            seconds: newTotal % 60,
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.totalSeconds]);

  const handleStart = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const handlePause = useCallback(() => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const handleStop = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      totalSeconds: 0,
      minutes: 0,
      seconds: 0,
    }));
  }, []);

  const handleReset = useCallback(() => {
    const minutes = 5;
    const seconds = 0;
    const totalSeconds = minutes * 60 + seconds;

    setTimer({
      minutes,
      seconds,
      isRunning: false,
      totalSeconds,
    });
  }, [0, 5]);

  const addTime = useCallback((minutesToAdd: number) => {
    setTimer((prev) => {
      const newTotal = prev.totalSeconds + minutesToAdd * 60;
      return {
        ...prev,
        totalSeconds: newTotal,
        minutes: Math.floor(newTotal / 60),
        seconds: newTotal % 60,
      };
    });
  }, []);


  const formatTime = (mins: number, secs: number): string => {
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerClass = (): string => {
    if (timer.totalSeconds === 0) return "timer-time danger";
    if (timer.totalSeconds <= 60) return "timer-time warning";
    return "timer-time";
  };

  return (
    <div className="timer-app">
      <div className="timer-card">
        {/* Отображение времени */}
        <div className="timer-display">
          <div className={getTimerClass()}>
            {formatTime(timer.minutes, timer.seconds)}
          </div>
          <div className="timer-status">
            {timer.isRunning ? "Running" : "Paused"}
          </div>
        </div>

        {/* Основные кнопки управления */}
        <div className="controls-main">
          {!timer.isRunning ? (
            <button
              onClick={handleStart}
              disabled={timer.totalSeconds === 0}
              className="btn btn-start"
            >
              <PlayIcon />
            </button>
          ) : (
            <button onClick={handlePause} className="btn btn-pause">
              <PauseIcon />
            </button>
          )}

          <button onClick={handleStop} className="btn btn-stop">
            <StopIcon />
          </button>

          <button onClick={handleReset} className="btn btn-reset">
            <ResetIcon />
          </button>
        </div>

        {/* Кнопки добавления времени */}
        <div className="controls-add">
          <button onClick={() => addTime(1)} className="btn btn-small">
            <PlusIcon />1 min
          </button>
          <button onClick={() => addTime(5)} className="btn btn-small">
            <PlusIcon />5 min
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
