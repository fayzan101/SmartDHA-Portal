"use client";

import { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchValue: "",
  setSearchValue: () => {},
});

export function SearchProvider({ children }: any) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);