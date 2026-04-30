import { ChevronRight } from "lucide-react";

const icons = [
  "/icons/credit-card-add.svg", 
  "/icons/vehicle-icon-color.svg", 
  "/icons/visitor-pass-icon-color.svg", 
  "/icons/mdi_cast-school.svg",
];

const items = [
  "Card Request",
  "Vehicle Tag",
  "New Pass",
  "School",
];

export default function QuickAccess() {
  return (
    <>
      <h2 className="text-xl font-bold">Quick Access</h2>

      <div
        className="bg-white rounded-2xl border border-[#f0f2f8] shadow-sm p-3"
        style={{ boxShadow: "0 4px 16px 0 #e9eef7" }}
      >
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 min-h-[110px] px-3 py-3 bg-white rounded-xl shadow-md border border-[#D9D9D9] hover:border-[#30B33D] transition cursor-pointer"
              style={{ boxShadow: "0 4px 24px 0 #e9eef7" }}
            >
              {/* ICON BOX */}
              <div className="w-16 h-16 flex items-center justify-center rounded-lg border border-[rgba(48,179,61,0.2)]">
                <div className="w-9 h-9 flex items-center justify-center">
                  <img
                    src={icons[i]}
                    alt={items[i]}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* TEXT */}
              <div className="font-medium text-gray-800 text-base whitespace-nowrap">
                {item}
              </div>

              {/* ARROW */}
              <ChevronRight className="w-5 h-5 text-green-400 opacity-80 group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}