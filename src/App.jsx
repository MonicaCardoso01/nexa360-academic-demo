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
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

function loadLeads(){
  try { const saved=localStorage.getItem(LEADS_KEY); const parsed=saved?JSON.parse(saved):null; return Array.isArray(parsed)?parsed:INITIAL_LEADS; } catch { return INITIAL_LEADS; }
}

function loadPartners() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : INITIAL_PARTNERS;
  } catch {
    return INITIAL_PARTNERS;
  }
}

function loadOpportunities() {
  try {
    const saved = localStorage.getItem(OPPORTUNITIES_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : INITIAL_OPPORTUNITIES;
  } catch {
    return INITIAL_OPPORTUNITIES;
  }
}

function persistRecords(key, records) {
  try {
    localStorage.setItem(key, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error(`NEXA360 storage failure for ${key}`, error);
    return false;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("command");
  const [selectedPartnerName, setSelectedPartnerName] = useState(null);
  const [partners, setPartners] = useState(loadPartners);
  const [leads, setLeads] = useState(loadLeads);
  const [opportunities, setOpportunities] = useState(loadOpportunities);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!user) return undefined;
    let timeoutId;
    const expireSession = () => {
      setUser(null);
      setActivePage("command");
      setSessionExpired(true);
    };
    const resetTimeout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(expireSession, SESSION_TIMEOUT_MS);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimeout, { passive: true }));
    resetTimeout();
    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
    };
  }, [user]);

  function logout() {
    setUser(null);
    setActivePage("command");
    setSessionExpired(false);
  }

  function navigate(page, context = {}) {
    setSelectedPartnerName(context.partnerName || null);
    setActivePage(page);
  }

  function savePartner(partner) {
    setPartners((current) => {
      const exists = current.some((item) => item.id === partner.id);
      const next = exists
        ? current.map((item) => item.id === partner.id ? partner : item)
        : [{ ...partner, id: Date.now() }, ...current];
      persistRecords(STORAGE_KEY, next);
      return next;
    });
  }

  function deletePartner(id) {
    setPartners((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRecords(STORAGE_KEY, next);
      return next;
    });
  }
  function saveLead(lead){
    setLeads((current) => {
      const next = current.some((item) => item.id === lead.id)
        ? current.map((item) => item.id === lead.id ? lead : item)
        : [{ ...lead, id: Date.now() }, ...current];
      persistRecords(LEADS_KEY, next);
      return next;
    });
  }
  function deleteLead(id){
    setLeads((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRecords(LEADS_KEY, next);
      return next;
    });
  }
  function convertLead(id) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    const alreadyExists = opportunities.some((item) => item.leadId === id);
    if (!alreadyExists) {
      setOpportunities((current) => {
        const next = [{
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
        }, ...current];
        persistRecords(OPPORTUNITIES_KEY, next);
        return next;
      });
    }
    setLeads((current) => {
      const next = current.map((item) => item.id === id
        ? { ...item, status: "Convertido", nextAction: "Acompanhar oportunidade comercial" }
        : item
      );
      persistRecords(LEADS_KEY, next);
      return next;
    });
    setActivePage("opportunities");
  }

  function saveOpportunity(opportunity) {
    setOpportunities((current) => {
      const exists = current.some((item) => item.id === opportunity.id);
      const next = exists
        ? current.map((item) => item.id === opportunity.id ? opportunity : item)
        : [{ ...opportunity, id: Date.now() }, ...current];
      persistRecords(OPPORTUNITIES_KEY, next);
      return next;
    });
  }

  function deleteOpportunity(id) {
    setOpportunities((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRecords(OPPORTUNITIES_KEY, next);
      return next;
    });
  }


  if (!user) {
    return <LoginPage sessionExpired={sessionExpired} onLogin={(nextUser) => { setSessionExpired(false); setUser(nextUser); }} />;
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
