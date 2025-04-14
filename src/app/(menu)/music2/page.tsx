"use client";

import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Music2Page() {
  const router = useRouter();

  const setMusicId = (id: string) => {
    router.push(`/?musicId=${id}#card3`);
  };




    return (
      <div className="flex flex-col items-center py-10 px-4">

        <div className="flex items-center gap-4">
          <h1 className="sm:text-4xl md:text-5xl font-bold mb-20">
            Dogital Drivers
          </h1>          
          <Avatar className="w-15 h-15">
            <AvatarImage src="images/dog.jpg" />
            <AvatarFallback>dog-name</AvatarFallback>
          </Avatar>
          <p className="text-lg text-gray-600 mb-2">
           ワンちゃんとの快適な移動のために
          </p>      
        </div>

        <div className="w-full max-w-sm mb-2">
          <div className="bg-gray-200 p-6 rounded-full mb-2">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold mb-2">音楽を選ぶ</h2>
                <div>
                  <Link href="/">
                      <Button className="bg-blue-100 text-black cursor-pointer hover:bg-blue-200 rounded-full">
                          ←　ホームに戻る
                      </Button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
        


        <div className="w-full max-w-sm bg-green-100 p-6 rounded-xl mb-8">          
          <h2 className="text-xl font-bold mb-8">楽曲を指定する</h2>

          <div className="flex flex-col items-center gap-5">
            <button 
              onClick={() => setMusicId("001")}
              className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              ワンダホー How we move dog
            </button>
            <button 
              onClick={() => setMusicId("002")}
              className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              Peace & Honda
            </button>
            <button 
              onClick={() => setMusicId("003")}
              className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              The Power of Reggae
            </button> 
          </div>
        </div>



        <div className="w-full max-w-sm bg-green-100 p-6 rounded-xl mb-2">             
          <h2 className="text-xl font-bold mb-8">ワンちゃんのお好み</h2>
          <div className="flex flex-col items-center gap-5">
            <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              ワンちゃんモード　その１
            </button>
            <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              ワンちゃんモード　その２
            </button>
            <button className="bg-green-200 font-bold px-6 py-3 rounded-full text-lg cursor-pointer">
              ワンちゃんモード　その３
            </button>
          </div>
        </div>

        



        <div>
          <Link href="/">
              <Button className="bg-green-300 text-black cursor-pointer hover:bg-green-400 rounded-full">
                  ←　戻る
              </Button>
          </Link>
        </div>
      </div>




    )
  }
  