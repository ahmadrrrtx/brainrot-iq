import { useState, useCallback, useRef } from "react";
import { storage, SOUND_ENABLED_KEY } from "../constants";
import { storage as storageUtil } from "../utils";

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(
    storageUtil.get(SOUND_ENABLED_KEY, true)
  );
  const audioContextRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency, duration, type = "sine", volume = 0.3) => {
      if (!soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch (e) {
        // Silent fail
      }
    },
    [soundEnabled, getAudioContext]
  );

  const sounds = {
    correct: () => {
      playTone(523, 0.1, "sine", 0.4);
      setTimeout(() => playTone(659, 0.1, "sine", 0.4), 100);
      setTimeout(() => playTone(784, 0.2, "sine", 0.4), 200);
    },
    incorrect: () => {
      playTone(300, 0.15, "sawtooth", 0.3);
      setTimeout(() => playTone(200, 0.3, "sawtooth", 0.2), 150);
    },
    click: () => playTone(800, 0.05, "sine", 0.2),
    tick: () => playTone(1000, 0.05, "square", 0.1),
    warning: () => {
      playTone(400, 0.1, "square", 0.3);
      setTimeout(() => playTone(350, 0.1, "square", 0.3), 150);
    },
    complete: () => {
      const notes = [523, 659, 784, 1047];
      notes.forEach((note, i) => {
        setTimeout(() => playTone(note, 0.3, "sine", 0.4), i * 150);
      });
    },
    levelUp: () => {
      [400, 500, 600, 800].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, "sine", 0.3), i * 100);
      });
    },
  };

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      storageUtil.set(SOUND_ENABLED_KEY, next);
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound, sounds };
};
