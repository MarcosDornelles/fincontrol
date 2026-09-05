"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LocationAutocomplete({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const timeout = setTimeout(async () => {
      if (value.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase
        .from("locations")
        .select("name")
        .ilike("name", `%${value}%`)
        .order("name")
        .limit(5);
      setSuggestions((data || []).map((l) => l.name));
    }, 200);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative" ref={boxRef}>
      <div className="relative">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          name="location"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          placeholder="Local (ex: Mercado)"
          className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => {
                setValue(s);
                setOpen(false);
              }}
              className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
