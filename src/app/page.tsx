"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Postspage() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [paused, setPaused] = useState(false); // ✅ 一時停止状態のフラグを追加
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const searchParams = useSearchParams();
  const musicId = searchParams.get("musicId");

  useEffect(() => {
    // ✅ バックエンドを使わず固定のタイマー候補を使用
    setNumbers([5, 10, 15, 20]);
  }, []);

  const display = index === numbers.length ? "" : numbers[index];

  const handleStartTimer = () => {
    if (display) {
      const seconds = display * 60;
      setTimeLeft(seconds);
      setTimerActive(true);
      setTimerFinished(false);
      setPaused(false); // ✅ タイマースタート時は一時停止状態を解除
      startAudio();     // ✅ タイマースタートと同時に音楽再生
    }
  };

  useEffect(() => {
    if (!timerActive || timeLeft === null || paused) return; // ✅ 一時停止中はカウントしない
    if (timeLeft === 0) {
      setTimerActive(false);
      setTimerFinished(true);
      stopAudio(); // ✅ タイマー終了時に音楽停止
      return;
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => (prev ?? 0) - 1);
    }, 1000);
    return () => clearTimeout(timerRef.current!);
  }, [timeLeft, timerActive, paused]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const context = new AudioContext();
    setAudioContext(context);
  }, []);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!musicId || !audioContext) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_POINT}/music/${musicId}`);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(decoded);
    };
    fetchAudio();
  }, [musicId, audioContext]);

  const startAudio = () => {
    if (audioBuffer && audioContext) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      sourceRef.current = source;
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
  };

  const handlePause = () => {
    setPaused(true); // ✅ タイマーを一時停止
    stopAudio();     // ✅ 音楽を一時停止（停止）
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleResume = () => {
    setPaused(false); // ✅ タイマーを再開
    startAudio();     // ✅ 音楽を再開（再生）
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-20 px-4">
      <Avatar className="w-15 h-15">
        <AvatarImage src="/images/dog.jpg" />
        <AvatarFallback>dog-name</AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-bold mb-8">Dogital Drivers</h1>

      {/* Step 1: 音楽選択・再生 */}
      <div className="w-full max-w-sm bg-green-100 shadow-md p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-2">Step 1</h2>
        <p>ワンちゃんのリラックス♫</p>
        <Link href="/music2">
          <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
            ▶音楽を選ぶ
          </button>
        </Link>
      </div>

      {/* Step 2: 時間選択ボタンに修正済み */}
      <div className="w-full max-w-sm bg-green-100 shadow-md p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-2">Step 2</h2>
        <p>お出かけまで、あと何分？</p>
        <div className="text-4xl text-center font-bold mb-4 text-green-700">
          {display ? `${display} 分` : "時間未選択"}
        </div>
        <div className="flex justify-center gap-4">
          {[5, 10, 15].map((min) => (
            <button
              key={min}
              onClick={() => setIndex(numbers.indexOf(min))}
              className="bg-green-200 font-bold px-4 py-2 rounded-full text-lg cursor-pointer"
            >
              {min}分
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: 一時停止と再開を切り替え表示 */}
      <div className="w-full max-w-sm bg-green-100 shadow-md p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-2">Step 3</h2>
        <p>カウントダウン</p>
        <button
          onClick={handleStartTimer}
          disabled={!display}
          className={`font-bold px-6 py-3 rounded-full text-lg cursor-pointer ${
            timerFinished ? "animate-blink bg-green-400" : "bg-green-300"
          }`}
        >
          {timerFinished ? "さぁ！お出かけ ♪" : "▶タイマースタート"}
        </button>

        {timerActive && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="text-3xl font-bold text-blue-700">
              残り: {formatTime(timeLeft ?? 0)}
            </div>
            {paused ? (
              <button
                onClick={handleResume}
                className="bg-yellow-300 font-bold px-4 py-2 rounded-full text-lg"
              >
                ▶再開
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-red-300 font-bold px-4 py-2 rounded-full text-lg"
              >
                ⏸一時停止
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
