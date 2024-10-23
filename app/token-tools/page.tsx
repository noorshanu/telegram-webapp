/* eslint-disable @next/next/no-html-link-for-pages */
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar"


export default function ToolToken() {
  return (
<>
<div className=" bg-[#191919] px-8 flex flex-col items-center justify-center min-h-screen ">
 <Navbar/>

  <div className=" flex justify-center flex-col items-center gap-4 ">

    <a href="/create-token" className="bg-btn mt-4 w-full text-center rounded-md px-4 py-2 font-semibold text-white">Create Token</a>

    <a href="/list-token" className="bg-btn mt-4 w-full rounded-md text-center px-4 py-2 font-semibold text-white">List Token</a>
  
  </div>
  <Footer/>
</div>
</>
  );
}
