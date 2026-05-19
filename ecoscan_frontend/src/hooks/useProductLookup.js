import { useState } from "react";
import { lookupByBarcode, searchProductsByName } from "../api/productApi";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  weight: "",
  material: "",
  transportDistance: "",
  description: "",
};

/**
 * Manages the barcode / name-search lookup flow.
 *
 * Returns:
 *  - mode: "barcode" | "name"
 *  - setMode
 *  - query: current input string
 *  - setQuery
 *  - loading
 *  - error
 *  - results: array of ScannedProductDTO (name search)
 *  - selected: single ScannedProductDTO (barcode hit or chosen from list)
 *  - editForm: editable product fields pre-filled from selected
 *  - handleEditChange: onChange handler for editForm fields
 *  - runLookup(): fires the API call
 *  - selectResult(dto): pick one result from the name-search list
 *  - reset(): clear everything
 */
export function useProductLookup() {
  const [mode, setMode] = useState("barcode"); // "barcode" | "name"
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]); // name-search list
  const [selected, setSelected] = useState(null); // chosen ScannedProductDTO
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const runLookup = async () => {
    const q = query.trim();
    if (!q) {
      setError("Please enter a barcode or product name.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setSelected(null);
    setEditForm(EMPTY_FORM);

    try {
      if (mode === "barcode") {
        const dto = await lookupByBarcode(q);
        if (!dto) {
          setError("No product found for that barcode. Try searching by name.");
        } else {
          selectResult(dto);
        }
      } else {
        const list = await searchProductsByName(q);
        if (!list || list.length === 0) {
          setError("No products found. Try a different name.");
        } else {
          setResults(list);
        }
      }
    } catch (err) {
      setError(err.message || "Lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectResult = (dto) => {
    setSelected(dto);
    setResults([]);
    setEditForm(dtoToForm(dto));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setQuery("");
    setError("");
    setResults([]);
    setSelected(null);
    setEditForm(EMPTY_FORM);
  };

  return {
    mode,
    setMode,
    query,
    setQuery,
    loading,
    error,
    results,
    selected,
    editForm,
    handleEditChange,
    runLookup,
    selectResult,
    reset,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dtoToForm(dto) {
  return {
    name: dto.name ?? "",
    category: capitalizeFirst(dto.category ?? ""),
    price: "",
    weight: dto.weight != null ? String(dto.weight) : "",
    material: dto.material ?? "",
    transportDistance:
      dto.estimatedTransportDistance != null
        ? String(dto.estimatedTransportDistance)
        : "",
    description: dto.packagingRaw
      ? `Packaging: ${dto.packagingRaw}`
      : "",
  };
}

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
