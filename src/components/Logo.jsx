import React from "react";
export default function Logo({ compact = false }) {
  return <div className={compact ? "logo compact" : "logo"} aria-label="NEXA360 CRM Enterprise">
    <img className="brand-symbol" src={`${import.meta.env.BASE_URL}brand/nexa360-symbol.svg`} alt="" />
    <div><strong>NEXA<span>360</span></strong><small>CRM ENTERPRISE</small></div>
  </div>;
}
