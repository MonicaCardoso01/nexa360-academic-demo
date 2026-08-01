import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import CommunicationActions from "../components/CommunicationActions.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const EMPTY = { id: null, originType: "contact", name: "", company: "", role: "", email: "", phone: "", country: "Portugal", city: "", owner: "Mónica Cardoso", notes: "" };

function contactKey(contact) {
  const email = String(contact.email || "").trim().toLowerCase();
  const phone = String(contact.phone || "").replace(/\D/g, "");
  return email || phone || `${contact.originType}:${contact.originId || contact.id}`;
}

function combinedContacts(leads, partners, standalone) {
  const map = new Map();
  partners.forEach((item) => {
    const contact = { id: `partner-${item.id}`, originId: item.id, originType: "partner", name: item.contactName, company: item.name, role: item.sector, email: item.email, phone: item.phone, country: item.country, city: item.city, owner: item.manager, notes: item.notes };
    map.set(contactKey(contact), contact);
  });
  leads.forEach((item) => {
    const contact = { id: `lead-${item.id}`, originId: item.id, originType: "lead", name: item.name, company: item.company, role: item.role, email: item.email, phone: item.phone, country: item.country, city: item.city, owner: item.owner, notes: item.notes };
    if (!map.has(contactKey(contact))) map.set(contactKey(contact), contact);
  });
  standalone.forEach((item) => {
    const contact = { ...item, originId: item.id, originType: "contact" };
    if (!map.has(contactKey(contact))) map.set(contactKey(contact), contact);
  });
  return [...map.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

function ContactModal({ contact, mode, onClose, onSave, onDelete, canEdit, t }) {
  const [form, setForm] = useState(contact || EMPTY);
  const editing = mode === "new" || mode === "edit";
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const sourceLabel = t(`contacts.source${form.originType === "partner" ? "Partner" : form.originType === "lead" ? "Lead" : "Contact"}`);

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return window.alert(t("contacts.nameRequired"));
    if (!form.email.trim() && !form.phone.trim()) return window.alert(t("contacts.channelRequired"));
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return window.alert(t("contacts.invalidEmail"));
    onSave(form);
    onClose();
  }

  return <div className="modal-backdrop"><section className="partner-modal contact-modal">
    <header className="modal-header"><div><p className="eyebrow">{editing ? t("contacts.contactManagement") : t("contacts.contact360")}</p><h2>{mode === "new" ? t("contacts.new").replace("+ ", "") : mode === "edit" ? t("contacts.editContact") : form.name}</h2></div><button type="button" className="close-button" onClick={onClose}>×</button></header>
    {editing ? <form className="partner-form" onSubmit={submit}>
      <div className="form-section"><h3>{t("contacts.details")}</h3><div className="form-grid">
        <label><span>{t("contacts.name")}</span><input maxLength="100" value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label><span>{t("contacts.company")}</span><input maxLength="120" value={form.company} onChange={(e) => set("company", e.target.value)} /></label>
        <label><span>{t("contacts.role")}</span><input maxLength="100" value={form.role} onChange={(e) => set("role", e.target.value)} /></label>
        <label><span>{t("contacts.owner")}</span><input maxLength="100" value={form.owner} onChange={(e) => set("owner", e.target.value)} /></label>
        <label><span>{t("contacts.email")}</span><input type="email" maxLength="160" value={form.email} onChange={(e) => set("email", e.target.value)} /></label>
        <label><span>{t("contacts.phone")}</span><input maxLength="30" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></label>
        <label><span>{t("contacts.country")}</span><input maxLength="80" value={form.country} onChange={(e) => set("country", e.target.value)} /></label>
        <label><span>{t("contacts.city")}</span><input maxLength="80" value={form.city} onChange={(e) => set("city", e.target.value)} /></label>
      </div><label><span>{t("contacts.notes")}</span><textarea rows="4" maxLength="1000" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></label>
      {form.originType !== "contact" && <p className="contact-link-note">{t("contacts.linkedRecord", { source: sourceLabel })}</p>}</div>
      <footer className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>{t("contacts.cancel")}</button><button className="primary-action">{t("contacts.save")}</button></footer>
    </form> : <div className="partner-detail">
      <section className="detail-hero"><div><span className="contact-source-badge">{sourceLabel}</span><p>{form.company || t("contacts.independent")}</p></div><strong>{form.role || t("contacts.notProvided")}</strong></section>
      <div className="detail-grid"><article><span>{t("contacts.email")}</span><strong>{form.email || t("contacts.noEmail")}</strong></article><article><span>{t("contacts.phone")}</span><strong>{form.phone || t("contacts.noPhone")}</strong></article><article><span>{t("contacts.location")}</span><strong>{[form.city, form.country].filter(Boolean).join(", ") || t("contacts.notProvided")}</strong></article><article><span>{t("contacts.owner")}</span><strong>{form.owner || t("contacts.notProvided")}</strong></article></div>
      <CommunicationActions entityType={form.originType} entityId={form.originId || form.id} name={form.name} company={form.company} email={form.email} phone={form.phone} />
      {form.notes && <section className="notes-card"><p className="eyebrow">{t("contacts.notes")}</p><p>{form.notes}</p></section>}
      <footer className="modal-actions">{canEdit && form.originType === "contact" && <button className="danger-button" onClick={() => { if (confirm(t("contacts.deleteConfirm", { name: form.name }))) { onDelete(form.id); onClose(); } }}>{t("contacts.delete")}</button>}{canEdit && <button className="primary-action" onClick={() => onClose("edit", form)}>{t("contacts.edit")}</button>}<button className="secondary-button" onClick={onClose}>{t("contacts.close")}</button></footer>
    </div>}
  </section></div>;
}

export default function ContactsPage({ user, leads, partners, contacts, onSave, onDelete, onNavigate, onLogout }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [modal, setModal] = useState(null);
  const canEdit = user.profileKey === "admin";
  const allContacts = useMemo(() => combinedContacts(leads, partners, contacts), [leads, partners, contacts]);
  const filtered = useMemo(() => allContacts.filter((item) => {
    const query = search.trim().toLowerCase();
    const matches = !query || [item.name, item.company, item.email, item.phone].some((value) => String(value || "").toLowerCase().includes(query));
    return matches && (source === "all" || item.originType === source);
  }), [allContacts, search, source]);
  const companies = new Set(allContacts.map((item) => item.company).filter(Boolean)).size;
  const close = (action, item) => action === "edit" ? setModal({ mode: "edit", contact: item }) : setModal(null);
  const sourceLabel = (type) => t(`contacts.source${type === "partner" ? "Partner" : type === "lead" ? "Lead" : "Contact"}`);

  return <AppLayout user={user} activePage="contacts" onNavigate={onNavigate} onLogout={onLogout} title={t("contacts.title")}><div className="content contacts-content">
    <section className="partners-hero"><div><p className="eyebrow light">{t("contacts.eyebrow")}</p><h2>{t("contacts.heading")}</h2><p>{t("contacts.description")}</p></div>{canEdit && <button className="new-partner-button" onClick={() => setModal({ mode: "new", contact: EMPTY })}>{t("contacts.new")}</button>}</section>
    <section className="partner-metrics"><article><span>{t("contacts.total")}</span><strong>{allContacts.length}</strong><small>{t("contacts.registered")}</small></article><article className="metric-blue"><span>{t("contacts.withEmail")}</span><strong>{allContacts.filter((item) => item.email).length}</strong></article><article className="metric-green"><span>{t("contacts.withPhone")}</span><strong>{allContacts.filter((item) => item.phone).length}</strong></article><article><span>{t("contacts.companies")}</span><strong>{companies}</strong></article></section>
    <section className="contact-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("contacts.search")} /></label><select value={source} onChange={(e) => setSource(e.target.value)}><option value="all">{t("contacts.all")}</option><option value="lead">{t("contacts.sourceLead")}</option><option value="partner">{t("contacts.sourcePartner")}</option><option value="contact">{t("contacts.sourceContact")}</option></select></section>
    <section className="partners-table-card"><header><div><p className="eyebrow">{t("contacts.directory")}</p><h2>{t(filtered.length === 1 ? "contacts.oneCount" : "contacts.manyCount", { count: filtered.length })}</h2></div></header><div className="partners-table-wrap"><table className="partners-table contacts-table"><thead><tr><th>{t("contacts.contact")}</th><th>{t("contacts.company")}</th><th>{t("contacts.channels")}</th><th>{t("contacts.location")}</th><th>{t("contacts.owner")}</th><th>{t("contacts.source")}</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><button className="company-link" onClick={() => setModal({ mode: "view", contact: item })}><span className="company-avatar">{String(item.name || "?").charAt(0)}</span><span><strong>{item.name || t("contacts.notProvided")}</strong><small>{item.role}</small></span></button></td><td><strong>{item.company || t("contacts.independent")}</strong></td><td><strong>{item.email || t("contacts.noEmail")}</strong><small>{item.phone || t("contacts.noPhone")}</small></td><td><strong>{item.country}</strong><small>{item.city}</small></td><td>{item.owner}</td><td><span className={`contact-source-badge ${item.originType}`}>{sourceLabel(item.originType)}</span></td><td><div className="row-actions"><button onClick={() => setModal({ mode: "view", contact: item })}>{t("contacts.view")}</button>{canEdit && <button onClick={() => setModal({ mode: "edit", contact: item })}>{t("contacts.edit")}</button>}</div></td></tr>)}</tbody></table></div>{!filtered.length && <div className="empty-state"><strong>{t("contacts.none")}</strong><p>{t("contacts.changeFilters")}</p></div>}</section>
  </div>{modal && <ContactModal contact={modal.contact} mode={modal.mode} onClose={close} onSave={onSave} onDelete={onDelete} canEdit={canEdit} t={t} />}</AppLayout>;
}
