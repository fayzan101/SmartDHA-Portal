"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout";
import apiClient from "@/lib/apiClient";

export default function ProfilePage() {
  const pageTitle = "View Profile";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(
          "/api/smartdha/user/getprofiledetail"
        );

        setProfile(response.data);
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // FIELD CARD UI
  const FieldCard = ({
    label,
    value,
  }: {
    label: string;
    value: any;
  }) => (
    <div className="bg-white shadow-md rounded-xl p-4">
      <p className="text-[#30B33D] text-sm font-medium mb-1">
        {label}
      </p>
      <p className="text-gray-600 text-[15px] font-small">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <DashboardLayout
      pageTitle={pageTitle}
      showBackButton={true}
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-semibold text-black">
              {/* User Profile */}
            </h2>
          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={() =>
              router.push("/profile/edit")
            }
            className="bg-[#30B33D] hover:opacity-90 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
          >
            Edit Profile
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading profile...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* LEFT COLUMN */}
            <div className="space-y-5">

              <FieldCard
                label="Name"
                value={profile?.name}
              />

              <FieldCard
                label="User Name"
                value={profile?.userName}
              />

              <FieldCard
                label="CNIC"
                value={profile?.cnic}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">

              <FieldCard
                label="Email"
                value={
                  profile?.email ||
                  profile?.registteredEmail
                }
              />

              <FieldCard
                label="Mobile Number"
                value={
                  profile?.mobileNumber ||
                  profile?.phoneNumber ||
                  profile?.registteredMobileNumber
                }
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}