
/**
 * Service for providing feedback through vibration and sound
 */

// Sound effect URLs - these would be replaced with actual sound files in a real app
const SOUND_EFFECTS = {
  success: "https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3",
  error: "https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3",
  warning: "https://assets.mixkit.co/active_storage/sfx/2053/2053-preview.mp3"
};

// Cache audio objects to avoid recreating them
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Play a sound effect
 */
export const playSound = (type: 'success' | 'error' | 'warning'): void => {
  try {
    const soundUrl = SOUND_EFFECTS[type];
    
    if (!audioCache[type]) {
      audioCache[type] = new Audio(soundUrl);
    }
    
    // Reset and play
    const audio = audioCache[type];
    audio.currentTime = 0;
    
    // Some browsers require user interaction before playing audio
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio playback was prevented:', error);
      });
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

/**
 * Trigger device vibration if available
 */
export const vibrate = (pattern: number | number[]): void => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.error('Vibration failed:', error);
  }
};

/**
 * Provide feedback based on validation status
 */
export const provideFeedback = (status: 'valid' | 'invalid' | 'used'): void => {
  switch (status) {
    case 'valid':
      vibrate([100, 50, 100]);
      playSound('success');
      break;
    case 'invalid':
      vibrate([300, 100, 300]);
      playSound('error');
      break;
    case 'used':
      vibrate([100, 50, 100, 50, 100]);
      playSound('warning');
      break;
    default:
      break;
  }
};
