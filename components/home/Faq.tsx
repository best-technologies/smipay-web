"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      id: 1,
      question: "What is Smipay and what can I do with the app?",
      answer:
        "Smipay is an all-in-one lifestyle app that allows you to manage your finances seamlessly. You can pay electricity bills, buy airtime and data, renew cable TV subscriptions, pay for education services (JAMB/WAEC), and create Virtual Dollar or Naira cards for online shopping.",
    },
    {
      id: 2,
      question: "Is my money safe on Smipay?",
      answer:
        "Yes. We use encryption and security protocols to ensure your personal information and funds are protected. You also have access to a complete transaction history to track every Kobo you spend in real-time.",
    },
    // {
    //   id: 3,
    //   question: "Where can I use my Smipay Virtual Dollar Card?",
    //   answer:
    //     "Your Virtual Dollar Card works globally on most international platforms. You can use it to pay for subscriptions like Netflix, Apple Music, and Spotify, or shop on websites like Amazon, AliExpress, and more.",
    // },
    {
      id: 4,
      question: "How long does it take to receive my electricity token?",
      answer:
        "It is instant. Once your payment is confirmed, the token is generated and displayed immediately on your screen. You can also view it later in your transaction history.",
    },
    {
      id: 5,
      question:
        "What should I do if a transaction fails but my money was deducted?",
      answer:
        "While transaction failures are rare, they can happen due to network issues. If this occurs, please contact our support team via the app or email support@smipay.com. We will verify the transaction and ensure your value is delivered or your money is refunded.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-24">
      {/* Heading and Description */}
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-brand-text-primary text-xl md:text-4xl lg:text-4xl font-semibold mb-4">
          Got Questions? We&apos;ve Got Answers
        </h2>
        <p className="text-brand-text-secondary text-sm md:text-base">
          Everything you need to understand how the platform works
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="bg-[#F9F8FA] rounded-sm overflow-hidden">
            {/* Question Button */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-6 text-left transition-all"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-brand-text-primary text-sm md:text-base font-medium pr-4">
                {faq.question}
              </h3>
              <div className="shrink-0 w-8 h-8 rounded-full bg-brand-bg-primary flex items-center justify-center transition-transform duration-300">
                <ChevronDown
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Answer Content with Animation */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
