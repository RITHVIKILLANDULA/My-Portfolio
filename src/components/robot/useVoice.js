import { useEffect, useRef, useState } from "react";

/**
 * Voice for the robot — text-to-speech (it speaks answers) + speech recognition
 * (you talk to it). Pure Web Speech API, fully client-side. Both degrade
 * gracefully where unsupported.
 */
export default function useVoice() {
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const voiceRef = useRef(null);
  const recRef = useRef(null);
  const mutedRef = useRef(false);

  const supportsTTS =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supportsSTT = !!SR;

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // choose a clean English voice once they load
  useEffect(() => {
    if (!supportsTTS) return;
    const pick = () => {
      const vs = window.speechSynthesis.getVoices();
      voiceRef.current =
        vs.find((v) =>
          /Google US English|Samantha|Microsoft Aria|Microsoft Zira|Microsoft Guy/i.test(
            v.name
          )
        ) ||
        vs.find((v) => v.lang && v.lang.startsWith("en")) ||
        vs[0];
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    };
  }, [supportsTTS]);

  const stopSpeak = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    setSpeaking(false);
  };

  const speak = (text) => {
    if (!supportsTTS || mutedRef.current || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 1.03;
      u.pitch = 1.0;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  };

  const toggleMute = () =>
    setMuted((m) => {
      if (!m) stopSpeak();
      return !m;
    });

  const listen = (onResult) => {
    if (!supportsSTT || listening) return;
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        if (t) onResult(t);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      setListening(true);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const stopListen = () => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  };

  return {
    muted,
    speaking,
    listening,
    supportsTTS,
    supportsSTT,
    speak,
    stopSpeak,
    toggleMute,
    listen,
    stopListen,
  };
}
