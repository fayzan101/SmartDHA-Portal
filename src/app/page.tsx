"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
export default function Page() {
  const router = useRouter();
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [aboutTab, setAboutTab] = useState<"about" | "administrator">("about");

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingContact(true);
    setContactStatus("idle");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mqewgrze", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setContactStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setContactStatus("error");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const cards = [
    {
      title: "My Family",
      icon: "/icons/smart1.svg",
      description:
        "Add and manage family member details linked to your resident account for smoother access to DHA services.",
    },
    {
      title: "My Vehicle",
      icon: "/icons/smart2.svg",
      description:
        "Keep registered vehicle information organized for verification, record updates, and entry-related needs.",
    },
    {
      title: "My Property",
      icon: "/icons/smart3.svg",
      description:
        "Review your property information, ownership records, and key account-linked details in one place.",
    },
    {
      title: "My Worker",
      icon: "/icons/smart4.svg",
      description:
        "Maintain worker profiles and supporting details to help streamline routine access and record management.",
    },
    {
      title: "Visitor Pass",
      icon: "/icons/smart5.svg",
      description:
        "Create visitor passes in advance so guests can be recorded properly before arriving at the community.",
    },
    {
      title: "Luggage Pass",
      icon: "/icons/smart6.svg",
      description:
        "Request luggage movement permissions online for planned deliveries, shifting, or household transport needs.",
    },
  ];

  const featureCards = [
    {
      title: "Smart DHA",
      icon: "/icons/logo1.svg",
      description:
        "View your resident profile, linked assets, submitted requests, and important community updates from one dashboard.",
    },
    {
      title: "My Bills",
      icon: "/icons/logo2.svg",
      description:
        "Check current dues, review payment history, and keep track of billing records without visiting the office.",
    },
    {
      title: "Property Management",
      icon: "/icons/logo3.svg",
      description:
        "Access plot details, ownership information, and related records whenever you need them.",
    },
    {
      title: "DHA Club",
      icon: "/icons/logo4.svg",
      description:
        "Stay updated on club facilities, membership information, and activity access available to residents.",
    },
    {
      title: "DHA Services",
      icon: "/icons/logo5.svg",
      description:
        "Submit service-related requests and follow their status through a simpler digital process.",
    },
    {
      title: "Emergency Help",
      icon: "/icons/logo6.svg",
      description:
        "Reach important support channels quickly when you need assistance with urgent community matters.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col scroll-smooth ">
      {/* Top Info Bar */}
      <div className="w-full bg-green-600 text-white text-center py-2 text-xs">
        Access Smart DHA to manage your property, payments, passes, and
        community services in one place.
      </div>
      {/* Header */}
      <header className="flex items-center justify-between px-12 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Smart DHA City"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
          />
          <span className="font-bold text-lg">Smart DHA City</span>
        </div>
        <nav className="flex gap-8 text-sm font-medium">
          <a
            href="#"
            className="text-black font-bold"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            About us
          </a>
          <a
            href="#features"
            className="text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <a
            href="#smartdha"
            className="text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("smartdha")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Smart DHA
          </a>
          <a
            href="#contact"
            className="text-gray-700"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact
          </a>
        </nav>
        <button
          className="bg-gradient-to-r from-[#30B33D] to-[#2BD53C] hover:from-[#30B33D] hover:to-[#30B33D] duration-100 transition text-white px-10 py-2 rounded-md text-sm font-semibold"
          onClick={() => router.push("/auth/sign-in")}
        >
          Register Now
        </button>
      </header>
      {/* Hero Section */}
      <main className="flex flex-1 flex-col lg:flex-row items-center justify-between px-14 py-12 gap-8 max-w-8xl mx-auto w-full">
        {/* Left: Text */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-6xl font-medium text-black leading-[60px] mb-4">
            Your complete{" "}
            <span className="text-green-500">DHA resident portal.</span>
          </h1>
          <p className="text-gray-500 mb-8 text-xl max-w-xl">
            Smart DHA helps residents handle property records, family and
            vehicle details, visitor passes, billing, and community services
            from a single secure dashboard.
          </p>
          <div className="flex gap-4 mb-8">
            <button
              className="bg-[#30B33D] hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2"
              onClick={() => router.push("/auth/sign-in")}
            >
              Access Your Dashboard
              <ArrowRight />
            </button>
            <button
              className="border border-green-500 text-green-500 px-6 py-3 rounded-md font-semibold bg-white hover:bg-green-50"
              onClick={() => router.push("/auth/sign-in")}
            >
              Create Account
            </button>
          </div>
          <div className="flex gap-2 flex-wrap justify-center md:justify-normal font-poppins">
            <div className="bg-[#EAFDE4] p-4 rounded-md min-w-[120px] md:max-w-[250px] h-[120px] flex flex-col justify-evenly">
              <div className="text-2xl font-bold text-black mb-1">92%</div>
              <div className="text-gray-600 text-sm">
                Resident satisfaction with digital access to DHA services
              </div>
            </div>
            <div className="min-w-[120px] p-4 md:max-w-[250px] h-[120px] flex flex-col justify-evenly">
              <div className="text-2xl font-bold text-black mb-1">100K +</div>
              <div className="text-gray-600 text-sm">
                Service requests, passes, and account actions handled online
              </div>
            </div>
            <div className="min-w-[120px] p-4 md:max-w-[250px] h-[120px] flex flex-col justify-evenly">
              <div className="text-2xl font-bold text-black mb-1">4.5/5</div>
              <div className="text-gray-600 text-sm">
                User rating for convenience, speed, and ease of use
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-min">
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center w-full ">
            <div className="relative rounded-3xl overflow-hidden shadow-lg w-[550px] h-[650px] 2xl:h-[700px] 2xl:w-[860px] max-w-[1080px] max-h-[700px]">
              <Image
                src="/images/login-sideimg.jpg"
                alt="DHA Karachi"
                fill
                sizes="(min-width: 1536px) 860px, (min-width: 1024px) 550px, 100vw"
                loading="eager"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 pb-8">
            <span className="w-14 h-1.5 bg-[#30B33D] rounded-full inline-block"></span>
            <span className="w-2 h-1.5 bg-gray-200 rounded-full inline-block"></span>
            <span className="w-2 h-1.5 bg-gray-200 rounded-full inline-block"></span>
          </div>
        </div>
      </main>
      {/* More content sections as user scrolls */}
      {/* --- New Section: Video & About --- */}
      <section
        id="about"
        className="w-full flex flex-col items-center bg-white py-12 mx-auto px-14"
      >
        {/* Video Banner */}
        <div className="w-full bg-[url('/images/green-bg.png')] bg-center bg-cover rounded-3xl relative flex items-center justify-center h-[480px] mb-12 overflow-hidden">
          {/* Grid pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full"
            width="100%"
            height="100%"
            viewBox="0 0 900 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="80"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#38b44a33"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <rect width="900" height="300" fill="url(#grid)" />
          </svg>
          {/* Play Video Button */}
          <div className="relative z-10 flex flex-col items-center">
            <a
              href="https://youtu.be/qt3czRWTxPY?si=ZUEQPciUqIKEHg6Z"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white/90 px-8 py-4 rounded-full shadow-lg border-2 border-white hover:scale-105 transition-transform"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-full text-white font-bold text-lg">
                ▶
              </span>
              <span className="flex flex-col items-start">
                <span className="font-semibold text-black">Watch video</span>
                <span className="text-xs text-gray-500">
                  5 mins &nbsp;–&nbsp; Play video
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full max-w-8xl flex">
          {/* Tabs */}

          {/* Content Row */}
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-center md:items-start mx-auto w-full">
            {/* Left: Text */}
            <div className="flex-1">
              <div className="flex gap-2 mb-6">
                <button className="flex items-center gap-4   px-4 py-2 text-green-600 rounded-full border-[#30B33D] border-[1.8px] font-semibold text-sm shadow-sm">
                  <Image
                    src="/images/stars.svg"
                    alt="About Us"
                    width={20}
                    height={20}
                    style={{ width: "auto", height: "auto" }}
                  />
                  About Us
                  <Image
                    src="/images/stars.svg"
                    alt="About Us"
                    width={20}
                    height={20}
                    style={{ width: "auto", height: "auto" }}
                  />
                </button>
              </div>
              <div
                className="flex gap-1 mb-6 bg-[#F8F8F8] w-min font-poppins p-1 rounded-[10px]"
                style={{
                  boxShadow:
                    "-10px -10px 20px 0px #FFFFFF99, 3px 3px 20px 0px #AAAACC80",
                }}
              >
                <button
                  className={`flex items-center justify-center px-2 py-2 rounded-[6px] font-normal text-xs shadow w-[180px] h-[50px] whitespace-nowrap transition-colors ${
                    aboutTab === "about"
                      ? "bg-[#30B33D] text-white"
                      : "bg-white text-[#30B33D]"
                  }`}
                  onClick={() => setAboutTab("about")}
                  type="button"
                >
                  About Smart DHA
                </button>
                <button
                  className={`flex items-center justify-center px-2 py-2 rounded-[6px] font-normal text-xs shadow w-[180px] h-[50px] whitespace-nowrap transition-colors ${
                    aboutTab === "administrator"
                      ? "bg-[#30B33D] text-white"
                      : "bg-white text-[#30B33D]"
                  }`}
                  onClick={() => setAboutTab("administrator")}
                  type="button"
                >
                  Administrator Message
                </button>
              </div>
              {aboutTab === "about" ? (
                <>
                  <h2 className="text-6xl font-normal text-black mb-4 max-w-xl">
                    Building a smarter,{" "}
                    <span className="text-green-500">more sustainable future.</span>
                  </h2>
                  <p className="text-gray-500 mb-6 text-2xl max-w-[800px]">
                    DHA City Karachi, a path-breaking venture, lies on the M-9
                    Motorway and stands as Pakistan&apos;s premier smart and
                    sustainable city. This project, spanning over 22,000 acres of
                    land, has garnered international recognition for its innovative
                    approach to urban planning and development.
                  </p>
                  <p className="text-gray-500 text-2xl max-w-[800px]">
                    Certified by the Institute for Sustainable Infrastructure, USA
                    in 2014, DHA City is a testament to its commitment to
                    environmental sustainability and a smart lifestyle. The
                    city&apos;s master plan is meticulously designed to create a
                    self-sufficient and eco-friendly environment, incorporating
                    cutting-edge infrastructure and services.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-6xl font-normal text-black mb-4 max-w-3xl">
                    Message from the{" "}
                    <span className="text-green-500">Administrator.</span>
                  </h2>
                  <div className="text-gray-500 text-lg max-w-[900px] space-y-5 leading-8">
                    <p>
                      It is a matter of great pleasure for me to interact with
                      the residents and stake holders of Defence Housing
                      Authority through the medium of DHA Official Website and
                      to extend my best wishes to them.
                    </p>
                    <div className="pt-4 text-[#161C2D]">
                      <p className="text-2xl font-semibold">
                        Brig Muhammad Kashif Naeem
                      </p>
                      <p className="text-base text-gray-500">
                        Administrator, DHA City Karachi
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Right: Image */}
            <div className="flex flex-col items-center relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg w-[600px] h-[650px] ">
                <Image
                  src={
                    aboutTab === "about"
                      ? "/images/contact.png"
                      : "/images/brig-image.png"
                  }
                  alt={
                    aboutTab === "about"
                      ? "DHA Karachi"
                      : "Administrator DHA City Karachi"
                  }
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover object-bottom object-left"
                />
              </div>

              {aboutTab === "about" && (
                <>
                  {/* Trophy Card */}
                  <div className="absolute -bottom-10 left-[-40px] bg-white rounded-2xl shadow-lg py-8 px-5 w-[170px] flex flex-col items-start gap-6 border border-green-100">
                    <Image
                      src="/images/trophy.png"
                      alt="Award"
                      width={60}
                      height={60}
                      style={{ width: "auto", height: "auto" }}
                    ></Image>
                    <span className="font-medium text-[#161C2D] text-xl leading-6 tracking-wide">
                      National<br></br>Real Estate<br></br>Awards
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* --- End New Section --- */}
      {/* Features Section */}
      <section
        id="features"
        className="w-full flex flex-col items-center bg-white py-20 px-2"
      >
        {/* Features Tab */}
        <div className="flex justify-center mb-4">
          <button className="flex items-center gap-4 px-4 py-2 text-green-600 rounded-full border-[#30B33D] border-[1.8px] font-semibold text-sm shadow-sm">
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
            Features
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
          </button>
        </div>
        {/* Heading */}
        <h2 className="text-6xl font-normal text-center text-black mb-4 max-w-2xl">
          Everything you need to{" "}
          <span className="text-green-500">manage DHA online.</span>
        </h2>
        <p className="text-gray-500 text-center max-w-4xl mx-auto mb-12">
          Explore essential portal features designed to simplify resident life,
          from bill payments and property management to club access, support
          services, and emergency assistance.
        </p>
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-[0_8px_24px_0_rgba(60,72,88,0.07)] p-10 flex flex-col items-center text-center relative group cursor-pointer transition-all duration-300 hover:bg-[#30B33D]"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-[0_2px_8px_0_rgba(60,72,88,0.10)] mb-6 transition-all duration-100 group-hover:bg-white/20">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={32}
                  height={32}
                  className="group-hover:brightness-0 group-hover:invert"
                />
              </div>

              {/* Title */}
              <div className="font-bold text-green-500 text-lg mb-2 transition-all duration-300 group-hover:text-white">
                {card.title}
              </div>

              {/* Description */}
              <div className="text-gray-500 text-[14px] mb-6 transition-all duration-300 group-hover:text-white/90">
                {card.description}
              </div>

              {/* Bottom line */}
              <div className="absolute left-0 bottom-0 w-full h-1 bg-green-500 rounded-b-2xl transition-all duration-300 group-hover:bg-white/80"></div>
            </div>
          ))}
        </div>
      </section>
      {/* Smart DHA Section */}
      <section
        id="smartdha"
        className="w-full flex flex-col items-start bg-white py-20 px-2 max-w-7xl mx-auto"
      >
        {/* Tab */}
        <div className="flex mb-4">
          <button className="flex items-center gap-4 px-4 py-2 text-green-600 rounded-full border-[#30B33D] border-[1.8px] font-semibold text-sm shadow-sm">
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
            Smart DHA
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
          </button>
        </div>
        {/* Heading */}
        <h2 className="text-6xl font-normal text-black mb-2 max-w-2xl">
          Smart tools for{" "}
          <span className="text-green-500">everyday resident needs.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 flex flex-col justify-between min-h-[140px] border border-gray-200 transition-all duration-300 shadow group cursor-pointer hover:bg-[#30B33D]"
            >
              <div className="font-semibold text-2xl text-black mb-2 group-hover:text-white transition">
                {card.title}
              </div>

              <div className="flex items-center justify-between w-full">
                <span className="text-gray-500 group-hover:text-white/90 transition">
                  {card.description}
                </span>

                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={20}
                    height={20}
                    className="group-hover:invert group-hover:brightness-0"
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Mobile App Promo Section */}
      <section className="w-full flex justify-center bg-transparent py-12 px-2">
        <div
          className="w-full max-w-7xl flex flex-col md:flex-row items-stretch rounded-2xl overflow-visible relative"
          style={{ minHeight: "400px" }}
        >
          {/* Green Background Card (now covers both sides) */}
          <div className="flex-1 md:w-3/5 rounded-2xl bg-[#C7E6BD] flex flex-col justify-start pl-10 pr-0 py-10 min-h-[400px] relative z-10">
            <h2 className="text-5xl font-normal text-black mb-4 leading-10 max-w-xl">
              Smart DHA in your{" "}
              <span className="text-green-500">pocket, anytime.</span>
            </h2>
            <p className="text-gray-700 mb-6 max-w-lg text-lg">
              Use the Smart DHA app to manage your account, monitor property and
              billing details, request passes, and stay connected with essential
              DHA services wherever you are.
            </p>
            <div className="flex flex-col gap-2 items-start">
              <a
                href="https://play.google.com/store/apps/details?id=com.dhak.smartdha"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Image
                  src="/images/Play.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/smart-dha-karachi/id6757914681"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Image
                  src="/images/app.png"
                  alt="Download on the App Store"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
          {/* Phone Image Overlapping Right Side, but same green bg behind */}
          <div className="flex-1 w-0 lg:w-2/5 flex items-center justify-end pr-8 min-h-[400px] -ml-16 z-10 rounded-r-2xl absolute right-0 bottom-0">
            <Image
              src="/images/phone.png"
              alt="App Preview"
              width={470}
              height={400}
              className=" max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="w-full flex flex-col items-center bg-white py-20 px-2"
      >
        {/* Contact Tab */}
        <div className="flex justify-center mb-4">
          <button className="flex items-center gap-4 px-4 py-2 text-green-600 rounded-full border-[#30B33D] border-[1.8px] font-semibold text-sm shadow-sm">
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
            Contact
            <Image
              src="/images/stars.svg"
              alt="About Us"
              width={20}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
          </button>
        </div>
        {/* Heading */}
        <h2 className="text-6xl font-normal text-center text-black mb-10 max-w-2xl">
          Connect with the{" "}
          <span className="text-green-500">Smart DHA team.</span>
        </h2>
        {/* Contact Card */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white h-[500px]">
          {/* Left: Green Panel */}
          <div className="flex-1 bg-[#30B33D] p-10 flex flex-col justify-evenly min-w-[300px] relative">
            <div>
              <h3 className="text-white text-3xl font-bold mb-8">
                Get in touch
              </h3>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                    <Image
                      src="/icons/contact1.svg"
                      alt="Email"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <div>
                    <div className="text-white text-xs opacity-80">
                      EMAIL US
                    </div>
                    <div className="text-white font-semibold">
                      dha@dhakarachi.org
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                    <Image
                      src="/icons/contact2.svg"
                      alt="Phone"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <div>
                    <div className="text-white text-xs opacity-80">
                      PHONE NUMBER
                    </div>
                    <div className="text-white font-semibold">
                      +92 21 111-589-589
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                    <Image
                      src="/icons/contact3.svg"
                      alt="Address"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </span>
                  <div>
                    <div className="text-white text-xs opacity-80">
                      PHONE NUMBER
                    </div>
                    <div className="text-white font-semibold">
                      2-B East Street Ph-1 DHA Karachi~75500
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Socials */}
            <div className="mt-8">
              <div className="text-white text-sm mb-2 flex items-center gap-3">
                <div className="border-b-2 border-white w-[30px] h-1"></div>
                Connect with us:
              </div>

              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/DHACityKhiOfc/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-md bg-white/20 text-white hover:text-[#30B33D] hover:bg-white hover:scale-110 transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://x.com/dhakarachiofc/status/1490037348599484425"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-md bg-white/20 text-white hover:text-[#30B33D] hover:bg-white hover:scale-110 transition"
                >
                  <FaXTwitter />
                </a>

                <a
                  href="https://www.linkedin.com/company/dha-city-karachi/?originalSubdomain=pk"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-md bg-white/20 text-white hover:text-[#30B33D] hover:bg-white hover:scale-110 transition"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href="https://www.instagram.com/dhacitykhiofc/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-md bg-white/20 text-white hover:text-[#30B33D] hover:bg-white hover:scale-110 transition"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
          {/* Right: Form Panel */}
          <div className="flex-1 bg-white p-10 flex flex-col justify-center">
            <form
              className="w-full"
              onSubmit={handleContactSubmit}
            >
              {/* Row: Name + Email */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 text-left">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    className="border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 text-left">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-600 mb-1 text-left">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  className="border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              {/* Message */}
              <div className="flex flex-col mb-6">
                <label className="text-sm text-gray-600 mb-1 text-left">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about your project..."
                  className="border border-gray-200 rounded-md px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <input type="hidden" name="_subject" value="New Smart DHA contact form submission" />

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmittingContact}
                className="bg-[#30B33D] hover:bg-green-600 text-white px-8 py-3 rounded-md font-semibold flex items-center gap-2"
              >
                {isSubmittingContact ? "Sending..." : "Send Message"} <ArrowRight />
              </button>
              {contactStatus === "success" && (
                <p className="mt-4 text-sm text-green-600">
                  Your message has been sent successfully.
                </p>
              )}
              {contactStatus === "error" && (
                <p className="mt-4 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="w-full bg-[#C7E6BD] py-20 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-0 justify-between items-start min-h-[260px]">
          {/* Left: Logo and Description */}
          <div className=" min-w-[280px] w-[500px] flex flex-col gap-6 justify-center h-full">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Smart DHA City"
                width={40}
                height={40}
                className="w-10 h-10"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="font-medium text-2xl text-black">
                Smart DHA City
              </span>
            </div>
            <div className="text-gray-700 text-xl mb-2 max-w-[250px] text-justify">
              Smart DHA connects residents with property, billing, passes, and
              essential community services through one digital platform.
            </div>
            <div className="flex gap-6 mt-2">
              <a
                href="https://x.com/dhakarachiofc/status/1490037348599484425"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/x.png"
                  alt="X"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </a>

              <a
                href="https://www.facebook.com/DHACityKhiOfc/"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/fb.png"
                  alt="Facebook"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </a>

              <a
                href="https://www.instagram.com/dhacitykhiofc/"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/insta.png"
                  alt="Instagram"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </a>

              <a
                href="https://www.linkedin.com/company/dha-city-karachi/?originalSubdomain=pk"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/linkendin.png"
                  alt="LinkedIn"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
          {/* Center: Quick Links */}
          <div className=" min-w-[180px] flex flex-col justify-center h-full">
            <div className="font-semibold text-black mb-4 text-xl">
              Quick Link
            </div>
            <ul className="space-y-3 text-[#161C2D] text-xl">
              <li>
                <a href="#about" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#smartdha" className="hover:underline">
                  Smart DHA
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          {/* Right: Get In Touch */}
          <div className=" min-w-[220px] flex flex-col justify-center h-full">
            <div className="font-semibold text-black mb-4 text-xl">
              Get In Touch
            </div>
            <div className="text-[#161C2D] mb-2 text-xl">
              2-B East Street Ph-1 DHA Karachi-75500
            </div>
            <div className="text-[#161C2D] mb-2 text-xl">
              Phone: +92 21 35886401-5
            </div>
            <div className="text-[#161C2D] mb-2 text-xl">
              UAN: +92 21 111-589-589
            </div>
            <div className="text-[#161C2D] text-xl mb-2">
              dha@dhakarachi.org
            </div>
            <div className="text-[#161C2D] text-xl">DHA Helpline: 1092</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
