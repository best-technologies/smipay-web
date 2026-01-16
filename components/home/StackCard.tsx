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
    badge: "Naira Virtual Card",
    title: "Your Everyday Naira Card",
    description:
      "Make secure online payments within Nigeria without exposing your main bank details. Your Naira virtual card gives you full control — set spending limits, track every transaction, and enjoy safe, seamless payments for shopping, bills, subscriptions, and services across local platforms.",
    image: "/imgs/stack-card-05.png",
  },
  {
    bgColor: "bg-[#F0F7F6]",
    badge: "Dollar Virtual Card",
    title: "Your Card for Global Payments",
    description:
      "Shop and pay on international websites with ease. Your Dollar virtual card lets you make global purchases, manage online subscriptions, and handle foreign transactions confidently. Enjoy secure payments, flexible funding, and real-time tracking — all without needing a physical dollar account.",
    image: "/imgs/stack-card-06.png",
  },
  // {
  //   bgColor: "bg-[#F6E4F0]",
  //   badge: "Gift cards",
  //   title: "Turn Gift Cards into Real Value",
  //   description:
  //     "Buy, sell, or redeem gift cards from top international brands at competitive rates. Whether you are sending a gift or converting unused cards into cash, the process is fast, secure, and straightforward. No hidden conditions — just real value in minutes.",
  //   image: "/imgs/stack-card-07.png",
  // },
];

export default function StackCard() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 pb-30">
      {/* Heading and Description */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-brand-text-primary text-3xl md:text-4xl lg:text-4xl font-semibold mb-4">
          All Your Financial Needs In One Place
        </h2>
        <p className="text-brand-text-secondary text-sm md:text-base max-w-2xl mx-auto">
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
                className="h-[550px] md:h-[480px] lg:h-[460px] mb-6 md:mb-8"
              >
                <div
                  className={cn(
                    bgColor,
                    "h-full flex-col items-center py-6 md:py-8 lg:py-10 flex w-full rounded-lg mx-auto relative overflow-hidden gap-4 md:gap-6 lg:gap-8",
                    isImageRight
                      ? "sm:flex-row-reverse px-4 md:px-12 lg:px-20"
                      : "sm:flex-row px-4 md:px-12 lg:px-20"
                  )}
                >
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center z-10 space-y-3 md:space-y-4 lg:space-y-6 sm:px-0">
                    <div className="inline-flex items-center justify-center sm:justify-start w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-brand-bg-primary text-white text-xs md:text-sm mb-3 md:mb-4 lg:mb-5">
                      {badge}
                    </div>
                    <h3 className="font-semibold text-lg md:text-xl lg:text-2xl xl:text-3xl text-brand-text-primary">
                      {title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed text-brand-text-secondary">
                      {description}
                    </p>
                  </div>

                  {/* Image */}
                  <div
                    className={cn(
                      "w-full sm:w-1/2 flex items-center mt-2 md:mt-6 sm:mt-0",
                      isImageRight
                        ? "justify-center sm:justify-start"
                        : "justify-center sm:justify-end"
                    )}
                  >
                    <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-80 lg:w-[350px] lg:h-[350px]">
                      <Image
                        src={image}
                        alt={title}
                        className="object-contain rounded-sm"
                        fill
                        sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
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
