import React,{useMemo,useState} from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import {LEAD_PRIORITIES,LEAD_SOURCES,LEAD_STATUSES} from "../data/leads.js";
import {useLanguage} from "../i18n/LanguageContext.jsx";
import {localizeLead} from "../i18n/leadRecordTranslations.js";

const EMPTY={name:"",company:"",role:"",email:"",phone:"",country:"Portugal",city:"",source:"Website",interest:"",status:"Novo",priority:"Média",owner:"Mónica Cardoso",createdAt:new Date().toISOString().slice(0,10),lastContact:"",nextAction:"",notes:""};
const slug=(v)=>v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replaceAll(" ","-");

function LeadModal({item,mode,onClose,onSave,onDelete,onConvert,canEdit,t,language}){
 const [form,setForm]=useState(item||EMPTY); const editing=mode!=="view";
 const displayForm=editing?form:localizeLead(form,language);
 const set=(k,v)=>setForm(x=>({...x,[k]:v}));
 const statusLabel=x=>t(`leads.statuses.${x}`); const priorityLabel=x=>t(`leads.priorities.${x}`); const sourceLabel=x=>t(`leads.sources.${x}`);
 function submit(e){e.preventDefault();if(!form.name.trim())return alert(t("leads.nameRequired"));if(!form.company.trim())return alert(t("leads.companyRequired"));if(!form.email.trim()&&!form.phone.trim())return alert(t("leads.contactRequired"));if(form.email&&!/^\S+@\S+\.\S+$/.test(form.email))return alert(t("leads.invalidEmail"));onSave(form);onClose();}
 return <div className="modal-backdrop"><section className="partner-modal lead-modal">
  <header className="modal-header"><div><p className="eyebrow">{editing?t("leads.leadManagement"):t("leads.lead360")}</p><h2>{mode==="new"?t("leads.newLead").replace("+ ",""):mode==="edit"?t("leads.editLead"):form.name}</h2></div><button className="close-button" onClick={()=>onClose()}>×</button></header>
  {editing?<form className="partner-form" onSubmit={submit}>
   <div className="form-section"><h3>{t("leads.personalCompany")}</h3><div className="form-grid">
    <label><span>{t("leads.fullName")}</span><input value={form.name} onChange={e=>set("name",e.target.value)}/></label>
    <label><span>{t("leads.company")} *</span><input value={form.company} onChange={e=>set("company",e.target.value)}/></label>
    <label><span>{t("leads.role")}</span><input value={form.role} onChange={e=>set("role",e.target.value)}/></label>
    <label><span>{t("leads.salesOwner")}</span><input value={form.owner} onChange={e=>set("owner",e.target.value)}/></label>
   </div></div>
   <div className="form-section"><h3>{t("leads.contactInfo")}</h3><div className="form-grid">
    <label><span>Email</span><input type="email" value={form.email} onChange={e=>set("email",e.target.value)}/></label>
    <label><span>{t("leads.phone")}</span><input value={form.phone} onChange={e=>set("phone",e.target.value)}/></label>
    <label><span>{t("leads.country")}</span><input value={form.country} onChange={e=>set("country",e.target.value)}/></label>
    <label><span>{t("leads.city")}</span><input value={form.city} onChange={e=>set("city",e.target.value)}/></label>
   </div></div>
   <div className="form-section"><h3>{t("leads.classification")}</h3><div className="form-grid">
    <label><span>{t("leads.productInterest")}</span><input value={form.interest} onChange={e=>set("interest",e.target.value)}/></label>
    <label><span>{t("leads.source")}</span><select value={form.source} onChange={e=>set("source",e.target.value)}>{LEAD_SOURCES.map(x=><option key={x} value={x}>{sourceLabel(x)}</option>)}</select></label>
    <label><span>{t("leads.status")} *</span><select value={form.status} onChange={e=>set("status",e.target.value)}>{LEAD_STATUSES.map(x=><option key={x} value={x}>{statusLabel(x)}</option>)}</select></label>
    <label><span>{t("leads.priority")}</span><select value={form.priority} onChange={e=>set("priority",e.target.value)}>{LEAD_PRIORITIES.map(x=><option key={x} value={x}>{priorityLabel(x)}</option>)}</select></label>
   </div></div>
   <div className="form-section"><h3>{t("leads.followUp")}</h3><div className="form-grid">
    <label><span>{t("leads.creationDate")}</span><input type="date" value={form.createdAt} onChange={e=>set("createdAt",e.target.value)}/></label>
    <label><span>{t("leads.lastContact")}</span><input type="date" value={form.lastContact} onChange={e=>set("lastContact",e.target.value)}/></label>
   </div><label><span>{t("leads.nextAction")}</span><input value={form.nextAction} onChange={e=>set("nextAction",e.target.value)}/></label><label><span>{t("leads.notes")}</span><textarea rows="4" value={form.notes} onChange={e=>set("notes",e.target.value)}/></label></div>
   <footer className="modal-actions"><button type="button" className="secondary-button" onClick={()=>onClose()}>{t("leads.cancel")}</button><button className="primary-action">{t("leads.save")}</button></footer>
  </form>:<div className="partner-detail">
   <section className="detail-hero"><div><span className={`lead-status ${slug(form.status)}`}>{statusLabel(form.status)}</span><p>{form.company} • {displayForm.role||t("leads.roleMissing")}</p></div><strong>{priorityLabel(form.priority)}</strong></section>
   <div className="detail-grid"><article><span>{t("leads.contact")}</span><strong>{form.email||t("leads.noEmail")}</strong><p>{form.phone||t("leads.noPhone")}</p></article><article><span>{t("leads.location")}</span><strong>{form.city||"—"}</strong><p>{displayForm.country}</p></article><article><span>{t("leads.owner")}</span><strong>{form.owner}</strong><p>{t("leads.originLabel",{source:sourceLabel(form.source)})}</p></article><article><span>{t("leads.nextAction")}</span><strong>{displayForm.nextAction||t("leads.notDefined")}</strong><p>{t("leads.lastContactLabel",{date:form.lastContact||"—"})}</p></article></div>
   <section className="relationship-card"><p className="eyebrow">{t("leads.commercialInterest")}</p><h3>{displayForm.interest||t("leads.notSpecified")}</h3><p>{displayForm.notes||t("leads.noNotes")}</p></section>
   <section className="partner-insight"><div className="insightMark">N</div><div><p className="eyebrow light">{t("leads.insight")}</p><h3>{form.status==="Perdido"?t("leads.insightLost"):form.status==="Convertido"?t("leads.insightConverted"):t("leads.insightActive")}</h3><p>{displayForm.nextAction?t("leads.recommendedAction",{action:displayForm.nextAction}):t("leads.defineAction")}</p></div></section>
   <footer className="modal-actions">{canEdit&&<><button className="danger-button" onClick={()=>{if(confirm(t("leads.deleteConfirm",{name:form.name}))){onDelete(form.id);onClose();}}}>{t("leads.delete")}</button>{form.status!=="Convertido"&&<button className="secondary-button" onClick={()=>{onConvert(form.id);onClose();}}>{t("leads.convert")}</button>}<button className="primary-action" onClick={()=>onClose("edit",form)}>{t("leads.editLeadLower")}</button></>}</footer>
  </div>}
 </section></div>;
}

export default function LeadsPage({user,leads,onSave,onDelete,onConvert,onNavigate,onLogout}){
 const {t,language}=useLanguage();
 const [search,setSearch]=useState("");const [status,setStatus]=useState("Todos");const [country,setCountry]=useState("Todos");const [source,setSource]=useState("Todas");const [priority,setPriority]=useState("Todas");const [sort,setSort]=useState("created-desc");const [modal,setModal]=useState(null);const canEdit=user.profileKey==="admin";
 const countries=useMemo(()=>[...new Set(leads.map(x=>x.country))].sort(),[leads]);
 const filtered=useMemo(()=>{let list=leads.filter(x=>{const q=search.toLowerCase();const lx=localizeLead(x,language);return(!q||[x.name,x.company,x.email,lx.role,lx.country,lx.interest].some(v=>String(v).toLowerCase().includes(q)))&&(status==="Todos"||x.status===status)&&(country==="Todos"||x.country===country)&&(source==="Todas"||x.source===source)&&(priority==="Todas"||x.priority===priority)});return [...list].sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="last-desc"?String(b.lastContact).localeCompare(String(a.lastContact)):String(b.createdAt).localeCompare(String(a.createdAt)));},[leads,search,status,country,source,priority,sort,language]);
 const counts={all:leads.length,new:leads.filter(x=>x.status==="Novo").length,qualified:leads.filter(x=>x.status==="Qualificado").length,converted:leads.filter(x=>x.status==="Convertido").length,lost:leads.filter(x=>x.status==="Perdido").length};
 function close(action,item){if(action==="edit")setModal({mode:"edit",item});else setModal(null)}
 const statusLabel=x=>t(`leads.statuses.${x}`); const priorityLabel=x=>t(`leads.priorities.${x}`); const sourceLabel=x=>t(`leads.sources.${x}`);
 return <AppLayout user={user} activePage="leads" onNavigate={onNavigate} onLogout={onLogout} title={t("leads.title")}><div className="content leads-content">
  <section className="partners-hero"><div><p className="eyebrow light">{t("leads.intelligence")}</p><h2>{t("leads.management")}</h2><p>{t("leads.description")}</p></div>{canEdit&&<button className="new-partner-button" onClick={()=>setModal({mode:"new",item:EMPTY})}>{t("leads.newLead")}</button>}</section>
  <section className="lead-metrics"><article><span>{t("leads.total")}</span><strong>{counts.all}</strong><small>{t("leads.registered")}</small></article><article className="metric-grey"><span>{t("leads.new")}</span><strong>{counts.new}</strong><small>{t("leads.awaitingContact")}</small></article><article className="metric-blue"><span>{t("leads.qualified")}</span><strong>{counts.qualified}</strong><small>{t("leads.validatedPotential")}</small></article><article className="metric-green"><span>{t("leads.converted")}</span><strong>{counts.converted}</strong><small>{t("leads.becameOpportunity")}</small></article><article className="metric-red"><span>{t("leads.lost")}</span><strong>{counts.lost}</strong><small>{t("leads.notCompleted")}</small></article></section>
  <section className="lead-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("leads.search")}/></label><select value={status} onChange={e=>setStatus(e.target.value)}><option value="Todos">{t("leads.allMale")}</option>{LEAD_STATUSES.map(x=><option key={x} value={x}>{statusLabel(x)}</option>)}</select><select value={country} onChange={e=>setCountry(e.target.value)}><option value="Todos">{t("leads.allMale")}</option>{countries.map(x=><option key={x} value={x}>{localizeLead({country:x},language).country}</option>)}</select><select value={source} onChange={e=>setSource(e.target.value)}><option value="Todas">{t("leads.allFemale")}</option>{LEAD_SOURCES.map(x=><option key={x} value={x}>{sourceLabel(x)}</option>)}</select><select value={priority} onChange={e=>setPriority(e.target.value)}><option value="Todas">{t("leads.allFemale")}</option>{LEAD_PRIORITIES.map(x=><option key={x} value={x}>{priorityLabel(x)}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="created-desc">{t("leads.newest")}</option><option value="name">{t("leads.nameAZ")}</option><option value="last-desc">{t("leads.lastContact")}</option></select></section>
  <section className="partners-table-card"><header><div><p className="eyebrow">{t("leads.prospectingFunnel")}</p><h2>{t(filtered.length===1?"leads.leadCount":"leads.leadsCount",{count:filtered.length})}</h2></div><span className="table-note">{t("leads.colourStates")}</span></header><div className="partners-table-wrap"><table className="partners-table leads-table"><thead><tr><th>ID</th><th>Lead</th><th>{t("leads.company")}</th><th>{t("leads.country")}</th><th>{t("leads.interest")}</th><th>{t("leads.owner")}</th><th>{t("leads.status")}</th><th>{t("leads.priority")}</th><th>{t("leads.nextAction")}</th><th/></tr></thead><tbody>{filtered.map(x=>{const lx=localizeLead(x,language);return <tr key={x.id}><td>#{String(x.id).padStart(3,"0")}</td><td><button className="company-link" onClick={()=>setModal({mode:"view",item:x})}><span className="company-avatar">{x.name.charAt(0)}</span><span><strong>{x.name}</strong><small>{x.email}</small></span></button></td><td><strong>{x.company}</strong><small>{lx.role}</small></td><td><strong>{lx.country}</strong><small>{x.city}</small></td><td>{lx.interest}</td><td>{x.owner}</td><td><span className={`lead-status ${slug(x.status)}`}>{statusLabel(x.status)}</span></td><td><span className={`priority-label ${slug(x.priority)}`}>{priorityLabel(x.priority)}</span></td><td><strong>{lx.nextAction}</strong><small>{x.lastContact?t("leads.lastContactLabel",{date:x.lastContact}):t("leads.noContact")}</small></td><td><div className="row-actions"><button onClick={()=>setModal({mode:"view",item:x})}>{t("leads.view")}</button>{canEdit&&<button onClick={()=>setModal({mode:"edit",item:x})}>{t("leads.edit")}</button>}</div></td></tr>})}</tbody></table></div>{!filtered.length&&<div className="empty-state"><strong>{t("leads.noneFound")}</strong><p>{t("leads.changeFilters")}</p></div>}</section>
 </div>{modal&&<LeadModal item={modal.item} mode={modal.mode} canEdit={canEdit} onSave={onSave} onDelete={onDelete} onConvert={onConvert} onClose={close} t={t} language={language}/>}</AppLayout>;
}
