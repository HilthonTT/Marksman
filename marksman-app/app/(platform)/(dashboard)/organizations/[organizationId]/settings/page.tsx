"use client";

import { OrganizationProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const SettingsPage = () => {
  const { theme } = useTheme();

  const currentTheme = theme === "dark" ? dark : undefined;

  return (
    <div className="w-full flex items-center justify-center h-full">
      <OrganizationProfile
        appearance={{
          baseTheme: currentTheme,
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
