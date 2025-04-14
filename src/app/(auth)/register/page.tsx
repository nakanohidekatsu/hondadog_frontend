
"use client"

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RecommendData = {
  user_id: number;
  dog_id: number;
  date: string;
  training_stroll: number;
  sound_id: number;
  mood: number;
  title: string;
};

export default function Recommend() {
  const [data, setData] = useState<RecommendData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_POINT}/profile?dog_id=1`)
      .then((res) => res.json())
      .then((json: RecommendData) => setData(json))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>おすすめの音楽</h2>
      <p><strong>User ID:</strong> {data.user_id}</p>
      <p><strong>Dog ID:</strong> {data.dog_id}</p>
      <p><strong>Date:</strong> {data.date}</p>
      <p><strong>Training Stroll:</strong> {data.training_stroll}</p>
      <p><strong>Sound ID:</strong> {data.sound_id}</p>
      <p><strong>Mood:</strong> {data.mood}</p>
      <p><strong>Title:</strong> {data.title}</p>
    
      <div>
          <Link href="/">
              <Button className="bg-blue-300 text-black cursor-pointer hover:bg-blue-400 rounded-full">
                  ←　戻る
              </Button>
          </Link>
        </div>
    
    
    
    
    </div>

        


  );
}
