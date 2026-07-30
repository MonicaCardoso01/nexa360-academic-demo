import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import {
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STATUSES
} from "../data/opportunities.js";

const today = () => new Date().toISOString().slice(0, 10);
const money = (value, locale = "pt-PT") => new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
}).format(Number(value) || 0);
const slug = (value) => value.toLowerCase().normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-");

const EMPTY = {
  title: "",
  company: "",
  contactName: "",
  email: "",
  service: "",
  value: 0,
  probability: 25,
  stage: "Qualificação",
  status: "Aberta",
  owner: "Mónica Cardoso",
  expectedClose: "",
  createdAt: today(),
  nextAction: "",
  notes: ""
};

function OpportunityModal({ item, mode, canEdit, onClose, onSave, onDelete, t, locale }) {
  const [form, setForm] = useState(item || EMPTY);
  const editing = mode !== "view";
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return alert(t("opportunities.titleRequired"));
    if (!form.company.trim()) return alert(t("opportunities.companyRequired"));
    if (Number(form.value) < 0) return alert(t("opportunities.invalidValue"));
    onSave({
      ...form,
      value: Number(form.value),
      probability: Number(form.probability)
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <section className="partner-modal opportunity-modal">
        <header className="modal-header">
          <div>
            <p className="eyebrow">{editing ? t("opportunities.commercialPipeline") : t("opportunities.opportunity360")}</p>
            <h2>{mode === "new" ? t("opportunities.newOpportunity").replace("+ ", "") : mode === "edit" ? t("opportunities.editOpportunity") : form.title}</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        {editing ? (
          <form className="partner-form" onSubmit={submit}>
            <div className="form-section">
              <h3>{t("opportunities.dealClient")}</h3>
              <div className="form-grid">
                <label><span>{t("opportunities.opportunity")} *</span><input value={form.title} onChange={(e) => set("title", e.target.value)} /></label>
                <label><span>{t("opportunities.company")} *</span><input value={form.company} onChange={(e) => set("company", e.target.value)} /></label>
                <label><span>{t("opportunities.contact")}</span><input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} /></label>
                <label><span>Email</span><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></label>
                <label><span>{t("opportunities.service")}</span><input value={form.service} onChange={(e) => set("service", e.target.value)} /></label>
                <label><span>{t("opportunities.owner")}</span><input value={form.owner} onChange={(e) => set("owner", e.target.value)} /></label>
              </div>
            </div>

            <div className="form-section">
              <h3>{t("opportunities.valueForecast")}</h3>
              <div className="form-grid">
                <label><span>{t("opportunities.estimatedValue")}</span><input type="number" min="0" value={form.value} onChange={(e) => set("value", e.target.value)} /></label>
                <label><span>{t("opportunities.probability")} (%)</span><input type="number" min="0" max="100" value={form.probability} onChange={(e) => set("probability", e.target.value)} /></label>
                <label><span>{t("opportunities.stage")}</span><select value={form.stage} onChange={(e) => set("stage", e.target.value)}>{OPPORTUNITY_STAGES.map((stage) => <option key={stage} value={stage}>{t(`opportunities.stages.${stage}`)}</option>)}</select></label>
                <label><span>{t("opportunities.status")}</span><select value={form.status} onChange={(e) => set("status", e.target.value)}>{OPPORTUNITY_STATUSES.map((status) => <option key={status} value={status}>{t(`opportunities.statuses.${status}`)}</option>)}</select></label>
                <label><span>{t("opportunities.creationDate")}</span><input type="date" value={form.createdAt} onChange={(e) => set("createdAt", e.target.value)} /></label>
                <label><span>{t("opportunities.expectedClose")}</span><input type="date" value={form.expectedClose} onChange={(e) => set("expectedClose", e.target.value)} /></label>
              </div>
            </div>

            <div className="form-section">
              <h3>{t("opportunities.followUp")}</h3>
              <label><span>{t("opportunities.nextAction")}</span><input value={form.nextAction} onChange={(e) => set("nextAction", e.target.value)} /></label>
              <label><span>{t("opportunities.notes")}</span><textarea rows="4" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></label>
            </div>

            <footer className="modal-actions">
              <button type="button" className="secondary-button" onClick={onClose}>{t("opportunities.cancel")}</button>
              <button className="primary-action">{t("opportunities.save")}</button>
            </footer>
          </form>
        ) : (
          <div className="partner-detail">
            <section className="detail-hero opportunity-detail-hero">
              <div>
                <span className={`opportunity-status ${slug(form.status)}`}>{t(`opportunities.statuses.${form.status}`)}</span>
                <p>{form.company} • {form.contactName || t("opportunities.contactMissing")}</p>
              </div>
              <strong>{money(form.value, locale)}</strong>
            </section>
            <div className="detail-grid">
              <article><span>{t("opportunities.stage")}</span><strong>{t(`opportunities.stages.${form.stage}`)}</strong><p>{t("opportunities.chance",{value:form.probability})}</p></article>
              <article><span>{t("opportunities.owner")}</span><strong>{form.owner}</strong><p>{form.service || t("opportunities.serviceMissing")}</p></article>
              <article><span>{t("opportunities.expectedClose")}</span><strong>{form.expectedClose || "—"}</strong><p>{t("opportunities.createdOn",{date:form.createdAt})}</p></article>
              <article><span>{t("opportunities.nextAction")}</span><strong>{form.nextAction || t("opportunities.notDefined")}</strong><p>{form.email || t("opportunities.noEmail")}</p></article>
            </div>
            <section className="relationship-card">
              <p className="eyebrow">{t("opportunities.commercialContext")}</p>
              <h3>{form.title}</h3>
              <p>{form.notes || t("opportunities.noNotes")}</p>
            </section>
            <footer className="modal-actions">
              {canEdit && (
                <>
                  <button className="danger-button" onClick={() => {
                    if (confirm(t("opportunities.deleteConfirm",{title:form.title}))) {
                      onDelete(form.id);
                      onClose();
                    }
                  }}>{t("opportunities.delete")}</button>
                  <button className="primary-action" onClick={() => onClose("edit", form)}>{t("opportunities.editLower")}</button>
                </>
              )}
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}

export default function OpportunitiesPage({
  user,
  opportunities,
  onSave,
  onDelete,
  onNavigate,
  onLogout
}) {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [owner, setOwner] = useState("Todos");
  const [sort, setSort] = useState("value-desc");
  const [modal, setModal] = useState(null);
  const canEdit = user.profileKey === "admin";
  const owners = useMemo(() => [...new Set(opportunities.map((item) => item.owner))].sort(), [opportunities]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const result = opportunities.filter((item) =>
      (!query || [item.title, item.company, item.contactName, item.service]
        .some((value) => String(value).toLowerCase().includes(query))) &&
      (stage === "Todas" || item.stage === stage) &&
      (status === "Todos" || item.status === status) &&
      (owner === "Todos" || item.owner === owner)
    );
    return [...result].sort((a, b) => {
      if (sort === "close-asc") return String(a.expectedClose).localeCompare(String(b.expectedClose));
      if (sort === "probability-desc") return Number(b.probability) - Number(a.probability);
      return Number(b.value) - Number(a.value);
    });
  }, [opportunities, search, stage, status, owner, sort]);

  const open = opportunities.filter((item) => item.status === "Aberta");
  const metrics = {
    total: opportunities.length,
    open: open.length,
    pipeline: open.reduce((sum, item) => sum + Number(item.value || 0), 0),
    weighted: open.reduce((sum, item) => sum + Number(item.value || 0) * Number(item.probability || 0) / 100, 0),
    won: opportunities.filter((item) => item.status === "Ganha").reduce((sum, item) => sum + Number(item.value || 0), 0)
  };

  function close(action, item) {
    if (action === "edit") setModal({ mode: "edit", item });
    else setModal(null);
  }

  return (
    <AppLayout user={user} activePage="opportunities" onNavigate={onNavigate} onLogout={onLogout} title={t("opportunities.title")}>
      <div className="content opportunities-content">
        <section className="partners-hero opportunities-hero">
          <div>
            <p className="eyebrow light">{t("opportunities.growthPipeline")}</p>
            <h2>{t("opportunities.management")}</h2>
            <p>{t("opportunities.description")}</p>
          </div>
          {canEdit && <button className="new-partner-button" onClick={() => setModal({ mode: "new", item: EMPTY })}>{t("opportunities.newOpportunity")}</button>}
        </section>

        <section className="opportunity-metrics">
          <article><span>{t("opportunities.total")}</span><strong>{metrics.total}</strong><small>{t("opportunities.opportunities")}</small></article>
          <article className="metric-blue"><span>{t("opportunities.open")}</span><strong>{metrics.open}</strong><small>{t("opportunities.activeDeals")}</small></article>
          <article className="metric-green"><span>{t("opportunities.pipeline")}</span><strong>{money(metrics.pipeline,locale)}</strong><small>{t("opportunities.potentialValue")}</small></article>
          <article className="metric-gold"><span>{t("opportunities.weightedPipeline")}</span><strong>{money(metrics.weighted,locale)}</strong><small>{t("opportunities.probabilityAdjusted")}</small></article>
          <article className="metric-dark"><span>{t("opportunities.won")}</span><strong>{money(metrics.won,locale)}</strong><small>{t("opportunities.conqueredValue")}</small></article>
        </section>

        <section className="opportunity-toolbar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("opportunities.search")} /></label>
          <select value={stage} onChange={(e) => setStage(e.target.value)}><option value="Todas">{t("opportunities.allFemale")}</option>{OPPORTUNITY_STAGES.map((item) => <option key={item} value={item}>{t(`opportunities.stages.${item}`)}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="Todos">{t("opportunities.allMale")}</option>{OPPORTUNITY_STATUSES.map((item) => <option key={item} value={item}>{t(`opportunities.statuses.${item}`)}</option>)}</select>
          <select value={owner} onChange={(e) => setOwner(e.target.value)}><option value="Todos">{t("opportunities.allMale")}</option>{owners.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="value-desc">{t("opportunities.highestValue")}</option>
            <option value="probability-desc">{t("opportunities.highestProbability")}</option>
            <option value="close-asc">{t("opportunities.closestClose")}</option>
          </select>
        </section>

        <section className="partners-table-card">
          <header>
            <div><p className="eyebrow">{t("opportunities.salesFunnel")}</p><h2>{t(filtered.length===1?"opportunities.oneCount":"opportunities.manyCount",{count:filtered.length})}</h2></div>
            <span className="table-note">{t("opportunities.weightedFormula")}</span>
          </header>
          <div className="partners-table-wrap">
            <table className="partners-table opportunities-table">
              <thead><tr><th>{t("opportunities.opportunity")}</th><th>{t("opportunities.company")}</th><th>{t("opportunities.value")}</th><th>{t("opportunities.stage")}</th><th>{t("opportunities.probability")}</th><th>{t("opportunities.status")}</th><th>{t("opportunities.owner")}</th><th>{t("opportunities.expectedClose")}</th><th>{t("opportunities.nextAction")}</th><th /></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className={`opportunity-row-${slug(item.status)}`}>
                    <td><button className="company-link" onClick={() => setModal({ mode: "view", item })}><span className="company-avatar">{item.title.charAt(0)}</span><span><strong>{item.title}</strong><small>#{item.id}</small></span></button></td>
                    <td><strong>{item.company}</strong><small>{item.contactName}</small></td>
                    <td><strong className="opportunity-value">{money(item.value,locale)}</strong><small>{money(Number(item.value) * Number(item.probability) / 100,locale)} {t("opportunities.weighted")}</small></td>
                    <td><span className={`stage-label ${slug(item.stage)}`}>{t(`opportunities.stages.${item.stage}`)}</span></td>
                    <td><div className="probability"><span style={{ width: `${item.probability}%` }} /></div><small>{item.probability}%</small></td>
                    <td><span className={`opportunity-status ${slug(item.status)}`}>{t(`opportunities.statuses.${item.status}`)}</span></td>
                    <td>{item.owner}</td>
                    <td><strong>{item.expectedClose || "—"}</strong><small>{t("opportunities.created",{date:item.createdAt})}</small></td>
                    <td>{item.nextAction || t("opportunities.notDefined")}</td>
                    <td><div className="row-actions"><button onClick={() => setModal({ mode: "view", item })}>{t("opportunities.view")}</button>{canEdit && <button onClick={() => setModal({ mode: "edit", item })}>{t("opportunities.edit")}</button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <div className="empty-state"><strong>{t("opportunities.noneFound")}</strong><p>{t("opportunities.changeFilters")}</p></div>}
        </section>
      </div>
      {modal && <OpportunityModal {...modal} canEdit={canEdit} onSave={onSave} onDelete={onDelete} onClose={close} t={t} locale={locale} />}
    </AppLayout>
  );
}
