import Image from "next/image";
import AppStoreButtons from "../AppStoreButtons";

export default function DownloadApp() {
  return (
    <section className="bg-white mx-auto max-w-7xl px-4 md:px-6 py-16">
      <div className="bg-brand-bg-primary border-b border-brand-bg-primary rounded-xl md:rounded-2xl h-[583px] min-[375px]:h-[522px] min-[425px]:h-[500px] md:h-[570px] lg:h-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content and buttons */}
          <div className="px-6 sm:px-8 md:px-12 lg:pl-8 lg:pr-8 xl:px-16 py-8 md:py-12 lg:py-16">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 md:mb-6 leading-tight text-center lg:text-left">
              Make Life Easier with One Download
            </h2>
            <p className="text-white/90 text-sm mb-6 md:mb-8 leading-relaxed text-center lg:text-left">
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
          <div className="relative flex items-end justify-center lg:justify-end px-6 pb-0 lg:pr-8">
            {/* First phone mockup - positioned higher and to the right, overlapping */}
            <div className="absolute -bottom-[165px] md:-bottom-[195px] lg:-bottom-50 right-[35%] md:right-[46%] lg:right-[30%] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60 h-auto z-20">
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
            <div className="absolute -bottom-[165px] md:-bottom-[195px] lg:-bottom-50 right-[15%] md:right-[20%] lg:right-[10%] w-[180px] sm:w-[200px] md:w-[220px] lg:w-60 h-auto z-10">
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
