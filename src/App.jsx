import React, { lazy, Suspense, useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import { INITIAL_LEADS } from "./data/leads.js";
import { INITIAL_PARTNERS } from "./data/partners.js";
import { INITIAL_OPPORTUNITIES } from "./data/opportunities.js";
import { INITIAL_TASKS } from "./data/tasks.js";

const CommandCenterPage = lazy(() => import("./pages/CommandCenterPage.jsx"));
const PartnersPage = lazy(() => import("./pages/PartnersPage.jsx"));
const LeadsPage = lazy(() => import("./pages/LeadsPage.jsx"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage.jsx"));
const ContactsPage = lazy(() => import("./pages/ContactsPage.jsx"));
const TasksPage = lazy(() => import("./pages/TasksPage.jsx"));
const ReportsPage = lazy(() => import("./pages/ReportsPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));

const STORAGE_KEY = "nexa360_partners_v1";
const LEADS_KEY = "nexa360_leads_v1";
const OPPORTUNITIES_KEY = "nexa360_opportunities_v1";
const CONTACTS_KEY = "nexa360_contacts_v1";
const TASKS_KEY = "nexa360_tasks_v1";
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

function normalizeRecords(key, records) {
  const original = JSON.stringify(records);
  const normalized = original.replaceAll("Mónica Cardoso", "Mônica Cardoso");
  const next = JSON.parse(normalized);
  if (normalized !== original) localStorage.setItem(key, normalized);
  return next;
}

function loadLeads(){
  try { const saved=localStorage.getItem(LEADS_KEY); const parsed=saved?JSON.parse(saved):null; return normalizeRecords(LEADS_KEY, Array.isArray(parsed)?parsed:INITIAL_LEADS); } catch { return INITIAL_LEADS; }
}

function loadPartners() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return normalizeRecords(STORAGE_KEY, Array.isArray(parsed) ? parsed : INITIAL_PARTNERS);
  } catch {
    return INITIAL_PARTNERS;
  }
}

function loadOpportunities() {
  try {
    const saved = localStorage.getItem(OPPORTUNITIES_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return normalizeRecords(OPPORTUNITIES_KEY, Array.isArray(parsed) ? parsed : INITIAL_OPPORTUNITIES);
  } catch {
    return INITIAL_OPPORTUNITIES;
  }
}

function loadContacts() {
  try {
    const saved = localStorage.getItem(CONTACTS_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return normalizeRecords(CONTACTS_KEY, Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return normalizeRecords(TASKS_KEY, Array.isArray(parsed) ? parsed : INITIAL_TASKS);
  } catch {
    return INITIAL_TASKS;
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

function PageLoading() {
  return (
    <main className="page-loading" role="status" aria-live="polite">
      <span className="page-loading-spinner" aria-hidden="true" />
      <strong>NEXA360</strong>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("command");
  const [selectedPartnerName, setSelectedPartnerName] = useState(null);
  const [partners, setPartners] = useState(loadPartners);
  const [leads, setLeads] = useState(loadLeads);
  const [opportunities, setOpportunities] = useState(loadOpportunities);
  const [contacts, setContacts] = useState(loadContacts);
  const [tasks, setTasks] = useState(loadTasks);
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

  function saveContact(contact) {
    if (contact.originType === "lead") {
      const lead = leads.find((item) => item.id === contact.originId);
      if (lead) saveLead({ ...lead, name: contact.name, company: contact.company, role: contact.role, email: contact.email, phone: contact.phone, country: contact.country, city: contact.city, owner: contact.owner, notes: contact.notes });
      return;
    }
    if (contact.originType === "partner") {
      const partner = partners.find((item) => item.id === contact.originId);
      if (partner) savePartner({ ...partner, contactName: contact.name, name: contact.company, sector: contact.role, email: contact.email, phone: contact.phone, country: contact.country, city: contact.city, manager: contact.owner, notes: contact.notes });
      return;
    }
    setContacts((current) => {
      const exists = current.some((item) => item.id === contact.id);
      const next = exists
        ? current.map((item) => item.id === contact.id ? { ...contact, originType: "contact" } : item)
        : [{ ...contact, id: Date.now(), originType: "contact" }, ...current];
      persistRecords(CONTACTS_KEY, next);
      return next;
    });
  }

  function deleteContact(id) {
    setContacts((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRecords(CONTACTS_KEY, next);
      return next;
    });
  }

  function saveTask(task) {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      const next = exists
        ? current.map((item) => item.id === task.id ? task : item)
        : [{ ...task, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }, ...current];
      persistRecords(TASKS_KEY, next);
      return next;
    });
  }

  function deleteTask(id) {
    setTasks((current) => {
      const next = current.filter((item) => item.id !== id);
      persistRecords(TASKS_KEY, next);
      return next;
    });
  }


  if (!user) {
    return <LoginPage sessionExpired={sessionExpired} onLogin={(nextUser) => { setSessionExpired(false); setUser(nextUser); }} />;
  }

  let page;

  if (activePage === "leads") {
    page = <LeadsPage user={user} leads={leads} onSave={saveLead} onDelete={deleteLead} onConvert={convertLead} onNavigate={navigate} onLogout={logout} />;
  } else if (activePage === "partners") {
    page = (
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
  } else if (activePage === "opportunities") {
    page = (
      <OpportunitiesPage
        user={user}
        opportunities={opportunities}
        onSave={saveOpportunity}
        onDelete={deleteOpportunity}
        onNavigate={navigate}
        onLogout={logout}
      />
    );
  } else if (activePage === "contacts") {
    page = <ContactsPage user={user} leads={leads} partners={partners} contacts={contacts} onSave={saveContact} onDelete={deleteContact} onNavigate={navigate} onLogout={logout} />;
  } else if (activePage === "tasks") {
    page = <TasksPage user={user} tasks={tasks} leads={leads} partners={partners} opportunities={opportunities} onSave={saveTask} onDelete={deleteTask} onNavigate={navigate} onLogout={logout} />;
  } else if (activePage === "reports") {
    page = <ReportsPage user={user} leads={leads} partners={partners} opportunities={opportunities} tasks={tasks} onNavigate={navigate} onLogout={logout} />;
  } else if (activePage === "settings") {
    page = <SettingsPage user={user} onUpdateUser={setUser} leads={leads} partners={partners} opportunities={opportunities} contacts={contacts} tasks={tasks} onNavigate={navigate} onLogout={logout} />;
  } else {
    page = (
      <CommandCenterPage
        user={user}
        leads={leads}
        opportunities={opportunities}
        onLogout={logout}
        onNavigate={navigate}
      />
    );
  }

  return <Suspense fallback={<PageLoading />}>{page}</Suspense>;
}
