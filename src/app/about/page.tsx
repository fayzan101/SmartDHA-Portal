"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AboutTab = "administrator" | "about";

const tabContent: Record<
  AboutTab,
  {
    title: string;
    description1: string;
    description2?: string;
    showPortrait?: boolean;
    personName?: string;
    personRole?: string;
  }
> = {
  administrator: {
    title: "Administrator Message",
    description1:
      "It is a matter of great pleasure to interact with the residents and stakeholders of Defence Housing Authority through this digital platform. DHA Karachi has emerged as one of Pakistan's leading residential destinations by offering a blend of security, modern living, and community-focused facilities.",
    description2:
      "We will continue working with dedication and vision to maintain the high living standards DHA is known for. May Allah bless us all.",
    showPortrait: true,
    personName: "Brig. Ameer Nawaz Khan",
    personRole: "Administrator DHA Karachi",
  },
  about: {
    title: "About DHA Karachi",
    description1:
      "Pakistan Defence Officers Housing Authority was established to serve armed forces officers, civilians, and their families. DHA Karachi is now one of the largest residential communities, offering a balanced lifestyle with secure neighborhoods, modern infrastructure, and essential community services.",
  },
};

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AboutTab>("administrator");
  const currentTab = tabContent[activeTab];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f7fb] p-4 md:p-6 lg:p-8 flex items-center">
      <div className={`mx-auto w-full max-w-[1600px] min-h-[90vh]
            ${activeTab === "administrator" ? "h-full" : "h-[90vh]"}
        `}>
        <section className="rounded-[26px] bg-[#f6f7fb] px-5 h-full">
          <div className="flex flex-col lg:flex-row h-full gap-12 lg:gap-20">
            
            {/* Image Section */}
            <div className="w-full">
              <div className="relative overflow-hidden rounded-[8px] bg-white shadow-[0_18px_45px_rgba(36,41,47,0.12)]" style={{ height: '100%' }}>
                <div className="relative w-full" style={{ height: '100%', minHeight: '400px' }}>
                  <Image
                    src="/images/about-image.png"
                    alt="Smart DHA City Portal"
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex w-full flex-col items-center justify-start lg:pt-8 lg:w-1/2 ">
              <Image
                src="/images/PDOHA.png"
                alt="DHA Karachi"
                width={132}
                height={132}
                className="mb-3 w-[92px] md:w-[108px] "
              />

              <h1 className="text-center text-[26px] font-semibold text-[#161c2d]">
                Welcome to DHA Karachi
              </h1>
              <p className="mt-1 text-center text-sm text-[#9aa3af]">
                Smart Society . Home For Defenders
              </p>

              <div className="mt-7 w-full rounded-[18px] bg-white p-2 shadow-[0_16px_36px_rgba(36,41,47,0.09)]">
                <div className="grid grid-cols-2 rounded-[14px] bg-[#f3f5f9] p-0 text-sm">
                  <button
                    onClick={() => setActiveTab("administrator")}
                    className={`px-3 py-3 text-center transition ${
                      activeTab === "administrator"
                        ? "bg-white font-medium text-[#30B33D] "
                        : "text-[#7e8794]"
                    }`}
                  >
                    Administrator Message
                  </button>
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`px-3 py-3 text-center transition ${
                      activeTab === "about"
                        ? "bg-white font-medium text-[#30B33D]  "
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
                          width={118}
                          height={138}
                          className="h-[138px] w-[118px] object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-[13px] leading-6">{currentTab.description1}</p>
                  <br />  
                  <p className="text-[13px] leading-6">{currentTab.description2}</p>

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
                onClick={() => router.push("/")}
                className="mt-6 min-h-12 w-full max-w-[230px] rounded-[10px] bg-[#30B33D] text-sm font-semibold text-white transition hover:bg-[#269531]"
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