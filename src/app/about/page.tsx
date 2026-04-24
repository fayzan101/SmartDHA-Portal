"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AboutTab = "administrator" | "about";

const tabContent: Record<
  AboutTab,
  {
    title: string;
    description: string;
    showPortrait?: boolean;
    personName?: string;
    personRole?: string;
  }
> = {
  administrator: {
    title: "Administrator Message",
    description:
      "It is a matter of great pleasure to interact with the residents and stakeholders of Defence Housing Authority through this digital platform. DHA Karachi has emerged as one of Pakistan's leading residential destinations by offering a blend of security, modern living, and community-focused facilities.",
    showPortrait: true,
    personName: "Brig. Ameer Nawaz Khan",
    personRole: "Administrator DHA Karachi",
  },
  about: {
    title: "About DHA Karachi",
    description:
      "Pakistan Defence Officers Housing Authority was established to serve armed forces officers, civilians, and their families. DHA Karachi is now one of the largest residential communities, offering a balanced lifestyle with secure neighborhoods, modern infrastructure, and essential community services.",
  },
};

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AboutTab>("administrator");
  const currentTab = tabContent[activeTab];

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="mb-4 text-lg text-white/70">About Us 02</p>

        <section className="rounded-[26px] bg-[#f6f7fb] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-8 lg:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,430px)] lg:gap-12">
            <div className="relative overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(36,41,47,0.12)]">
              <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[680px]">
                <Image
                  src="/images/about-image.png"
                  alt="Smart DHA City Portal"
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col items-center px-1 pt-2 lg:px-4 lg:pt-6">
              <Image
                src="/images/PDOHA.png"
                alt="DHA Karachi"
                width={132}
                height={132}
                className="mb-3 h-auto w-[92px] md:w-[108px]"
              />

              <h1 className="text-center text-[26px] font-semibold text-[#161c2d]">
                Welcome to DHA Karachi
              </h1>
              <p className="mt-1 text-center text-sm text-[#9aa3af]">
                Smart Society . Home For Defenders
              </p>

              <div className="mt-7 w-full rounded-[18px] bg-white p-2 shadow-[0_16px_36px_rgba(36,41,47,0.09)]">
                <div className="grid grid-cols-2 rounded-[14px] bg-[#f3f5f9] p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab("administrator")}
                    className={`rounded-[10px] px-3 py-3 text-center transition ${
                      activeTab === "administrator"
                        ? "bg-white font-medium text-[#30B33D] shadow-sm"
                        : "text-[#7e8794]"
                    }`}
                  >
                    Administrator Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("about")}
                    className={`rounded-[10px] px-3 py-3 text-center transition ${
                      activeTab === "about"
                        ? "bg-white font-medium text-[#30B33D] shadow-sm"
                        : "text-[#7e8794]"
                    }`}
                  >
                    About DHA Karachi
                  </button>
                </div>

                <div className="mt-3 rounded-[14px] bg-[#f8fafc] px-5 py-5 text-[#9aa3af] shadow-[inset_0_0_0_1px_rgba(226,232,240,0.7)]">
                  {currentTab.showPortrait && (
                    <div className="mb-4 flex justify-center">
                      <div className="overflow-hidden rounded-md shadow-sm">
                        <Image
                          src="/images/brig-image.png"
                          alt="Administrator DHA Karachi"
                          width={108}
                          height={108}
                          className="h-[108px] w-[108px] object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-[13px] leading-6">{currentTab.description}</p>

                  {currentTab.personName && (
                    <div className="mt-5">
                      <p className="text-sm font-medium text-[#6b7280]">
                        {currentTab.personName}
                      </p>
                      <p className="mt-1 text-xs text-[#b0b7c3]">
                        {currentTab.personRole}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-6 h-12 w-full max-w-[230px] rounded-[10px] bg-[#30B33D] text-sm font-semibold text-white transition hover:bg-[#269531]"
              >
                Back
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
