import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
  



export default function PublicHeader() {
  return (
    <div>
        <header className="border-b bg-blue-200">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                Dogital drivers

                <div className="flex items-center gap-4">
                    <Input 
                        placeholder="アプリ内を検索"
                        className="w-[200px] lg:w-[300px]"
                    />
                    <Button variant="outline" className="bg-blue-500 text-white rounded-full" asChild>
                        <Link href="/login">
                        ログイン
                        </Link>
                    </Button>
                    <Button variant="outline" className="bg-blue-500 text-white rounded-full" asChild>
                        <Link href="/register">
                        登録
                        </Link>
                    </Button>
                </div>

            </div>
        </header>


    </div>
  )
}
