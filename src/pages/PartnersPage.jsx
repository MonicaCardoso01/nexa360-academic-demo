import RelationshipScore from "../components/RelationshipScore.jsx";
import RelationshipTimeline from "../components/RelationshipTimeline.jsx";
import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { localizePartner } from "../i18n/partnerRecordTranslations.js";
import {
  PARTNER_PRIORITIES,
  PARTNER_STATUSES
} from "../data/partners.js";

const EMPTY_PARTNER = {
  name: "",
  country: "Portugal",
  city: "",
  sector: "",
  manager: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  status: "Novo",
  priority: "Média",
  lastContact: "",
  nextAction: "",
  relationship: "",
  potentialValue: 0,
  notes: ""
};

function currency(value, locale = "pt-PT") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function StatusBadge({ status, label = status }) {
  const className = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");

  return <span className={`partner-status ${className}`}>{label}</span>;
}

function PartnerModal({ partner, mode, onClose, onSave, onDelete, canEdit, t, locale, language }) {
  const [form, setForm] = useState(partner || EMPTY_PARTNER);
  const editing = mode === "edit" || mode === "new";
  const displayForm = editing ? form : localizePartner(form, language);
  const title = mode === "new"
    ? t("partners.newPartner").replace("+ ", "")
    : mode === "edit"
      ? t("partners.editPartner")
      : form.name;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert(t("leads.companyRequired"));
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      window.alert(t("leads.contactRequired"));
      return;
    }

    onSave({
      ...form,
      potentialValue: Number(form.potentialValue || 0)
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="partner-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <div>
            <p className="eyebrow">
              {mode === "view" ? t("partners.client360") : t("partners.relationshipManagement")}
            </p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </header>

        {editing ? (
          <form className="partner-form" onSubmit={submit}>
            <div className="form-section">
              <h3>{t("partners.companyData")}</h3>
              <div className="form-grid">
                <label>
                  <span>{t("partners.companyName")}</span>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} />
                </label>
                <label>
                  <span>{t("partners.sector")}</span>
                  <input value={form.sector} onChange={(e) => update("sector", e.target.value)} />
                </label>
                <label>
                  <span>{t("partners.country")}</span>
                  <input value={form.country} onChange={(e) => update("country", e.target.value)} />
                </label>
                <label>
                  <span>{t("leads.city")}</span>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)} />
                </label>
                <label>
                  <span>{t("partners.website")}</span>
                  <input value={form.website} onChange={(e) => update("website", e.target.value)} />
                </label>
                <label>
                  <span>{t("partners.potentialValue")} (€)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.potentialValue}
                    onChange={(e) => update("potentialValue", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>{t("partners.mainContact")}</h3>
              <div className="form-grid">
                <label>
                  <span>{t("partners.contactName")}</span>
                  <input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                </label>
                <label>
                  <span>{t("leads.salesOwner").replace(" *","")}</span>
                  <input value={form.manager} onChange={(e) => update("manager", e.target.value)} />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </label>
                <label>
                  <span>{t("leads.phone")}</span>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>{t("partners.classification")}</h3>
              <div className="form-grid">
                <label>
                  <span>{t("partners.status")}</span>
                  <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                    {PARTNER_STATUSES.map((status) => <option key={status} value={status}>{t(`partners.statuses.${status}`)}</option>)}
                  </select>
                </label>
                <label>
                  <span>{t("partners.priority")}</span>
                  <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                    {PARTNER_PRIORITIES.map((priority) => <option key={priority} value={priority}>{t(`partners.priorities.${priority}`)}</option>)}
                  </select>
                </label>
                <label>
                  <span>{t("leads.lastContact")}</span>
                  <input type="date" value={form.lastContact} onChange={(e) => update("lastContact", e.target.value)} />
                </label>
                <label>
                  <span>{t("leads.nextAction")}</span>
                  <input value={form.nextAction} onChange={(e) => update("nextAction", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>{t("partners.relationship")}</h3>
              <label>
                <span>{t("partners.preferences")}</span>
                <textarea
                  rows="3"
                  value={form.relationship}
                  onChange={(e) => update("relationship", e.target.value)}
                />
              </label>
              <label>
                <span>{t("leads.notes")}</span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </label>
            </div>

            <footer className="modal-actions">
              <button type="button" className="secondary-button" onClick={onClose}>{t("leads.cancel")}</button>
              <button type="submit" className="primary-action">{t("partners.save")}</button>
            </footer>
          </form>
        ) : (
          <div className="partner-detail">
            <section className="detail-hero">
              <div>
                <StatusBadge status={form.status} label={t(`partners.statuses.${form.status}`)} />
                <p>{form.city}, {displayForm.country} • {displayForm.sector}</p>
              </div>
              <strong>{currency(form.potentialValue,locale)}</strong>
            </section>

            <div className="detail-grid">
              <article>
                <span>{t("partners.mainContact")}</span>
                <strong>{form.contactName || t("partners.notProvided")}</strong>
                <p>{form.email || t("leads.noEmail")}<br />{form.phone || t("leads.noPhone")}</p>
              </article>
              <article>
                <span>{t("leads.salesOwner").replace(" *","")}</span>
                <strong>{form.manager || t("partners.unassigned")}</strong>
                <p>{t("partners.priorityLabel",{priority:t(`partners.priorities.${form.priority}`)})}</p>
              </article>
              <article>
                <span>{t("leads.lastContact")}</span>
                <strong>{form.lastContact || t("partners.notContacted")}</strong>
                <p>{displayForm.nextAction || t("partners.noNextAction")}</p>
              </article>
              <article>
                <span>{t("partners.website")}</span>
                <strong>{form.website || t("partners.notProvided")}</strong>
                <p>{t("partners.centralised")}</p>
              </article>
            </div>

            <section className="relationship-card">
              <p className="eyebrow">{t("partners.relationship")}</p>
              <h3>{t("partners.knowledge")}</h3>
              <p>{displayForm.relationship || t("partners.noPreferences")}</p>
            </section>

            <section className="partner-insight">
              <div className="insightMark">N</div>
              <div>
                <p className="eyebrow light">{t("leads.insight")}</p>
                <h3>
                  {form.status === "Perdido"
                    ? t("leads.insightLost")
                    : form.status === "Captado"
                      ? t("partners.insightCaptured")
                      : t("partners.insightActive")}
                </h3>
                <p>
                  {displayForm.nextAction
                    ? t("leads.recommendedAction",{action:displayForm.nextAction})
                    : t("partners.recommendation")}
                </p>
              </div>
            </section>

            {displayForm.notes && (
              <section className="notes-card">
                <p className="eyebrow">{t("leads.notes")}</p>
                <p>{displayForm.notes}</p>
              </section>
            )}

            <footer className="modal-actions">
              {canEdit && (
                <>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      if (window.confirm(t("leads.deleteConfirm",{name:form.name}))) {
                        onDelete(form.id);
                        onClose();
                      }
                    }}
                  >
                    {t("leads.delete")}
                  </button>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => onClose("edit", form)}
                  >
                    {t("partners.editPartner")}
                  </button>
                </>
              )}
              {!canEdit && (
                <button type="button" className="secondary-button" onClick={onClose}>{t("partners.close")}</button>
              )}
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}

export default function PartnersPage({
  user,
  partners,
  onSave,
  onDelete,
  initialPartnerName,
  onNavigate,
  onLogout
}) {
  const { t, locale, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [country, setCountry] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [relationshipPlanPartner, setRelationshipPlanPartner] =
    useState("NordWerk GmbH");
  const [modal, setModal] = useState(() => {
    const partner = partners.find((item) => item.name === initialPartnerName);
    return partner ? { mode: "view", partner } : null;
  });
  const canEdit = user.profileKey === "admin";

  function openRelationshipPlan(partnerName) {
    setRelationshipPlanPartner(partnerName);
    window.requestAnimationFrame(() => {
      document.getElementById("relationship-plan")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  const countries = useMemo(
    () => [...new Set(partners.map((partner) => partner.country))].sort(),
    [partners]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return partners.filter((partner) => {
      const searchablePartner = localizePartner(partner, language);
      const matchesSearch = !term || [
        partner.name,
        partner.contactName,
        partner.email,
        searchablePartner.sector,
        searchablePartner.country
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesSearch
        && (status === "Todos" || partner.status === status)
        && (country === "Todos" || partner.country === country)
        && (priority === "Todas" || partner.priority === priority);
    });
  }, [partners, search, status, country, priority, language]);

  const totals = {
    all: partners.length,
    active: partners.filter((item) => item.status === "Em acompanhamento").length,
    won: partners.filter((item) => item.status === "Captado").length,
    lost: partners.filter((item) => item.status === "Perdido").length
  };

  function openEditFromView(action, partner) {
    if (action === "edit") {
      setModal({ mode: "edit", partner });
    } else {
      setModal(null);
    }
  }

  return (
    <AppLayout
      user={user}
      activePage="partners"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title={t("partners.title")}
    >
      <div className="content partners-content">
        <section className="partners-hero">
          <div>
            
            <p className="eyebrow light">{t("partners.businessRelations")}</p>
            <h2>{t("partners.title")}</h2>
            <p>{t("partners.description")}</p>
          </div>
          {canEdit && (
            <button
              type="button"
              className="new-partner-button"
              onClick={() => setModal({ mode: "new", partner: EMPTY_PARTNER })}
            >
              {t("partners.newPartner")}
            </button>
          )}
        </section>
        <RelationshipScore
          partnerName="NordWerk GmbH"
          onViewPlan={openRelationshipPlan}
        />
        <RelationshipTimeline
          partners={partners}
          focusPartner={relationshipPlanPartner}
        />
        <section className="partner-metrics">
          <article><span>{t("partners.all")}</span><strong>{totals.all}</strong><small>{t("partners.registered")}</small></article>
          <article className="metric-blue"><span>{t("partners.active")}</span><strong>{totals.active}</strong><small>{t("partners.working")}</small></article>
          <article className="metric-green"><span>{t("partners.captured")}</span><strong>{totals.won}</strong><small>{t("partners.wonClients")}</small></article>
          <article className="metric-red"><span>{t("partners.lost")}</span><strong>{totals.lost}</strong><small>{t("partners.unrealised")}</small></article>
        </section>

        <section className="partner-toolbar">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("partners.search")}
            />
          </label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Todos">{t("partners.all")}</option>
            {PARTNER_STATUSES.map((item) => <option key={item} value={item}>{t(`partners.statuses.${item}`)}</option>)}
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="Todos">{t("partners.all")}</option>
            {countries.map((item) => <option key={item}>{item}</option>)}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Todas">{t("partners.allFemale")}</option>
            {PARTNER_PRIORITIES.map((item) => <option key={item} value={item}>{t(`partners.priorities.${item}`)}</option>)}
          </select>
        </section>

        <section className="partners-table-card">
          <header>
            <div>
              <p className="eyebrow">{t("partners.portfolio")}</p>
              <h2>{t(filtered.length===1?"partners.oneCount":"partners.manyCount",{count:filtered.length})}</h2>
            </div>
            <span className="table-note">
              {t("partners.colourNote")}
            </span>
          </header>

          <div className="partners-table-wrap">
            <table className="partners-table">
              <thead>
                <tr>
                  <th>{t("partners.company")}</th>
                  <th>{t("partners.contact")}</th>
                  <th>{t("partners.country")}</th>
                  <th>{t("partners.owner")}</th>
                  <th>{t("partners.potentialValue")}</th>
                  <th>{t("partners.status")}</th>
                  <th>{t("partners.priority")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((partner) => {
                  const displayPartner = localizePartner(partner, language);
                  return (
                  <tr key={partner.id} className={`partner-row ${partner.status.toLowerCase().replaceAll(" ", "-")}`}>
                    <td>
                      <button
                        type="button"
                        className="company-link"
                        onClick={() => setModal({ mode: "view", partner })}
                      >
                        <span className="company-avatar">{partner.name.charAt(0)}</span>
                        <span>
                          <strong>{partner.name}</strong>
                          <small>{displayPartner.sector}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <strong>{partner.contactName}</strong>
                      <small>{partner.email}</small>
                    </td>
                    <td><strong>{displayPartner.country}</strong><small>{partner.city}</small></td>
                    <td>{partner.manager}</td>
                    <td>{currency(partner.potentialValue,locale)}</td>
                    <td><StatusBadge status={partner.status} label={t(`partners.statuses.${partner.status}`)} /></td>
                    <td><span className={`priority-label ${partner.priority.toLowerCase()}`}>{t(`partners.priorities.${partner.priority}`)}</span></td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "view", partner })}
                        >
                          {t("partners.view")}
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => setModal({ mode: "edit", partner })}
                          >
                            {t("partners.edit")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <strong>{t("partners.noneFound")}</strong>
              <p>{t("partners.changeFilters")}</p>
            </div>
          )}
        </section>
      </div>

      {modal && (
        <PartnerModal
          partner={modal.partner}
          mode={modal.mode}
          canEdit={canEdit}
          onSave={onSave}
          onDelete={onDelete}
          onClose={openEditFromView}
          t={t}
          locale={locale}
          language={language}
        />
      )}
    </AppLayout>
  );
}
