import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import {
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STATUSES
} from "../data/opportunities.js";

const today = () => new Date().toISOString().slice(0, 10);
const money = (value) => new Intl.NumberFormat("pt-PT", {
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

function OpportunityModal({ item, mode, canEdit, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(item || EMPTY);
  const editing = mode !== "view";
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return alert("Indique o nome da oportunidade.");
    if (!form.company.trim()) return alert("Indique a empresa.");
    if (Number(form.value) < 0) return alert("O valor não pode ser negativo.");
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
            <p className="eyebrow">{editing ? "Pipeline comercial" : "Oportunidade 360°"}</p>
            <h2>{mode === "new" ? "Nova Oportunidade" : mode === "edit" ? "Editar Oportunidade" : form.title}</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        {editing ? (
          <form className="partner-form" onSubmit={submit}>
            <div className="form-section">
              <h3>1. Negócio e cliente</h3>
              <div className="form-grid">
                <label><span>Oportunidade *</span><input value={form.title} onChange={(e) => set("title", e.target.value)} /></label>
                <label><span>Empresa *</span><input value={form.company} onChange={(e) => set("company", e.target.value)} /></label>
                <label><span>Contacto</span><input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} /></label>
                <label><span>Email</span><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></label>
                <label><span>Serviço</span><input value={form.service} onChange={(e) => set("service", e.target.value)} /></label>
                <label><span>Responsável</span><input value={form.owner} onChange={(e) => set("owner", e.target.value)} /></label>
              </div>
            </div>

            <div className="form-section">
              <h3>2. Valor e previsão</h3>
              <div className="form-grid">
                <label><span>Valor estimado (€)</span><input type="number" min="0" value={form.value} onChange={(e) => set("value", e.target.value)} /></label>
                <label><span>Probabilidade (%)</span><input type="number" min="0" max="100" value={form.probability} onChange={(e) => set("probability", e.target.value)} /></label>
                <label><span>Etapa</span><select value={form.stage} onChange={(e) => set("stage", e.target.value)}>{OPPORTUNITY_STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                <label><span>Estado</span><select value={form.status} onChange={(e) => set("status", e.target.value)}>{OPPORTUNITY_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label><span>Data de criação</span><input type="date" value={form.createdAt} onChange={(e) => set("createdAt", e.target.value)} /></label>
                <label><span>Fecho previsto</span><input type="date" value={form.expectedClose} onChange={(e) => set("expectedClose", e.target.value)} /></label>
              </div>
            </div>

            <div className="form-section">
              <h3>3. Acompanhamento</h3>
              <label><span>Próxima ação</span><input value={form.nextAction} onChange={(e) => set("nextAction", e.target.value)} /></label>
              <label><span>Observações</span><textarea rows="4" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></label>
            </div>

            <footer className="modal-actions">
              <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
              <button className="primary-action">Guardar oportunidade</button>
            </footer>
          </form>
        ) : (
          <div className="partner-detail">
            <section className="detail-hero opportunity-detail-hero">
              <div>
                <span className={`opportunity-status ${slug(form.status)}`}>{form.status}</span>
                <p>{form.company} • {form.contactName || "Contacto não indicado"}</p>
              </div>
              <strong>{money(form.value)}</strong>
            </section>
            <div className="detail-grid">
              <article><span>Etapa</span><strong>{form.stage}</strong><p>{form.probability}% de probabilidade</p></article>
              <article><span>Responsável</span><strong>{form.owner}</strong><p>{form.service || "Serviço não indicado"}</p></article>
              <article><span>Fecho previsto</span><strong>{form.expectedClose || "—"}</strong><p>Criada em {form.createdAt}</p></article>
              <article><span>Próxima ação</span><strong>{form.nextAction || "Não definida"}</strong><p>{form.email || "Sem email"}</p></article>
            </div>
            <section className="relationship-card">
              <p className="eyebrow">Contexto comercial</p>
              <h3>{form.title}</h3>
              <p>{form.notes || "Ainda não existem observações."}</p>
            </section>
            <footer className="modal-actions">
              {canEdit && (
                <>
                  <button className="danger-button" onClick={() => {
                    if (confirm(`Eliminar a oportunidade “${form.title}”?`)) {
                      onDelete(form.id);
                      onClose();
                    }
                  }}>Eliminar</button>
                  <button className="primary-action" onClick={() => onClose("edit", form)}>Editar oportunidade</button>
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
    <AppLayout user={user} activePage="opportunities" onNavigate={onNavigate} onLogout={onLogout} title="Oportunidades">
      <div className="content opportunities-content">
        <section className="partners-hero opportunities-hero">
          <div>
            <p className="eyebrow light">Pipeline de crescimento</p>
            <h2>Gestão de Oportunidades</h2>
            <p>Acompanhe valor, probabilidade e etapa de cada negócio até ao fecho.</p>
          </div>
          {canEdit && <button className="new-partner-button" onClick={() => setModal({ mode: "new", item: EMPTY })}>+ Nova Oportunidade</button>}
        </section>

        <section className="opportunity-metrics">
          <article><span>Total</span><strong>{metrics.total}</strong><small>oportunidades</small></article>
          <article className="metric-blue"><span>Em aberto</span><strong>{metrics.open}</strong><small>negócios ativos</small></article>
          <article className="metric-green"><span>Pipeline</span><strong>{money(metrics.pipeline)}</strong><small>valor potencial</small></article>
          <article className="metric-gold"><span>Pipeline ponderado</span><strong>{money(metrics.weighted)}</strong><small>ajustado à probabilidade</small></article>
          <article className="metric-dark"><span>Ganhos</span><strong>{money(metrics.won)}</strong><small>valor conquistado</small></article>
        </section>

        <section className="opportunity-toolbar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar oportunidade, empresa ou contacto..." /></label>
          <select value={stage} onChange={(e) => setStage(e.target.value)}><option>Todas</option>{OPPORTUNITY_STAGES.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option>Todos</option>{OPPORTUNITY_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={owner} onChange={(e) => setOwner(e.target.value)}><option>Todos</option>{owners.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="value-desc">Maior valor</option>
            <option value="probability-desc">Maior probabilidade</option>
            <option value="close-asc">Fecho mais próximo</option>
          </select>
        </section>

        <section className="partners-table-card">
          <header>
            <div><p className="eyebrow">Funil de vendas</p><h2>{filtered.length} oportunidade{filtered.length === 1 ? "" : "s"}</h2></div>
            <span className="table-note">Valor ponderado = valor × probabilidade</span>
          </header>
          <div className="partners-table-wrap">
            <table className="partners-table opportunities-table">
              <thead><tr><th>Oportunidade</th><th>Empresa</th><th>Valor</th><th>Etapa</th><th>Probabilidade</th><th>Estado</th><th>Responsável</th><th>Fecho previsto</th><th>Próxima ação</th><th /></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className={`opportunity-row-${slug(item.status)}`}>
                    <td><button className="company-link" onClick={() => setModal({ mode: "view", item })}><span className="company-avatar">{item.title.charAt(0)}</span><span><strong>{item.title}</strong><small>#{item.id}</small></span></button></td>
                    <td><strong>{item.company}</strong><small>{item.contactName}</small></td>
                    <td><strong className="opportunity-value">{money(item.value)}</strong><small>{money(Number(item.value) * Number(item.probability) / 100)} ponderado</small></td>
                    <td><span className={`stage-label ${slug(item.stage)}`}>{item.stage}</span></td>
                    <td><div className="probability"><span style={{ width: `${item.probability}%` }} /></div><small>{item.probability}%</small></td>
                    <td><span className={`opportunity-status ${slug(item.status)}`}>{item.status}</span></td>
                    <td>{item.owner}</td>
                    <td><strong>{item.expectedClose || "—"}</strong><small>Criada: {item.createdAt}</small></td>
                    <td>{item.nextAction || "Não definida"}</td>
                    <td><div className="row-actions"><button onClick={() => setModal({ mode: "view", item })}>Ver</button>{canEdit && <button onClick={() => setModal({ mode: "edit", item })}>Editar</button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <div className="empty-state"><strong>Nenhuma oportunidade encontrada.</strong><p>Altere a pesquisa ou os filtros.</p></div>}
        </section>
      </div>
      {modal && <OpportunityModal {...modal} canEdit={canEdit} onSave={onSave} onDelete={onDelete} onClose={close} />}
    </AppLayout>
  );
}
