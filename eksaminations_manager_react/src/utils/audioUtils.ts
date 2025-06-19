export const playAlarmSound = () => {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for alarm sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set alarm sound properties
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.5);
    
    // Set volume
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    // Start and stop the alarm
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (error) {
    console.error('Failed to play alarm sound:', error);
  }
}; 