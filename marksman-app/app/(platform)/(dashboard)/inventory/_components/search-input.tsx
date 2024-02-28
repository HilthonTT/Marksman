"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  const [value, setValue] = useState<string>(name || "");
  const debounceValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debounceValue,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debounceValue, router]);

  return (
    <div className="relative">
      <SearchIcon className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search All Items"
        className="w-auto bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0 pl-10"
      />
    </div>
  );
};
