import React from 'react'
import Image from "next/image";
const Navbar = () => {
  return (
    <div className=" mt-4">
    <Image src="/logo.png" className="mx-auto py-2" alt={""} width={200} height={200}/>
  </div>
  )
}

export default Navbar