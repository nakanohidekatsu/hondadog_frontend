"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";

// 内部コンポーネントにて useSearchParams やその他のフックを使用する
function InnerComponent() {
  // URL パラメータ取得
  const searchParams = useSearchParams();
  const musicId = searchParams.get("musicId");

  // NEXT_PUBLIC_API_ENDPOINT が undefined になっている場合は、環境変数の設定を確認してください
  // 必要に応じてデフォルト値を設定することも検討してください
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // アバター切り替えの状態管理
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatars = [
    { src: "/images/dog1.jpg", fallback: "relax" },
    { src: "/images/dog2.jpg", fallback: "attract" },
    { src: "/images/dog3.jpg", fallback: "bored" },
  ];
  const handleAvatarClick = () => {
    setAvatarIndex((prev) => (prev + 1) % avatars.length);
  };
  const currentAvatar = avatars[avatarIndex];

  // タイマー用状態管理
  const [numbers, setNumbers] = useState<number[]>([]);
  const [index, setIndex] = useState(-1);
//  const [timeLeft, setTimeLeft] = useState(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // オーディオ再生用状態
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const sourceRef = useRef(null);

  // 固定のタイマー候補を設定
  useEffect(() => {
    setNumbers([5, 10, 15, 20]);
  }, []);

  const display = index === numbers.length ? "" : numbers[index];

  if (typeof display === "number") {  // display が number の場合のみ処理する
    const seconds = display * 60;
    setTimeLeft(seconds);
    setTimerActive(true);
    setTimerFinished(false);
    setPaused(false);
    startAudio();
  }

//  const handleStartTimer = () => {
//    if (display) {
//      const seconds = display * 60;
//      setTimeLeft(seconds);
//      setTimerActive(true);
//      setTimerFinished(false);
//      setPaused(false);
//      startAudio();
//    }
//  };

  useEffect(() => {
    if (!timerActive || timeLeft === null || paused) return;
    if (timeLeft === 0) {
      setTimerActive(false);
      setTimerFinished(true);
      stopAudio();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => (prev ?? 0) - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive, paused]);

  const formatTime = (sec) => {
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
      if (!musicId || !audioContext || !apiEndpoint) return;
      try {
        const res = await fetch(`${apiEndpoint}/get_misic?souund_id=${musicId}`);
        const arrayBuffer = await res.arrayBuffer();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(decoded);
      } catch (error) {
        console.error("音声のフェッチまたはデコードに失敗", error);
      }
    };
    fetchAudio();
  }, [musicId, audioContext, apiEndpoint]);

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
    setPaused(true);
    stopAudio();
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleResume = () => {
    setPaused(false);
    startAudio();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-20 px-4">
      <p className="text-lg text-gray-600 mb-2">
        ワンちゃんとの快適な移動のために
      </p>
      <Avatar className="w-15 h-15">
        <AvatarImage src="/images/dog.jpg" />
        <AvatarFallback>dog-name</AvatarFallback>
      </Avatar>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
        Dogital Drivers
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-blue-400 mb-8 font-bold text-center">
        ワンちゃんがリラックスする音を聞かせて、<br />
        お出かけ時のストレスを軽減
      </p>
      <p className="text-base sm:text-lg md:text-xl mb-8 text-center">
        条件反射を利用したトレーニング
      </p>

      <div className="flex space-x-10 mb-30">
        <Link href="#card1">
          <button className="bg-blue-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
            ▶トレーニング<br />（練習）モード
          </button>
        </Link>
        <Link href="#card2">
          <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
            ▶お出かけ<br />（本番）モード
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <div id="card1" className="w-full max-w-sm bg-gray-200 shadow-md p-6 rounded-full mb-8">
          <h2 className="text-xl font-bold mb-2">トレーニング（練習）モード</h2>
        </div>

        <div className="w-full max-w-sm bg-blue-100 shadow-md p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-2">pre-Step 1</h2>
          <p>ワンちゃんの準備、スタート！</p>
          <div className="flex flex-col gap-4">
            <Link href="/music">
              <button className="bg-blue-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
                ▶音楽を選ぶ
              </button>
            </Link>
            <Link href="/engine">
              <button className="bg-blue-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
                ▶エンジン音
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm bg-blue-100 shadow-md p-6 rounded-xl mb-30">
          <h2 className="text-xl font-bold mb-2">pre-Step 2</h2>
          <p>ワンちゃんの反応は？</p>
          <Avatar
            onClick={handleAvatarClick}
            className="flex flex-col w-25 h-25 mx-auto mt-4 cursor-pointer"
          >
            <AvatarImage src={currentAvatar.src} />
            <AvatarFallback>{currentAvatar.fallback}</AvatarFallback>
          </Avatar>
        </div>

        <div id="card2" className="w-full max-w-sm bg-gray-200 shadow-md p-6 rounded-full mb-8">
          <h2 className="text-xl font-bold mb-2">お出かけ（本番）モード</h2>
        </div>

        {/* Step 1 */}
        <div className="w-full max-w-sm bg-green-100 shadow-md p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-2">Step 1</h2>
          <p>ワンちゃんのリラックス♫</p>
          <div id="card3">
            <div className="flex flex-col gap-4">
              <Link href="/music2">
                <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
                  ▶音楽を選ぶ
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
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

        {/* Step 3 */}
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
    </div>
  );
}

// 外側コンポーネントで Suspense でラップすることで、useSearchParams 関連のエラーを解決
export default function MySearchComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerComponent />
    </Suspense>
  );
}