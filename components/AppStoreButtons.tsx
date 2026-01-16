import Image from "next/image";

export default function AppStoreButtons() {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
      <a
        href="#"
        className="relative inline-flex h-12 sm:h-14 items-center gap-2 sm:gap-3 rounded-lg bg-brand-black px-3 sm:px-4 shadow-sm transition-opacity hover:opacity-90"
      >
        <span
          className="absolute top-0 left-0 -translate-y-1/2 text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: "#f1fcf6", color: "#00d390" }}
        >
          Coming Soon
        </span>
        <Image
          src="/svgs/misc/appstore.svg"
          alt="App Store"
          width={20}
          height={20}
          className="sm:w-6 sm:h-6"
        />
        <div className="flex flex-col text-white">
          <span className="text-[10px] sm:text-xs leading-tight">
            Download on the
          </span>
          <span className="text-sm sm:text-lg font-semibold leading-tight tracking-wider">
            App Store
          </span>
        </div>
      </a>
      <a
        href="#"
        className="relative inline-flex h-12 sm:h-14 items-center gap-2 sm:gap-3 rounded-lg bg-brand-black px-3 sm:px-4 shadow-sm transition-opacity hover:opacity-90"
      >
        <span className="absolute top-0 left-0 -translate-y-1/2 text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-[#f1fcf6] text-[#00d390]">
          Coming Soon!
        </span>
        <Image
          src="/svgs/misc/playstore.svg"
          alt="Google Play"
          width={20}
          height={20}
          className="sm:w-6 sm:h-6"
        />
        <div className="flex flex-col text-white">
          <span className="text-[10px] sm:text-xs leading-tight">
            GET IT ON
          </span>
          <span className="text-sm sm:text-lg font-semibold leading-tight">
            Google Play
          </span>
        </div>
      </a>
    </div>
  );
}
