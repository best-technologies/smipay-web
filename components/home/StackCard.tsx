"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import StackingCards, {
  StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards";

const cards = [
  {
    bgColor: "bg-brand-bg-primary",
    title: "Feature Title 1",
    description:
      "This is a placeholder description for the first feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-mockup.svg",
  },
  {
    bgColor: "bg-[#0015ff]",
    title: "Feature Title 2",
    description:
      "This is a placeholder description for the second feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-hero-image.png",
  },
  {
    bgColor: "bg-[#ff5941]",
    title: "Feature Title 3",
    description:
      "This is a placeholder description for the third feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-mobile-mockup.png",
  },
  {
    bgColor: "bg-[#1f464d]",
    title: "Feature Title 4",
    description:
      "This is a placeholder description for the fourth feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-mockup.svg",
  },
  {
    bgColor: "bg-brand-bg-primary",
    title: "Feature Title 5",
    description:
      "This is a placeholder description for the fifth feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-hero-image.png",
  },
  {
    bgColor: "bg-[#0015ff]",
    title: "Feature Title 6",
    description:
      "This is a placeholder description for the sixth feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-mobile-mockup.png",
  },
  {
    bgColor: "bg-[#ff5941]",
    title: "Feature Title 7",
    description:
      "This is a placeholder description for the seventh feature card. You can edit this text to describe your payment feature in detail.",
    image: "/imgs/smipay-mockup.svg",
  },
];

export default function StackCard() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
      {/* Heading and Description */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-brand-text-primary text-3xl md:text-4xl lg:text-4xl font-semibold mb-4">
          Discover Our Features
        </h2>
        <p className="text-brand-text-secondary text-sm md:text-base">
          Explore how Smipay makes your financial transactions seamless and
          effortless.
        </p>
      </div>

      {/* Stacking Cards */}
      <div className="relative">
        <StackingCards totalCards={cards.length} scaleMultiplier={0.03}>
          {cards.map(({ bgColor, description, image, title }, index) => {
            return (
              <StackingCardItem
                key={index}
                index={index}
                className="h-[500px] md:h-[600px]"
              >
                <div
                  className={cn(
                    bgColor,
                    "h-full flex-col sm:flex-row px-6 py-8 sm:px-8 sm:py-10 flex w-full rounded-lg mx-auto relative overflow-hidden"
                  )}
                >
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-center z-10 text-white space-y-4 sm:space-y-6">
                    <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl">
                      {title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed opacity-90">
                      {description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="w-full sm:w-1/2 flex items-center justify-center mt-6 sm:mt-0">
                    <div className="relative w-full aspect-square sm:aspect-auto sm:h-full max-w-[280px] sm:max-w-none">
                      <Image
                        src={image}
                        alt={title}
                        className="object-contain"
                        fill
                        sizes="(max-width: 640px) 280px, 50vw"
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
