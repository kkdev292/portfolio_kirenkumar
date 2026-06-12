import { useState, useEffect } from 'react';
import './LoadingScreen.css';

const STATUS_MESSAGES = [
  'Connecting to server',
  'Loading profile',
  'Fetching skills',
  'Loading projects',
  'Almost there',
];

const LoadingScreen = ({ progress = 0, isComplete = false }) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Trigger fade-out once loading is complete
  useEffect(() => {
    if (isComplete) {
      // Small delay so the user sees 100% briefly
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Remove from DOM after fade-out animation completes
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => setRemoved(true), 600);
      return () => clearTimeout(timer);
    }
  }, [fadeOut]);

  if (removed) return null;

  return (
    <div className={`loading-screen${fadeOut ? ' fade-out' : ''}`}>
      {/* Floating particles */}
      <div className="loader-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="loader-particle" />
        ))}
      </div>

      {/* Animated logo */}
      <div className="loader-logo-container">
        <div className="loader-orbit" />
        <div className="loader-orbit-2" />
        <div className="loader-orbit-3" />
        <span className="loader-monogram">KK</span>
      </div>

      {/* Progress section */}
      <div className="loader-progress-section">
        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="loader-status">{STATUS_MESSAGES[statusIndex]}</span>
        <div className="loader-dots">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
