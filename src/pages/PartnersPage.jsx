import RelationshipScore from "../components/RelationshipScore.jsx";
import RelationshipTimeline from "../components/RelationshipTimeline.jsx";
import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
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

function currency(value) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");

  return <span className={`partner-status ${className}`}>{status}</span>;
}

function PartnerModal({ partner, mode, onClose, onSave, onDelete, canEdit }) {
  const [form, setForm] = useState(partner || EMPTY_PARTNER);
  const editing = mode === "edit" || mode === "new";
  const title = mode === "new"
    ? "Novo Parceiro"
    : mode === "edit"
      ? "Editar Parceiro"
      : form.name;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert("Por favor, indique o nome da empresa.");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      window.alert("Indique pelo menos um email ou telefone.");
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
              {mode === "view" ? "Cliente 360°" : "Gestão de relacionamento"}
            </p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </header>

        {editing ? (
          <form className="partner-form" onSubmit={submit}>
            <div className="form-section">
              <h3>Dados da empresa</h3>
              <div className="form-grid">
                <label>
                  <span>Nome da empresa *</span>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} />
                </label>
                <label>
                  <span>Setor</span>
                  <input value={form.sector} onChange={(e) => update("sector", e.target.value)} />
                </label>
                <label>
                  <span>País</span>
                  <input value={form.country} onChange={(e) => update("country", e.target.value)} />
                </label>
                <label>
                  <span>Cidade</span>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)} />
                </label>
                <label>
                  <span>Website</span>
                  <input value={form.website} onChange={(e) => update("website", e.target.value)} />
                </label>
                <label>
                  <span>Valor potencial (€)</span>
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
              <h3>Contacto principal</h3>
              <div className="form-grid">
                <label>
                  <span>Nome do contacto</span>
                  <input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                </label>
                <label>
                  <span>Responsável comercial</span>
                  <input value={form.manager} onChange={(e) => update("manager", e.target.value)} />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </label>
                <label>
                  <span>Telefone</span>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Classificação e acompanhamento</h3>
              <div className="form-grid">
                <label>
                  <span>Estado</span>
                  <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                    {PARTNER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  <span>Prioridade</span>
                  <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                    {PARTNER_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                  </select>
                </label>
                <label>
                  <span>Último contacto</span>
                  <input type="date" value={form.lastContact} onChange={(e) => update("lastContact", e.target.value)} />
                </label>
                <label>
                  <span>Próxima ação</span>
                  <input value={form.nextAction} onChange={(e) => update("nextAction", e.target.value)} />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Relacionamento</h3>
              <label>
                <span>Preferências e conhecimento relacional</span>
                <textarea
                  rows="3"
                  value={form.relationship}
                  onChange={(e) => update("relationship", e.target.value)}
                />
              </label>
              <label>
                <span>Observações</span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </label>
            </div>

            <footer className="modal-actions">
              <button type="button" className="secondary-button" onClick={onClose}>Cancelar</button>
              <button type="submit" className="primary-action">Guardar parceiro</button>
            </footer>
          </form>
        ) : (
          <div className="partner-detail">
            <section className="detail-hero">
              <div>
                <StatusBadge status={form.status} />
                <p>{form.city}, {form.country} • {form.sector}</p>
              </div>
              <strong>{currency(form.potentialValue)}</strong>
            </section>

            <div className="detail-grid">
              <article>
                <span>Contacto principal</span>
                <strong>{form.contactName || "Não indicado"}</strong>
                <p>{form.email || "Sem email"}<br />{form.phone || "Sem telefone"}</p>
              </article>
              <article>
                <span>Responsável comercial</span>
                <strong>{form.manager || "Não atribuído"}</strong>
                <p>Prioridade {form.priority}</p>
              </article>
              <article>
                <span>Último contacto</span>
                <strong>{form.lastContact || "Ainda não realizado"}</strong>
                <p>{form.nextAction || "Sem próxima ação definida"}</p>
              </article>
              <article>
                <span>Website</span>
                <strong>{form.website || "Não indicado"}</strong>
                <p>Informação comercial centralizada</p>
              </article>
            </div>

            <section className="relationship-card">
              <p className="eyebrow">Relacionamento</p>
              <h3>Conhecimento que fortalece a relação</h3>
              <p>{form.relationship || "Ainda não existem preferências registadas."}</p>
            </section>

            <section className="partner-insight">
              <div className="insightMark">N</div>
              <div>
                <p className="eyebrow light">Insight NEXA360</p>
                <h3>
                  {form.status === "Perdido"
                    ? "Esta relação poderá ser retomada no momento certo."
                    : form.status === "Captado"
                      ? "Este parceiro apresenta uma relação comercial consolidada."
                      : "Existe uma oportunidade concreta para fortalecer esta relação."}
                </h3>
                <p>
                  {form.nextAction
                    ? `Próxima ação recomendada: ${form.nextAction}.`
                    : "Recomendamos definir uma próxima ação para manter o acompanhamento ativo."}
                </p>
              </div>
            </section>

            {form.notes && (
              <section className="notes-card">
                <p className="eyebrow">Observações</p>
                <p>{form.notes}</p>
              </section>
            )}

            <footer className="modal-actions">
              {canEdit && (
                <>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      if (window.confirm(`Eliminar ${form.name}?`)) {
                        onDelete(form.id);
                        onClose();
                      }
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => onClose("edit", form)}
                  >
                    Editar parceiro
                  </button>
                </>
              )}
              {!canEdit && (
                <button type="button" className="secondary-button" onClick={onClose}>Fechar</button>
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [country, setCountry] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [modal, setModal] = useState(() => {
    const partner = partners.find((item) => item.name === initialPartnerName);
    return partner ? { mode: "view", partner } : null;
  });
  const canEdit = user.profileKey === "admin";

  const countries = useMemo(
    () => [...new Set(partners.map((partner) => partner.country))].sort(),
    [partners]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesSearch = !term || [
        partner.name,
        partner.contactName,
        partner.email,
        partner.sector
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesSearch
        && (status === "Todos" || partner.status === status)
        && (country === "Todos" || partner.country === country)
        && (priority === "Todas" || partner.priority === priority);
    });
  }, [partners, search, status, country, priority]);

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
      title="Parceiros"
    >
      <div className="content partners-content">
        <section className="partners-hero">
          <div>
            
            <p className="eyebrow light">Relações empresariais</p>
            <h2>Parceiros</h2>
            <p>
              Cada empresa representa uma história, uma relação construída
              e uma oportunidade de criar valor.
            </p>
          </div>
          {canEdit && (
            <button
              type="button"
              className="new-partner-button"
              onClick={() => setModal({ mode: "new", partner: EMPTY_PARTNER })}
            >
              + Novo Parceiro
            </button>
          )}
        </section>
<RelationshipScore partnerName="NordWerk GmbH" />
<RelationshipTimeline partners={partners} />
        <section className="partner-metrics">
          <article><span>Todos</span><strong>{totals.all}</strong><small>relações registadas</small></article>
          <article className="metric-blue"><span>Em acompanhamento</span><strong>{totals.active}</strong><small>relações em trabalho</small></article>
          <article className="metric-green"><span>Captados</span><strong>{totals.won}</strong><small>clientes conquistados</small></article>
          <article className="metric-red"><span>Perdidos</span><strong>{totals.lost}</strong><small>oportunidades não concretizadas</small></article>
        </section>

        <section className="partner-toolbar">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por empresa, contacto, email ou setor..."
            />
          </label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Todos</option>
            {PARTNER_STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option>Todos</option>
            {countries.map((item) => <option key={item}>{item}</option>)}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Todas</option>
            {PARTNER_PRIORITIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </section>

        <section className="partners-table-card">
          <header>
            <div>
              <p className="eyebrow">Carteira empresarial</p>
              <h2>{filtered.length} parceiro{filtered.length === 1 ? "" : "s"}</h2>
            </div>
            <span className="table-note">
              Azul: em acompanhamento • Verde: captado • Vermelho: perdido
            </span>
          </header>

          <div className="partners-table-wrap">
            <table className="partners-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>País</th>
                  <th>Responsável</th>
                  <th>Valor potencial</th>
                  <th>Estado</th>
                  <th>Prioridade</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((partner) => (
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
                          <small>{partner.sector}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <strong>{partner.contactName}</strong>
                      <small>{partner.email}</small>
                    </td>
                    <td><strong>{partner.country}</strong><small>{partner.city}</small></td>
                    <td>{partner.manager}</td>
                    <td>{currency(partner.potentialValue)}</td>
                    <td><StatusBadge status={partner.status} /></td>
                    <td><span className={`priority-label ${partner.priority.toLowerCase()}`}>{partner.priority}</span></td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "view", partner })}
                        >
                          Ver
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => setModal({ mode: "edit", partner })}
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <strong>Nenhum parceiro encontrado.</strong>
              <p>Experimente alterar a pesquisa ou os filtros.</p>
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
        />
      )}
    </AppLayout>
  );
}
