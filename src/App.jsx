import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import CommandCenterPage from "./pages/CommandCenterPage.jsx";
import PartnersPage from "./pages/PartnersPage.jsx";
import LeadsPage from "./pages/LeadsPage.jsx";
import OpportunitiesPage from "./pages/OpportunitiesPage.jsx";
import { INITIAL_LEADS } from "./data/leads.js";
import { INITIAL_PARTNERS } from "./data/partners.js";
import { INITIAL_OPPORTUNITIES } from "./data/opportunities.js";

const STORAGE_KEY = "nexa360_partners_v1";
const LEADS_KEY = "nexa360_leads_v1";
const OPPORTUNITIES_KEY = "nexa360_opportunities_v1";

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

function loadOpportunities() {
  try {
    const saved = localStorage.getItem(OPPORTUNITIES_KEY);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  } catch {
    return INITIAL_OPPORTUNITIES;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("command");
  const [selectedPartnerName, setSelectedPartnerName] = useState(null);
  const [partners, setPartners] = useState(loadPartners);
  const [leads, setLeads] = useState(loadLeads);
  const [opportunities, setOpportunities] = useState(loadOpportunities);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(partners)); }, [partners]);
  useEffect(() => { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities)); }, [opportunities]);

  function logout() {
    setUser(null);
    setActivePage("command");
  }

  function navigate(page, context = {}) {
    setSelectedPartnerName(context.partnerName || null);
    setActivePage(page);
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
  function convertLead(id) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    const alreadyExists = opportunities.some((item) => item.leadId === id);
    if (!alreadyExists) {
      setOpportunities((current) => [{
        id: Date.now(),
        leadId: lead.id,
        title: `${lead.interest || "Nova oportunidade"} — ${lead.company}`,
        company: lead.company,
        contactName: lead.name,
        email: lead.email,
        service: lead.interest,
        value: 0,
        probability: 25,
        stage: "Qualificação",
        status: "Aberta",
        owner: lead.owner,
        expectedClose: "",
        createdAt: new Date().toISOString().slice(0, 10),
        nextAction: "Qualificar oportunidade e estimar valor",
        notes: `Oportunidade criada automaticamente a partir do lead #${lead.id}. ${lead.notes || ""}`.trim()
      }, ...current]);
    }
    setLeads((current) => current.map((item) =>
      item.id === id
        ? { ...item, status: "Convertido", nextAction: "Acompanhar oportunidade comercial" }
        : item
    ));
    setActivePage("opportunities");
  }

  function saveOpportunity(opportunity) {
    setOpportunities((current) => {
      const exists = current.some((item) => item.id === opportunity.id);
      return exists
        ? current.map((item) => item.id === opportunity.id ? opportunity : item)
        : [{ ...opportunity, id: Date.now() }, ...current];
    });
  }

  function deleteOpportunity(id) {
    setOpportunities((current) => current.filter((item) => item.id !== id));
  }


  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (activePage === "leads") {
    return <LeadsPage user={user} leads={leads} onSave={saveLead} onDelete={deleteLead} onConvert={convertLead} onNavigate={navigate} onLogout={logout} />;
  }

  if (activePage === "partners") {
    return (
      <PartnersPage
        user={user}
        partners={partners}
        onSave={savePartner}
        onDelete={deletePartner}
        initialPartnerName={selectedPartnerName}
        onNavigate={navigate}
        onLogout={logout}
      />
    );
  }

  if (activePage === "opportunities") {
    return (
      <OpportunitiesPage
        user={user}
        opportunities={opportunities}
        onSave={saveOpportunity}
        onDelete={deleteOpportunity}
        onNavigate={navigate}
        onLogout={logout}
      />
    );
  }

  return (
    <CommandCenterPage
      user={user}
      leads={leads}
      opportunities={opportunities}
      onLogout={logout}
      onNavigate={navigate}
    />
  );
}
