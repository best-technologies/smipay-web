import Image from "next/image";
import AppStoreButtons from "../AppStoreButtons";

export default function DownloadApp() {
  return (
    <section className="bg-white mx-auto max-w-7xl px-4 md:px-6 py-10 sm:py-16">
      <div className="bg-brand-bg-primary border-b border-brand-bg-primary rounded-xl md:rounded-2xl h-[460px] min-[375px]:h-[440px] min-[425px]:h-[420px] sm:h-[500px] md:h-[570px] lg:h-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left side - Text content and buttons */}
          <div className="px-4 sm:px-6 md:px-12 lg:pl-8 lg:pr-8 xl:px-16 py-6 sm:py-8 md:py-12 lg:py-16">
            <h2 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-4 md:mb-6 leading-tight text-center lg:text-left">
              Make Life Easier with One Download
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8 leading-relaxed text-center lg:text-left">
              Download the app and start making everyday payments faster,
              easier, and more secure. No stress, no long processes, just smooth
              transactions whenever you need them.
            </p>
            <span className="hidden md:flex justify-center items-center lg:hidden">
              <AppStoreButtons />
            </span>
            <span className="md:hidden lg:flex justify-start items-center">
              <AppStoreButtons />
            </span>
          </div>

          {/* Right side - Mockup images */}
          <div className="relative flex items-end justify-center lg:justify-end px-4 sm:px-6 pb-0 lg:pr-8">
            {/* First phone mockup - positioned higher and to the right, overlapping */}
            <div className="absolute -bottom-[130px] sm:-bottom-[165px] md:-bottom-[195px] lg:-bottom-50 right-[35%] md:right-[46%] lg:right-[30%] w-[140px] sm:w-[180px] md:w-[220px] lg:w-60 h-auto z-20">
              {/* Mobile image */}
              <Image
                src="/svgs/misc/smipay-mobile-mockup-03.svg"
                alt="Smipay Mobile App Interface"
                width={240}
                height={520}
                className="w-full h-auto object-contain lg:hidden"
                priority
              />
              {/* Desktop image */}
              <Image
                src="/svgs/misc/smipay-mobile-mockup-01.svg"
                alt="Smipay Mobile App Interface"
                width={240}
                height={520}
                className="w-full h-auto object-contain hidden lg:block"
                priority
              />
            </div>

            {/* Second phone mockup - positioned lower and to the left */}
            <div className="absolute -bottom-[130px] sm:-bottom-[165px] md:-bottom-[195px] lg:-bottom-50 right-[15%] md:right-[20%] lg:right-[10%] w-[140px] sm:w-[180px] md:w-[220px] lg:w-60 h-auto z-10">
              {/* Mobile image */}
              <Image
                src="/svgs/misc/smipay-mobile-mockup-04.svg"
                alt="Smipay Mobile App Interface"
                width={240}
                height={520}
                className="w-full h-auto object-contain lg:hidden"
                priority
              />
              {/* Desktop image */}
              <Image
                src="/svgs/misc/smipay-mobile-mockup-02.svg"
                alt="Smipay Mobile App Interface"
                width={240}
                height={520}
                className="w-full h-auto object-contain hidden lg:block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
