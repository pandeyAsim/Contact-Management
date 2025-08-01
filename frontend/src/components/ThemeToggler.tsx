"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import Dropdown from "./Dropdown"; // Your reusable Dropdown component

const ThemeToggler = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    {
      label: "Light",
      icon: <FiSun className="w-4 h-4 mr-2" />,
      value: "light",
    },
    {
      label: "Dark",
      icon: <FiMoon className="w-4 h-4 mr-2" />,
      value: "dark",
    },
    {
      label: "System",
      icon: <FiMonitor className="w-4 h-4 mr-2" />,
      value: "system",
    },
  ];

  const current = themes.find(
    (t) => t.value === theme || resolvedTheme === t.value
  );

  return (
    <Dropdown
      trigger={
        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80">
          {current?.icon}
        </div>
      }
    >
      <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
              theme === t.value
                ? "font-medium text-indigo-600 dark:text-indigo-400"
                : ""
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </Dropdown>
  );
};

export default ThemeToggler;
