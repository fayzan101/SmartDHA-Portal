"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext<any>(null);

export function SearchProvider({ children }: any) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);