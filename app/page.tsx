/* eslint-disable @next/next/no-html-link-for-pages */
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar"


export default function Home() {
  return (
<>
<div className=" bg-[#191919] px-8 flex flex-col items-center justify-center min-h-screen ">
 <Navbar/>

  <div className=" flex justify-center flex-col items-center gap-4 ">

    <a href="/token-tools" className="bg-btn mt-4 w-full text-center rounded-md px-4 py-2 font-semibold text-white">Token Tools</a>
    <a href="/" className="bg-btn mt-4 w-full rounded-md text-center px-4 py-2 font-semibold text-white">Pool Manager</a>
    <a href="/wallet-manger" className="bg-btn mt-4 w-full rounded-md text-center px-4 py-2 font-semibold text-white">Wallet Manager</a>
    <a href="/" className="bg-btn mt-4 w-full rounded-md px-4 py-2 text-center font-semibold text-white">Settings</a>
  </div>
  <Footer/>
</div>
</>
  );
}
