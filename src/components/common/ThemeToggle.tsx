import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "bdr-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const prefers =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
    document.documentElement.classList.toggle("dark", prefers);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="brutal-sm brutal-press flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground"
    >
      {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      <span className="font-mono text-[11px] font-black uppercase tracking-widest">
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
