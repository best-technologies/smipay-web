"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import StackingCards, {
  StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards";

const cards = [
  {
    bgColor: "bg-[#F5F1FE]",
    badge: "Airtime & Data",
    title: "Always Stay Connected",
    description:
      "Buy airtime and data anytime without stress. Top up for yourself, friends, or family in seconds, across all major networks in Nigeria. No need to rush out or look for a vendor — fast, reliable, and transparent payments that keep you talking, browsing, and online whenever you need it.",
    image: "/imgs/stack-card-01.png",
  },
  {
    bgColor: "bg-[#FEF3EF]",
    badge: "Electricity",
    title: "Power Your Home Smoothly",
    description:
      "No more darkness or last-minute panic. Pay your electricity bills instantly, whether for home or business, and get your token immediately. We support major electricity providers nationwide, making it easy to stay powered and in control with secure payments and complete transaction history.",
    image: "/imgs/stack-card-02.png",
  },
  {
    bgColor: "bg-[#F0F1F4]",
    badge: "Cable TV",
    title: "Entertainment Without Interruptions",
    description:
      "Renew your cable subscription in a few taps and keep the movies, sports, news, and family programming running. Quick payments, instant activation, and no queues or customer service stress. Just smooth access to your favorite channels, whenever you want.",
    image: "/imgs/stack-card-03.png",
  },
  {
    bgColor: "bg-[#EDFFFF]",
    badge: "Education",
    title: "Learning Made Easy",
    description:
      "Pay for school fees and educational services across the country without paperwork or long lines. From WAEC and JAMB to institutional fees and learning platforms, everything happens in one place — secure, fast, and stress-free. Helping students focus on learning while we handle the payments.",
    image: "/imgs/stack-card-04.png",
  },
  {
    bgColor: "bg-[#E9F2FE]",
    badge: "Travel Payments",
    title: "Your Easy Way to Pay for Trips",
    description:
      "Pay for flights, hotels, and travel services directly from the app without stress. Handle your travel expenses smoothly, whether you are booking locally or internationally. Enjoy secure payments, fast processing, and full transaction tracking — making every trip easier from planning to takeoff.",
    image: "/imgs/stack-card-05.png",
  },
  {
    bgColor: "bg-[#F0F7F6]",
    badge: "Betting Wallet Funding",
    title: "Your Simple Way to Fund Your Betting Accounts",
    description:
      "Fund your favorite betting platforms quickly and securely from one place. No delays, no failed payments, and no switching between apps. Enjoy fast top-ups, reliable processing, and clear transaction history — so you can focus on the game, not the payment.",
    image: "/imgs/stack-card-06.png",
  },
];

export default function StackCard() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 sm:py-16 md:py-24 pb-20 sm:pb-30">
      {/* Heading and Description */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-brand-text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-4">
          All Your Financial Needs In One Place
        </h2>
        <p className="text-brand-text-secondary text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
          Access a comprehensive range of digital financial services designed to
          make your life easier and finances smarter.
        </p>
      </div>

      {/* Stacking Cards */}
      <div className="relative">
        <StackingCards totalCards={cards.length} scaleMultiplier={0}>
          {cards.map(({ bgColor, badge, description, image, title }, index) => {
            const isImageRight = index % 2 === 0;

            return (
              <StackingCardItem
                key={index}
                index={index}
                className="h-[420px] sm:h-[500px] md:h-[480px] lg:h-[460px] mb-4 sm:mb-6 md:mb-8"
              >
                <div
                  className={cn(
                    bgColor,
                    "h-full flex-col items-center py-4 sm:py-6 md:py-8 lg:py-10 flex w-full rounded-lg mx-auto relative overflow-hidden gap-2 sm:gap-4 md:gap-6 lg:gap-8",
                    isImageRight
                      ? "sm:flex-row-reverse px-3 sm:px-4 md:px-12 lg:px-20"
                      : "sm:flex-row px-3 sm:px-4 md:px-12 lg:px-20",
                  )}
                >
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center z-10 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 sm:px-0">
                    <div className="inline-flex items-center justify-center sm:justify-start w-fit px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full bg-brand-bg-primary text-white text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-3 md:mb-4 lg:mb-5">
                      {badge}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-brand-text-primary">
                      {title}
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-brand-text-secondary">
                      {description}
                    </p>
                  </div>

                  {/* Image */}
                  <div
                    className={cn(
                      "w-full sm:w-1/2 flex items-center mt-1 sm:mt-2 md:mt-6 sm:mt-0",
                      isImageRight
                        ? "justify-center sm:justify-start"
                        : "justify-center sm:justify-end",
                    )}
                  >
                    <div className="relative w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[320px] md:h-80 lg:w-[350px] lg:h-[350px]">
                      <Image
                        src={image}
                        alt={title}
                        className="object-contain rounded-sm"
                        fill
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 250px, (max-width: 1024px) 320px, 350px"
                      />
                    </div>
                  </div>
                </div>
              </StackingCardItem>
            );
          })}
        </StackingCards>
      </div>
    </section>
  );
}
