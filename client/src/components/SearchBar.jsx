import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { useProduct } from "../context/productContext";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef();
  const inputRef = useRef();
  const { fuzzySearch } = useProduct();

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShow(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const sortData = (result = [], term = "") => {
    console.log(result);
    const sorted = result.sort((a, b) => {
      const posA = a.title.toLowerCase().indexOf(term.toLowerCase());
      const posB = b.title.toLowerCase().indexOf(term.toLowerCase());

      if (posA === -1) return 1;
      if (posB === -1) return -1;
      return posA - posB;
    });

    setSuggestions(sorted);
  };

  const fetchSuggestions = debounce(async (term) => {
    if (!term || term.length < 1) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/product/search/suggest?q=${term}`
      );
      sortData(res?.data || [], term);
      setShow(true);
      setActiveIndex(-1);
    } catch (err) {
      console.error(err);
    }
  }, 500);

  const handleKeyDown = (e) => {
    if (!show || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selectedItem = suggestions[activeIndex];
        fuzzySearch(selectedItem.title);
        setShow(false);
        setActiveIndex(-1);
        setQ(selectedItem.title);
      } else {
        fuzzySearch(q);
        setShow(false);
      }
      setSuggestions([]);
    }
  };

  const handleOnChange = (e) => {
    setQ(e.target.value);
    if (e.target.value.trim(" ") === "") {
      setShow(false);
      return;
    }
    fetchSuggestions(q);
  };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<span style="color:black; font-weight:600">$1</span>`);
  };

  return (
    <div ref={ref} className="relative">
      <input
        ref={inputRef}
        value={q}
        onChange={handleOnChange}
        onFocus={() => q && setShow(true)}
        onKeyDown={handleKeyDown}
        className="w-full sm:w-96 border border-gray-300 rounded-lg p-3 text-gray-700
                 focus:outline-none focus:ring-2 focus:ring-blue-700 shadow-sm"
        placeholder="Search products..."
      />

      {show && suggestions.length > 0 && (
        <ul
          className={`absolute left-0 right-0 bg-white mt-1 z-50 max-h-60 overflow-auto rounded-lg shadow-sm`}
          style={{ width: inputRef.current.offsetWidth }}
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              className={`p-2 cursor-pointer ${
                activeIndex === i ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                fuzzySearch(s.title);
                setShow(false);
              }}
            >
              <span className="text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: highlightText(s.title, q),
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
