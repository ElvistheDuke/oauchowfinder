import Image from "next/image";
import logo from "../public/transparent-logo.png";

function Navbar() {
  return (
    <div className="w-full absolute top-0 flex justify-center items-center h-16 z-30 gap-2 bg-white shadow-md">
      <Image src={logo} alt="Oauchow Finder Logo" width={40} height={40} />
      <h1 className="text-xl font-bold">
        <span className="text-[#1F455F]">OAU</span>{" "}
        <span className="text-[#D49851]">ChowFinder</span>
      </h1>
    </div>
  );
}

export default Navbar;
