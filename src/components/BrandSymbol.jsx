import React from "react";
export default function BrandSymbol({ className = "", decorative = true }) {
  return <img className={`brand-mini-symbol ${className}`.trim()} src={`${import.meta.env.BASE_URL}brand/nexa360-symbol.svg`} alt={decorative ? "" : "Símbolo NEXA360"} aria-hidden={decorative ? "true" : undefined} />;
}
