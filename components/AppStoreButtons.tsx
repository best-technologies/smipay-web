import Image from "next/image";

export default function AppStoreButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <a
        href="#"
        className="inline-flex h-14 items-center gap-3 rounded-lg bg-brand-black px-4 shadow-sm transition-opacity hover:opacity-90"
      >
        <Image
          src="/svgs/misc/appstore.svg"
          alt="App Store"
          width={24}
          height={24}
        />
        <div className="flex flex-col text-white">
          <span className="text-xs leading-tight">Download on the</span>
          <span className="text-lg font-semibold leading-tight tracking-wider">
            App Store
          </span>
        </div>
      </a>
      <a
        href="#"
        className="inline-flex h-14 items-center gap-3 rounded-lg bg-brand-black px-4 shadow-sm transition-opacity hover:opacity-90"
      >
        <Image
          src="/svgs/misc/playstore.svg"
          alt="Google Play"
          width={24}
          height={24}
        />
        <div className="flex flex-col text-white">
          <span className="text-xs leading-tight">GET IT ON</span>
          <span className="text-lg font-semibold leading-tight">
            Google Play
          </span>
        </div>
      </a>
    </div>
  );
}
