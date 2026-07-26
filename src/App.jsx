import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import CommandCenterPage from "./pages/CommandCenterPage.jsx";
import PartnersPage from "./pages/PartnersPage.jsx";
import LeadsPage from "./pages/LeadsPage.jsx";
import { INITIAL_LEADS } from "./data/leads.js";
import { INITIAL_PARTNERS } from "./data/partners.js";

const STORAGE_KEY = "nexa360_partners_v1";
const LEADS_KEY = "nexa360_leads_v1";

function loadLeads(){
  try { const saved=localStorage.getItem(LEADS_KEY); return saved?JSON.parse(saved):INITIAL_LEADS; } catch { return INITIAL_LEADS; }
}

function loadPartners() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  } catch {
    return INITIAL_PARTNERS;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("command");
  const [partners, setPartners] = useState(loadPartners);
  const [leads, setLeads] = useState(loadLeads);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); }, [leads]);

  function logout() {
    setUser(null);
    setActivePage("command");
  }

  function savePartner(partner) {
    setPartners((current) => {
      const exists = current.some((item) => item.id === partner.id);
      if (exists) {
        return current.map((item) => item.id === partner.id ? partner : item);
      }
      return [{ ...partner, id: Date.now() }, ...current];
    });
  }

  function deletePartner(id) {
    setPartners((current) => current.filter((item) => item.id !== id));
  }
  function saveLead(lead){
    setLeads(current=>current.some(x=>x.id===lead.id)?current.map(x=>x.id===lead.id?lead:x):[{...lead,id:Date.now()},...current]);
  }
  function deleteLead(id){ setLeads(current=>current.filter(x=>x.id!==id)); }
  function convertLead(id){ setLeads(current=>current.map(x=>x.id===id?{...x,status:"Convertido",nextAction:"Criar oportunidade comercial"}:x)); }


  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (activePage === "leads") {
    return <LeadsPage user={user} leads={leads} onSave={saveLead} onDelete={deleteLead} onConvert={convertLead} onNavigate={setActivePage} onLogout={logout} />;
  }

  if (activePage === "partners") {
    return (
      <PartnersPage
        user={user}
        partners={partners}
        onSave={savePartner}
        onDelete={deletePartner}
        onNavigate={setActivePage}
        onLogout={logout}
      />
    );
  }

  return (
    <CommandCenterPage
      user={user}
      onLogout={logout}
      onNavigate={setActivePage}
    />
  );
}
