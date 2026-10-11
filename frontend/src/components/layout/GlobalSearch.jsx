import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchCases } from "../../services/searchService";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const nextResults = await searchCases(term);
        if (active) setResults(nextResults);
      } catch (requestError) {
        if (active) setError(requestError.message || "Search is unavailable. Try again.");
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, retryKey]);

  useEffect(() => {
    const dismiss = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", dismiss);
    return () => document.removeEventListener("mousedown", dismiss);
  }, []);

  const clear = () => {
    setQuery("");
    setResults([]);
    setError("");
    setOpen(false);
  };

  return (
    <div className="app-shell-search" ref={rootRef}>
      <Search size={17} aria-hidden="true" />
      <input
        type="search"
        placeholder="Search cases…"
        aria-label="Search cases"
        aria-expanded={open}
        aria-controls="global-search-results"
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === "Escape") clear(); }}
      />
      {query && <button type="button" className="global-search-clear" onClick={clear} aria-label="Clear search"><X size={15} /></button>}
      {open && query.trim().length >= 2 && (
        <div className="global-search-results" id="global-search-results" role="listbox" aria-label="Case search results" aria-busy={loading}>
          {loading ? <p role="status">Searching cases…</p> : error ? <p role="alert">{error} <button type="button" onClick={() => setRetryKey((key) => key + 1)}>Retry</button></p> : results.length === 0 ? <p role="status">No matching cases.</p> : results.map((result) => (
            <Link key={`${result.type}-${result.id}`} role="option" to={result.href} onClick={clear}>
              <strong>{result.label}</strong>
              <span>{result.description}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
