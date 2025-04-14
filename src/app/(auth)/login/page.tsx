"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [filterNode, setFilterNode] = useState<BiquadFilterNode | null>(null);
  const [currentGain, setCurrentGain] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  

  useEffect(() => {
    const initAudio = async () => {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_POINT}/get_misic?souund_id=1`);
        const arrayBuffer = await res.arrayBuffer();
        console.log("音声バイナリサイズ:", arrayBuffer.byteLength);
    
        const decoded = await context.decodeAudioData(arrayBuffer);
        console.log("decodeAudioData 成功:", decoded); // ← ここ追加
        setAudioBuffer(decoded);
        setFileName("music from API");
      } catch (err) {
        console.error("音声の取得・デコードに失敗しました:", err);
      }
    };

    initAudio();
  }, []);



  const startAudio = async () => {
    if (audioBuffer && audioContext) {
      // AudioContext が suspended 状態の場合、再生前に resume を呼ぶ
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      
      // 既存のソースがあれば停止
      if (sourceNode) {
        sourceNode.stop();
      }
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // イコライジング用フィルタ（peaking タイプ）
      const filter = audioContext.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = 8000;
      filter.gain.value = currentGain;
      filter.Q.value = 100;

      // // 周波数スペクトル表示用 AnalyserNode
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048 ;

      // ノードの接続：source → filter → analyser → 出力
      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(audioContext.destination);

      source.start();
      setSourceNode(source);
      setFilterNode(filter);
      
    }
  };

  const stopAudio = () => {
    if (sourceNode) {
      sourceNode.stop();
      setSourceNode(null);
    }
  };

 

  const handleWanButtonClick = (amplificationPercentage: number) => {
    if (filterNode && audioContext) {
      const gainInDB = 20 * Math.log10(1 + amplificationPercentage / 100);
      filterNode.gain.setValueAtTime(gainInDB, audioContext.currentTime);
      setCurrentGain(gainInDB);
    }
  };

  const handleWanOff = () => {
    if (filterNode && audioContext) {
      filterNode.gain.setValueAtTime(0, audioContext.currentTime);
      setCurrentGain(0);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>FastAPIから音声を取得　→　再生・周波数スペクトル表示・イコライジング</h1>
      <div>
        {fileName && <p>選択したファイル: {fileName}</p>}
      </div>
      <div style={{ margin: '20px 0' }}>
        <button onClick={startAudio}>【再生開始】</button>
        <button onClick={stopAudio}>【停止】</button>
      </div>
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => handleWanButtonClick(800)}>【ワンちゃんボタン1】</button>
        <button onClick={() => handleWanButtonClick(8000)}>【ワンちゃんボタン2】</button>
        <button onClick={() => handleWanButtonClick(80000)}>【ワンちゃんボタン3】</button>
        <button onClick={handleWanOff}>【ワンちゃんOFF】</button>
      </div>
     
    </div>
  );
}