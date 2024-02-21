"use client";

import { OrganizationProfile } from "@clerk/clerk-react";

const SettingsPage = () => {
  return (
    <div className="w-full flex items-center justify-center h-full">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: {
              boxShadow: "none",
              width: "90%",
            },
            card: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%",
            },
          },
        }}
      />
    </div>
  );
};

export default SettingsPage;
