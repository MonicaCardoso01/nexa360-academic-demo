import React, { useState } from "react";

const AVATARS = {
  "Mônica Cardoso": "monica-cardoso.webp",
  "João Martins": "joao-martins.webp",
  "Ana Silva": "ana-silva.webp"
};

export default function UserAvatar({ name, initials, mini = false, className = "" }) {
  const [failed, setFailed] = useState(false);
  const file = AVATARS[name];
  const fallback = initials || String(name || "?").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return <div className={`avatar photo-avatar ${mini ? "mini" : ""} ${className}`.trim()} title={name}>
    {file && !failed
      ? <img src={`${import.meta.env.BASE_URL}avatars/${file}`} alt={`Avatar profissional de ${name}`} onError={() => setFailed(true)} />
      : <span aria-hidden="true">{fallback}</span>}
  </div>;
}
