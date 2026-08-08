import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useDialogAccessibility } from "../utils/useDialogAccessibility.js";

const TODAY = () => new Date().toISOString().slice(0, 10);
const EMPTY = {
  id: null,
  title: "",
  description: "",
  dueDate: TODAY(),
  priority: "medium",
  status: "pending",
  owner: "Mônica Cardoso",
  urgent: false,
  important: true,
  delegable: false,
  relatedType: "none",
  relatedId: "",
  relatedLabel: "",
  notes: ""
};

const QUADRANTS = [
  { id: "q1", urgent: true, important: true },
  { id: "q2", urgent: false, important: true },
  { id: "q3", urgent: true, important: false },
  { id: "q4", urgent: false, important: false }
];

function recordsFor(type, leads, partners, opportunities) {
  if (type === "lead") return leads.map((item) => ({ id: item.id, label: `${item.name} — ${item.company}` }));
  if (type === "partner") return partners.map((item) => ({ id: item.id, label: item.name }));
  if (type === "opportunity") return opportunities.map((item) => ({ id: item.id, label: `${item.title} — ${item.company}` }));
  return [];
}

function quadrantFor(task) {
  if (task.urgent && task.important) return "q1";
  if (!task.urgent && task.important) return "q2";
  if (task.urgent && !task.important) return "q3";
  return "q4";
}

function TaskModal({ task, mode, records, onClose, onSave, onDelete, t, canManageStrategy }) {
  const [form, setForm] = useState({ ...EMPTY, ...(task || {}) });
  const dialogRef = useDialogAccessibility(onClose);
  const editing = mode !== "view";
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const related = records(form.relatedType);
  const quadrant = quadrantFor(form);

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return alert(t("tasks.required"));
    if (!form.dueDate) return alert(t("tasks.dateRequired"));
    const selected = related.find((item) => String(item.id) === String(form.relatedId));
    onSave({ ...form, relatedLabel: selected?.label || "" });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section ref={dialogRef} className="partner-modal task-modal" role="dialog" aria-modal="true" aria-label={mode === "new" ? t("tasks.new").replace("+ ", "") : form.title} tabIndex="-1">
        <header className="modal-header">
          <div><p className="eyebrow">{t("tasks.details")}</p><h2>{mode === "new" ? t("tasks.new").replace("+ ", "") : form.title}</h2></div>
          <button type="button" className="close-button" aria-label={t("accessibility.closeDialog")} onClick={onClose}>×</button>
        </header>
        {editing ? (
          <form className="partner-form" onSubmit={submit}>
            <div className="form-section">
              <div className="form-grid">
                <label><span>{t("tasks.titleField")}</span><input maxLength="140" value={form.title} onChange={(event) => set("title", event.target.value)} /></label>
                <label><span>{t("tasks.owner")}</span><input maxLength="100" value={form.owner} disabled={!canManageStrategy} onChange={(event) => set("owner", event.target.value)} /></label>
                <label><span>{t("tasks.dueDate")}</span><input type="date" value={form.dueDate} onChange={(event) => set("dueDate", event.target.value)} /></label>
                <label><span>{t("tasks.priority")}</span><select value={form.priority} onChange={(event) => set("priority", event.target.value)}><option value="low">{t("tasks.low")}</option><option value="medium">{t("tasks.medium")}</option><option value="high">{t("tasks.high")}</option></select></label>
                <label><span>{t("tasks.status")}</span><select value={form.status} onChange={(event) => set("status", event.target.value)}><option value="pending">{t("tasks.pendingStatus")}</option><option value="progress">{t("tasks.progress")}</option><option value="completed">{t("tasks.completedStatus")}</option></select></label>
                <label><span>{t("tasks.relatedType")}</span><select value={form.relatedType} onChange={(event) => setForm((current) => ({ ...current, relatedType: event.target.value, relatedId: "", relatedLabel: "" }))}><option value="none">{t("tasks.none")}</option><option value="lead">{t("tasks.lead")}</option><option value="partner">{t("tasks.partner")}</option><option value="opportunity">{t("tasks.opportunity")}</option></select></label>
                {form.relatedType !== "none" && <label className="form-wide"><span>{t("tasks.relatedRecord")}</span><select value={form.relatedId} onChange={(event) => set("relatedId", event.target.value)}><option value="">—</option>{related.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>}
              </div>
              {canManageStrategy && <fieldset className="task-strategy-fields">
                <legend>{t("tasks.strategicClassification")}</legend>
                <p>{t("tasks.strategicHelp")}</p>
                <div>
                  <label className="task-strategy-toggle"><input type="checkbox" checked={form.urgent} onChange={(event) => set("urgent", event.target.checked)} /><span><strong>{t("tasks.urgent")}</strong><small>{t("tasks.urgentHelp")}</small></span></label>
                  <label className="task-strategy-toggle"><input type="checkbox" checked={form.important} onChange={(event) => set("important", event.target.checked)} /><span><strong>{t("tasks.important")}</strong><small>{t("tasks.importantHelp")}</small></span></label>
                  <label className="task-strategy-toggle"><input type="checkbox" checked={form.delegable} onChange={(event) => set("delegable", event.target.checked)} /><span><strong>{t("tasks.delegable")}</strong><small>{t("tasks.delegableHelp")}</small></span></label>
                </div>
                <output className={`task-quadrant-preview ${quadrant}`}>{t(`tasks.${quadrant}Action`)} · {t(`tasks.${quadrant}Title`)}</output>
              </fieldset>}
              <label><span>{t("tasks.descriptionField")}</span><textarea rows="3" maxLength="800" value={form.description} onChange={(event) => set("description", event.target.value)} /></label>
              <label><span>{t("tasks.notes")}</span><textarea rows="3" maxLength="800" value={form.notes} onChange={(event) => set("notes", event.target.value)} /></label>
            </div>
            <footer className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>{t("tasks.cancel")}</button><button className="primary-action">{t("tasks.save")}</button></footer>
          </form>
        ) : (
          <div className="partner-detail">
            <section className="task-detail-hero"><span className={`task-priority ${form.priority}`}>{t(`tasks.${form.priority}`)}</span><h3>{form.title}</h3><p>{form.description}</p></section>
            <div className="detail-grid">
              <article><span>{t("tasks.deadline")}</span><strong>{form.dueDate}</strong></article>
              <article><span>{t("tasks.owner")}</span><strong>{form.owner}</strong></article>
              <article><span>{t("tasks.status")}</span><strong>{t(`tasks.${form.status === "completed" ? "completedStatus" : form.status === "progress" ? "progress" : "pendingStatus"}`)}</strong></article>
              <article><span>{t("tasks.relation")}</span><strong>{form.relatedLabel || t("tasks.none")}</strong></article>
              {canManageStrategy && <article><span>{t("tasks.matrix")}</span><strong>{t(`tasks.${quadrant}Action`)} · {t(`tasks.${quadrant}Title`)}</strong></article>}
              {canManageStrategy && <article><span>{t("tasks.delegable")}</span><strong>{form.delegable ? t("tasks.yes") : t("tasks.no")}</strong></article>}
            </div>
            {form.notes && <section className="notes-card"><p className="eyebrow">{t("tasks.notes")}</p><p>{form.notes}</p></section>}
            <footer className="modal-actions"><button className="danger-button" onClick={() => { if (confirm(t("tasks.deleteConfirm", { title: form.title }))) { onDelete(form.id); onClose(); } }}>{t("tasks.delete")}</button><button className="primary-action" onClick={() => onClose("edit", form)}>{t("tasks.edit")}</button><button className="secondary-button" onClick={onClose}>{t("tasks.close")}</button></footer>
          </div>
        )}
      </section>
    </div>
  );
}

function PriorityMatrix({ tasks, locale, t, onOpen, onCreate }) {
  return (
    <section className="priority-matrix-section" aria-labelledby="priority-matrix-title">
      <header className="priority-matrix-header">
        <div><p className="eyebrow">{t("tasks.strategicView")}</p><h2 id="priority-matrix-title">{t("tasks.matrixHeading")}</h2><p>{t("tasks.matrixDescription")}</p></div>
        <span>{t("tasks.matrixActiveCount", { count: tasks.length })}</span>
      </header>
      <ol className="matrix-guide" aria-label={t("tasks.matrixGuideLabel")}>
        <li><b>1</b><span>{t("tasks.matrixGuide1")}</span></li>
        <li><b>2</b><span>{t("tasks.matrixGuide2")}</span></li>
        <li><b>3</b><span>{t("tasks.matrixGuide3")}</span></li>
      </ol>
      <div className="priority-matrix-axis priority-matrix-axis-top" aria-hidden="true"><span>{t("tasks.notUrgent")}</span><strong>{t("tasks.urgencyAxis")}</strong><span>{t("tasks.urgent")}</span></div>
      <div className="priority-matrix-shell">
        <div className="priority-matrix-axis priority-matrix-axis-side" aria-hidden="true"><span>{t("tasks.notImportant")}</span><strong>{t("tasks.importanceAxis")}</strong><span>{t("tasks.important")}</span></div>
        <div className="priority-matrix-grid">
          {QUADRANTS.map((quadrant) => {
            const items = tasks.filter((task) => quadrantFor(task) === quadrant.id);
            return (
              <article className={`priority-quadrant ${quadrant.id}`} key={quadrant.id}>
                <header><span>{t(`tasks.${quadrant.id}Action`)}</span><strong>{t(`tasks.${quadrant.id}Title`)}</strong><small>{t(`tasks.${quadrant.id}Description`)}</small></header>
                <div className="priority-quadrant-tasks">
                  {items.map((task) => (
                    <button type="button" className="matrix-task-card" key={task.id} onClick={() => onOpen(task)}>
                      <strong>{task.title}</strong>
                      <span>{task.owner}</span>
                      <small>{new Intl.DateTimeFormat(locale).format(new Date(`${task.dueDate}T12:00:00`))}{task.delegable ? ` · ${t("tasks.delegableBadge")}` : ""}</small>
                      <em>{t("tasks.editClassification")} <span aria-hidden="true">→</span></em>
                    </button>
                  ))}
                  {!items.length && <p className="matrix-empty">{t("tasks.noQuadrantTasks")}</p>}
                  <button type="button" className="matrix-create-button" onClick={() => onCreate(quadrant)}><span aria-hidden="true">＋</span>{t("tasks.createInQuadrant")}</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <p className="matrix-completed-note">{t("tasks.matrixCompletedNote")}</p>
    </section>
  );
}

export default function TasksPage({ user, tasks, leads, partners, opportunities, onSave, onDelete, onNavigate, onLogout }) {
  const { t, locale } = useLanguage();
  const isAdmin = user?.profileKey === "admin";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [owner, setOwner] = useState("all");
  const [view, setView] = useState("list");
  const [modal, setModal] = useState(null);
  const today = TODAY();
  const scopedTasks = isAdmin ? tasks : tasks.filter((task) => task.owner === user?.name);
  const pending = scopedTasks.filter((task) => task.status !== "completed");
  const owners = [...new Set(scopedTasks.map((task) => task.owner).filter(Boolean))];
  const filtered = useMemo(() => scopedTasks.filter((task) => {
    const query = search.toLowerCase();
    return (!query || [task.title, task.relatedLabel, task.owner].some((value) => String(value || "").toLowerCase().includes(query)))
      && (status === "all" || task.status === status)
      && (priority === "all" || task.priority === priority)
      && (owner === "all" || task.owner === owner);
  }).sort((a, b) => a.status === b.status ? String(a.dueDate).localeCompare(String(b.dueDate)) : a.status === "completed" ? 1 : -1), [scopedTasks, search, status, priority, owner]);
  const matrixTasks = filtered.filter((task) => task.status !== "completed");
  const records = (type) => recordsFor(type, leads, partners, opportunities);
  const close = (action, item) => action === "edit" ? setModal({ mode: "edit", task: item }) : setModal(null);
  const statusText = (value) => t(`tasks.${value === "completed" ? "completedStatus" : value === "progress" ? "progress" : "pendingStatus"}`);

  return (
    <AppLayout user={user} activePage="tasks" onNavigate={onNavigate} onLogout={onLogout} title={t("tasks.title")}>
      <div className="content tasks-content">
        <section className="partners-hero"><div><p className="eyebrow light">{t("tasks.eyebrow")}</p><h2>{t("tasks.heading")}</h2><p>{t("tasks.description")}</p></div><button className="new-partner-button" onClick={() => setModal({ mode: "new", task: { ...EMPTY, owner: user?.name || EMPTY.owner } })}>{t("tasks.new")}</button></section>
        {!isAdmin && <aside className="task-scope-notice" role="note"><span>◎</span><div><strong>{t("tasks.myTasksOnly")}</strong><p>{t("tasks.myTasksOnlyHelp")}</p></div></aside>}
        <section className="partner-metrics"><article><span>{t("tasks.total")}</span><strong>{scopedTasks.length}</strong></article><article className="metric-blue"><span>{t("tasks.pending")}</span><strong>{pending.length}</strong></article><article><span>{t("tasks.dueToday")}</span><strong>{pending.filter((task) => task.dueDate === today).length}</strong></article><article className="metric-red"><span>{t("tasks.overdue")}</span><strong>{pending.filter((task) => task.dueDate < today).length}</strong></article><article className="metric-green"><span>{t("tasks.completed")}</span><strong>{scopedTasks.filter((task) => task.status === "completed").length}</strong></article></section>
        <section className="task-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("tasks.search")} /></label><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">{t("tasks.allStatuses")}</option><option value="pending">{t("tasks.pendingStatus")}</option><option value="progress">{t("tasks.progress")}</option><option value="completed">{t("tasks.completedStatus")}</option></select><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="all">{t("tasks.allPriorities")}</option><option value="high">{t("tasks.high")}</option><option value="medium">{t("tasks.medium")}</option><option value="low">{t("tasks.low")}</option></select><select value={owner} onChange={(event) => setOwner(event.target.value)}><option value="all">{t("tasks.allOwners")}</option>{owners.map((item) => <option key={item}>{item}</option>)}</select></section>
        {isAdmin && <div className="task-view-switch" role="group" aria-label={t("tasks.viewMode")}><button type="button" className={view === "list" ? "active" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>{t("tasks.listView")}</button><button type="button" className={view === "matrix" ? "active" : ""} aria-pressed={view === "matrix"} onClick={() => setView("matrix")}>{t("tasks.matrixView")}</button></div>}
        {isAdmin && view === "matrix" ? (
          <PriorityMatrix
            tasks={matrixTasks}
            locale={locale}
            t={t}
            onOpen={(task) => setModal({ mode: "edit", task })}
            onCreate={(quadrant) => setModal({
              mode: "new",
              task: {
                ...EMPTY,
                owner: user?.name || EMPTY.owner,
                urgent: quadrant.urgent,
                important: quadrant.important,
                delegable: quadrant.id === "q3"
              }
            })}
          />
        ) : (
          <section className="partners-table-card"><header><div><p className="eyebrow">{t("tasks.list")}</p><h2>{t("tasks.count", { count: filtered.length })}</h2></div></header><div className="partners-table-wrap"><table className="partners-table task-table"><thead><tr><th>{t("tasks.task")}</th><th>{t("tasks.relation")}</th><th>{t("tasks.owner")}</th><th>{t("tasks.deadline")}</th><th>{t("tasks.priority")}</th><th>{t("tasks.status")}</th><th /></tr></thead><tbody>{filtered.map((task) => { const late = task.status !== "completed" && task.dueDate < today; const due = task.status !== "completed" && task.dueDate === today; return <tr key={task.id} className={late ? "task-overdue-row" : ""}><td><button className="company-link" onClick={() => setModal({ mode: "view", task })}><span className="task-check">{task.status === "completed" ? "✓" : "○"}</span><span><strong>{task.title}</strong><small>{task.description}</small></span></button></td><td>{task.relatedLabel || t("tasks.none")}</td><td>{task.owner}</td><td><strong>{new Intl.DateTimeFormat(locale).format(new Date(`${task.dueDate}T12:00:00`))}</strong>{late && <small className="task-date-alert">{t("tasks.overdueBadge")}</small>}{due && <small className="task-date-today">{t("tasks.todayBadge")}</small>}</td><td><span className={`task-priority ${task.priority}`}>{t(`tasks.${task.priority}`)}</span></td><td><span className={`task-status ${task.status}`}>{statusText(task.status)}</span></td><td><div className="row-actions"><button onClick={() => onSave({ ...task, status: task.status === "completed" ? "pending" : "completed" })}>{task.status === "completed" ? t("tasks.reopen") : t("tasks.markDone")}</button><button onClick={() => setModal({ mode: "edit", task })}>{t("tasks.edit")}</button></div></td></tr>; })}</tbody></table></div>{!filtered.length && <div className="empty-state"><strong>{t("tasks.noTasks")}</strong><p>{t("tasks.changeFilters")}</p></div>}</section>
        )}
      </div>
      {modal && <TaskModal task={modal.task} mode={modal.mode} records={records} onClose={close} onSave={onSave} onDelete={onDelete} t={t} canManageStrategy={isAdmin} />}
    </AppLayout>
  );
}
