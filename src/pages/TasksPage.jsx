import React, { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const TODAY = () => new Date().toISOString().slice(0, 10);
const EMPTY = { id:null, title:"", description:"", dueDate:TODAY(), priority:"medium", status:"pending", owner:"Mônica Cardoso", relatedType:"none", relatedId:"", relatedLabel:"", notes:"" };

function recordsFor(type, leads, partners, opportunities) {
  if (type === "lead") return leads.map((x) => ({ id:x.id, label:`${x.name} — ${x.company}` }));
  if (type === "partner") return partners.map((x) => ({ id:x.id, label:x.name }));
  if (type === "opportunity") return opportunities.map((x) => ({ id:x.id, label:`${x.title} — ${x.company}` }));
  return [];
}

function TaskModal({ task, mode, records, onClose, onSave, onDelete, t }) {
  const [form, setForm] = useState(task || EMPTY);
  const editing = mode !== "view";
  const set = (key, value) => setForm((current) => ({ ...current, [key]:value }));
  const related = records(form.relatedType);
  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return alert(t("tasks.required"));
    if (!form.dueDate) return alert(t("tasks.dateRequired"));
    const selected = related.find((x) => String(x.id) === String(form.relatedId));
    onSave({ ...form, relatedLabel:selected?.label || "" });
    onClose();
  }
  return <div className="modal-backdrop"><section className="partner-modal task-modal"><header className="modal-header"><div><p className="eyebrow">{t("tasks.details")}</p><h2>{mode === "new" ? t("tasks.new").replace("+ ", "") : form.title}</h2></div><button className="close-button" onClick={onClose}>×</button></header>
    {editing ? <form className="partner-form" onSubmit={submit}><div className="form-section"><div className="form-grid">
      <label><span>{t("tasks.titleField")}</span><input maxLength="140" value={form.title} onChange={(e)=>set("title",e.target.value)} /></label>
      <label><span>{t("tasks.owner")}</span><input maxLength="100" value={form.owner} onChange={(e)=>set("owner",e.target.value)} /></label>
      <label><span>{t("tasks.dueDate")}</span><input type="date" value={form.dueDate} onChange={(e)=>set("dueDate",e.target.value)} /></label>
      <label><span>{t("tasks.priority")}</span><select value={form.priority} onChange={(e)=>set("priority",e.target.value)}><option value="low">{t("tasks.low")}</option><option value="medium">{t("tasks.medium")}</option><option value="high">{t("tasks.high")}</option></select></label>
      <label><span>{t("tasks.status")}</span><select value={form.status} onChange={(e)=>set("status",e.target.value)}><option value="pending">{t("tasks.pendingStatus")}</option><option value="progress">{t("tasks.progress")}</option><option value="completed">{t("tasks.completedStatus")}</option></select></label>
      <label><span>{t("tasks.relatedType")}</span><select value={form.relatedType} onChange={(e)=>setForm((c)=>({...c,relatedType:e.target.value,relatedId:"",relatedLabel:""}))}><option value="none">{t("tasks.none")}</option><option value="lead">{t("tasks.lead")}</option><option value="partner">{t("tasks.partner")}</option><option value="opportunity">{t("tasks.opportunity")}</option></select></label>
      {form.relatedType !== "none" && <label className="form-wide"><span>{t("tasks.relatedRecord")}</span><select value={form.relatedId} onChange={(e)=>set("relatedId",e.target.value)}><option value="">—</option>{related.map((x)=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>}
    </div><label><span>{t("tasks.descriptionField")}</span><textarea rows="3" maxLength="800" value={form.description} onChange={(e)=>set("description",e.target.value)} /></label><label><span>{t("tasks.notes")}</span><textarea rows="3" maxLength="800" value={form.notes} onChange={(e)=>set("notes",e.target.value)} /></label></div><footer className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>{t("tasks.cancel")}</button><button className="primary-action">{t("tasks.save")}</button></footer></form>
    : <div className="partner-detail"><section className="task-detail-hero"><span className={`task-priority ${form.priority}`}>{t(`tasks.${form.priority}`)}</span><h3>{form.title}</h3><p>{form.description}</p></section><div className="detail-grid"><article><span>{t("tasks.deadline")}</span><strong>{form.dueDate}</strong></article><article><span>{t("tasks.owner")}</span><strong>{form.owner}</strong></article><article><span>{t("tasks.status")}</span><strong>{t(`tasks.${form.status === "completed" ? "completedStatus" : form.status === "progress" ? "progress" : "pendingStatus"}`)}</strong></article><article><span>{t("tasks.relation")}</span><strong>{form.relatedLabel || t("tasks.none")}</strong></article></div>{form.notes && <section className="notes-card"><p className="eyebrow">{t("tasks.notes")}</p><p>{form.notes}</p></section>}<footer className="modal-actions"><button className="danger-button" onClick={()=>{if(confirm(t("tasks.deleteConfirm",{title:form.title}))){onDelete(form.id);onClose();}}}>{t("tasks.delete")}</button><button className="primary-action" onClick={()=>onClose("edit",form)}>{t("tasks.edit")}</button><button className="secondary-button" onClick={onClose}>{t("tasks.close")}</button></footer></div>}
  </section></div>;
}

export default function TasksPage({ user, tasks, leads, partners, opportunities, onSave, onDelete, onNavigate, onLogout }) {
  const { t, locale } = useLanguage();
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("all"); const [priority,setPriority]=useState("all"); const [owner,setOwner]=useState("all"); const [modal,setModal]=useState(null);
  const today=TODAY(); const pending=tasks.filter((x)=>x.status!=="completed");
  const owners=[...new Set(tasks.map((x)=>x.owner).filter(Boolean))];
  const filtered=useMemo(()=>tasks.filter((x)=>{const q=search.toLowerCase(); return (!q||[x.title,x.relatedLabel,x.owner].some((v)=>String(v||"").toLowerCase().includes(q)))&&(status==="all"||x.status===status)&&(priority==="all"||x.priority===priority)&&(owner==="all"||x.owner===owner);}).sort((a,b)=>a.status===b.status?String(a.dueDate).localeCompare(String(b.dueDate)):a.status==="completed"?1:-1),[tasks,search,status,priority,owner]);
  const records=(type)=>recordsFor(type,leads,partners,opportunities);
  const close=(action,item)=>action==="edit"?setModal({mode:"edit",task:item}):setModal(null);
  const statusText=(x)=>t(`tasks.${x==="completed"?"completedStatus":x==="progress"?"progress":"pendingStatus"}`);
  return <AppLayout user={user} activePage="tasks" onNavigate={onNavigate} onLogout={onLogout} title={t("tasks.title")}><div className="content tasks-content">
    <section className="partners-hero"><div><p className="eyebrow light">{t("tasks.eyebrow")}</p><h2>{t("tasks.heading")}</h2><p>{t("tasks.description")}</p></div><button className="new-partner-button" onClick={()=>setModal({mode:"new",task:EMPTY})}>{t("tasks.new")}</button></section>
    <section className="partner-metrics"><article><span>{t("tasks.total")}</span><strong>{tasks.length}</strong></article><article className="metric-blue"><span>{t("tasks.pending")}</span><strong>{pending.length}</strong></article><article><span>{t("tasks.dueToday")}</span><strong>{pending.filter((x)=>x.dueDate===today).length}</strong></article><article className="metric-red"><span>{t("tasks.overdue")}</span><strong>{pending.filter((x)=>x.dueDate<today).length}</strong></article><article className="metric-green"><span>{t("tasks.completed")}</span><strong>{tasks.filter((x)=>x.status==="completed").length}</strong></article></section>
    <section className="task-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={t("tasks.search")} /></label><select value={status} onChange={(e)=>setStatus(e.target.value)}><option value="all">{t("tasks.allStatuses")}</option><option value="pending">{t("tasks.pendingStatus")}</option><option value="progress">{t("tasks.progress")}</option><option value="completed">{t("tasks.completedStatus")}</option></select><select value={priority} onChange={(e)=>setPriority(e.target.value)}><option value="all">{t("tasks.allPriorities")}</option><option value="high">{t("tasks.high")}</option><option value="medium">{t("tasks.medium")}</option><option value="low">{t("tasks.low")}</option></select><select value={owner} onChange={(e)=>setOwner(e.target.value)}><option value="all">{t("tasks.allOwners")}</option>{owners.map((x)=><option key={x}>{x}</option>)}</select></section>
    <section className="partners-table-card"><header><div><p className="eyebrow">{t("tasks.list")}</p><h2>{t("tasks.count",{count:filtered.length})}</h2></div></header><div className="partners-table-wrap"><table className="partners-table task-table"><thead><tr><th>{t("tasks.task")}</th><th>{t("tasks.relation")}</th><th>{t("tasks.owner")}</th><th>{t("tasks.deadline")}</th><th>{t("tasks.priority")}</th><th>{t("tasks.status")}</th><th /></tr></thead><tbody>{filtered.map((x)=>{const late=x.status!=="completed"&&x.dueDate<today;const due=x.status!=="completed"&&x.dueDate===today;return <tr key={x.id} className={late?"task-overdue-row":""}><td><button className="company-link" onClick={()=>setModal({mode:"view",task:x})}><span className="task-check">{x.status==="completed"?"✓":"○"}</span><span><strong>{x.title}</strong><small>{x.description}</small></span></button></td><td>{x.relatedLabel||t("tasks.none")}</td><td>{x.owner}</td><td><strong>{new Intl.DateTimeFormat(locale).format(new Date(`${x.dueDate}T12:00:00`))}</strong>{late&&<small className="task-date-alert">{t("tasks.overdueBadge")}</small>}{due&&<small className="task-date-today">{t("tasks.todayBadge")}</small>}</td><td><span className={`task-priority ${x.priority}`}>{t(`tasks.${x.priority}`)}</span></td><td><span className={`task-status ${x.status}`}>{statusText(x.status)}</span></td><td><div className="row-actions"><button onClick={()=>onSave({...x,status:x.status==="completed"?"pending":"completed"})}>{x.status==="completed"?t("tasks.reopen"):t("tasks.markDone")}</button><button onClick={()=>setModal({mode:"edit",task:x})}>{t("tasks.edit")}</button></div></td></tr>})}</tbody></table></div>{!filtered.length&&<div className="empty-state"><strong>{t("tasks.noTasks")}</strong><p>{t("tasks.changeFilters")}</p></div>}</section>
  </div>{modal&&<TaskModal task={modal.task} mode={modal.mode} records={records} onClose={close} onSave={onSave} onDelete={onDelete} t={t} />}</AppLayout>;
}
