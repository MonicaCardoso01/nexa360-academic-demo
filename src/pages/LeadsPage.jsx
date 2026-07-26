import React,{useMemo,useState} from "react";
import AppLayout from "../layouts/AppLayout.jsx";
import {LEAD_PRIORITIES,LEAD_SOURCES,LEAD_STATUSES} from "../data/leads.js";

const EMPTY={name:"",company:"",role:"",email:"",phone:"",country:"Portugal",city:"",source:"Website",interest:"",status:"Novo",priority:"Média",owner:"Mónica Cardoso",createdAt:new Date().toISOString().slice(0,10),lastContact:"",nextAction:"",notes:""};
const slug=(v)=>v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replaceAll(" ","-");

function LeadModal({item,mode,onClose,onSave,onDelete,onConvert,canEdit}){
 const [form,setForm]=useState(item||EMPTY); const editing=mode!=="view";
 const set=(k,v)=>setForm(x=>({...x,[k]:v}));
 function submit(e){e.preventDefault();if(!form.name.trim())return alert("Por favor, indique o nome.");if(!form.company.trim())return alert("Por favor, indique a empresa.");if(!form.email.trim()&&!form.phone.trim())return alert("Indique pelo menos um email ou telefone.");if(form.email&&!/^\S+@\S+\.\S+$/.test(form.email))return alert("Por favor, indique um email válido.");onSave(form);onClose();}
 return <div className="modal-backdrop"><section className="partner-modal lead-modal">
  <header className="modal-header"><div><p className="eyebrow">{editing?"Gestão de leads":"Lead 360°"}</p><h2>{mode==="new"?"Novo Lead":mode==="edit"?"Editar Lead":form.name}</h2></div><button className="close-button" onClick={()=>onClose()}>×</button></header>
  {editing?<form className="partner-form" onSubmit={submit}>
   <div className="form-section"><h3>1. Dados pessoais e empresa</h3><div className="form-grid">
    <label><span>Nome completo *</span><input value={form.name} onChange={e=>set("name",e.target.value)}/></label>
    <label><span>Empresa *</span><input value={form.company} onChange={e=>set("company",e.target.value)}/></label>
    <label><span>Cargo</span><input value={form.role} onChange={e=>set("role",e.target.value)}/></label>
    <label><span>Responsável comercial *</span><input value={form.owner} onChange={e=>set("owner",e.target.value)}/></label>
   </div></div>
   <div className="form-section"><h3>2. Informações de contacto</h3><div className="form-grid">
    <label><span>Email</span><input type="email" value={form.email} onChange={e=>set("email",e.target.value)}/></label>
    <label><span>Telefone</span><input value={form.phone} onChange={e=>set("phone",e.target.value)}/></label>
    <label><span>País</span><input value={form.country} onChange={e=>set("country",e.target.value)}/></label>
    <label><span>Cidade</span><input value={form.city} onChange={e=>set("city",e.target.value)}/></label>
   </div></div>
   <div className="form-section"><h3>3. Interesse, origem e classificação</h3><div className="form-grid">
    <label><span>Produto ou serviço de interesse</span><input value={form.interest} onChange={e=>set("interest",e.target.value)}/></label>
    <label><span>Origem</span><select value={form.source} onChange={e=>set("source",e.target.value)}>{LEAD_SOURCES.map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span>Estado *</span><select value={form.status} onChange={e=>set("status",e.target.value)}>{LEAD_STATUSES.map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span>Prioridade</span><select value={form.priority} onChange={e=>set("priority",e.target.value)}>{LEAD_PRIORITIES.map(x=><option key={x}>{x}</option>)}</select></label>
   </div></div>
   <div className="form-section"><h3>4. Acompanhamento e observações</h3><div className="form-grid">
    <label><span>Data de criação</span><input type="date" value={form.createdAt} onChange={e=>set("createdAt",e.target.value)}/></label>
    <label><span>Último contacto</span><input type="date" value={form.lastContact} onChange={e=>set("lastContact",e.target.value)}/></label>
   </div><label><span>Próxima ação</span><input value={form.nextAction} onChange={e=>set("nextAction",e.target.value)}/></label><label><span>Observações</span><textarea rows="4" value={form.notes} onChange={e=>set("notes",e.target.value)}/></label></div>
   <footer className="modal-actions"><button type="button" className="secondary-button" onClick={()=>onClose()}>Cancelar</button><button className="primary-action">Guardar lead</button></footer>
  </form>:<div className="partner-detail">
   <section className="detail-hero"><div><span className={`lead-status ${slug(form.status)}`}>{form.status}</span><p>{form.company} • {form.role||"Cargo não indicado"}</p></div><strong>{form.priority}</strong></section>
   <div className="detail-grid"><article><span>Contacto</span><strong>{form.email||"Sem email"}</strong><p>{form.phone||"Sem telefone"}</p></article><article><span>Localização</span><strong>{form.city||"—"}</strong><p>{form.country}</p></article><article><span>Responsável</span><strong>{form.owner}</strong><p>Origem: {form.source}</p></article><article><span>Próxima ação</span><strong>{form.nextAction||"Não definida"}</strong><p>Último contacto: {form.lastContact||"—"}</p></article></div>
   <section className="relationship-card"><p className="eyebrow">Interesse comercial</p><h3>{form.interest||"Ainda não especificado"}</h3><p>{form.notes||"Ainda não existem observações."}</p></section>
   <section className="partner-insight"><div className="insightMark">N</div><div><p className="eyebrow light">Insight NEXA360</p><h3>{form.status==="Perdido"?"Esta relação poderá ser retomada no momento certo.":form.status==="Convertido"?"Este lead já está preparado para integrar as oportunidades.":"Existe uma oportunidade concreta para avançar esta relação."}</h3><p>{form.nextAction?`Próxima ação recomendada: ${form.nextAction}.`:"Defina uma próxima ação para preservar o ritmo comercial."}</p></div></section>
   <footer className="modal-actions">{canEdit&&<><button className="danger-button" onClick={()=>{if(confirm(`Eliminar ${form.name}?`)){onDelete(form.id);onClose();}}}>Eliminar</button>{form.status!=="Convertido"&&<button className="secondary-button" onClick={()=>{onConvert(form.id);onClose();}}>Converter em oportunidade</button>}<button className="primary-action" onClick={()=>onClose("edit",form)}>Editar lead</button></>}</footer>
  </div>}
 </section></div>;
}

export default function LeadsPage({user,leads,onSave,onDelete,onConvert,onNavigate,onLogout}){
 const [search,setSearch]=useState("");const [status,setStatus]=useState("Todos");const [country,setCountry]=useState("Todos");const [source,setSource]=useState("Todas");const [priority,setPriority]=useState("Todas");const [sort,setSort]=useState("created-desc");const [modal,setModal]=useState(null);const canEdit=user.profileKey==="admin";
 const countries=useMemo(()=>[...new Set(leads.map(x=>x.country))].sort(),[leads]);
 const filtered=useMemo(()=>{let list=leads.filter(x=>{const q=search.toLowerCase();return(!q||[x.name,x.company,x.email].some(v=>String(v).toLowerCase().includes(q)))&&(status==="Todos"||x.status===status)&&(country==="Todos"||x.country===country)&&(source==="Todas"||x.source===source)&&(priority==="Todas"||x.priority===priority)});return [...list].sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="last-desc"?String(b.lastContact).localeCompare(String(a.lastContact)):String(b.createdAt).localeCompare(String(a.createdAt)));},[leads,search,status,country,source,priority,sort]);
 const counts={all:leads.length,new:leads.filter(x=>x.status==="Novo").length,qualified:leads.filter(x=>x.status==="Qualificado").length,converted:leads.filter(x=>x.status==="Convertido").length,lost:leads.filter(x=>x.status==="Perdido").length};
 function close(action,item){if(action==="edit")setModal({mode:"edit",item});else setModal(null)}
 return <AppLayout user={user} activePage="leads" onNavigate={onNavigate} onLogout={onLogout} title="Leads"><div className="content leads-content">
  <section className="partners-hero"><div><p className="eyebrow light">Inteligência comercial</p><h2>Gestão de Leads</h2><p>Organize potenciais clientes, acompanhe cada contacto e transforme relações em oportunidades reais.</p></div>{canEdit&&<button className="new-partner-button" onClick={()=>setModal({mode:"new",item:EMPTY})}>+ Novo Lead</button>}</section>
  <section className="lead-metrics"><article><span>Total</span><strong>{counts.all}</strong><small>leads registados</small></article><article className="metric-grey"><span>Novos</span><strong>{counts.new}</strong><small>aguardam contacto</small></article><article className="metric-blue"><span>Qualificados</span><strong>{counts.qualified}</strong><small>potencial validado</small></article><article className="metric-green"><span>Convertidos</span><strong>{counts.converted}</strong><small>viraram oportunidade</small></article><article className="metric-red"><span>Perdidos</span><strong>{counts.lost}</strong><small>não concretizados</small></article></section>
  <section className="lead-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar por nome, empresa ou email..."/></label><select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option>{LEAD_STATUSES.map(x=><option key={x}>{x}</option>)}</select><select value={country} onChange={e=>setCountry(e.target.value)}><option>Todos</option>{countries.map(x=><option key={x}>{x}</option>)}</select><select value={source} onChange={e=>setSource(e.target.value)}><option>Todas</option>{LEAD_SOURCES.map(x=><option key={x}>{x}</option>)}</select><select value={priority} onChange={e=>setPriority(e.target.value)}><option>Todas</option>{LEAD_PRIORITIES.map(x=><option key={x}>{x}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="created-desc">Mais recentes</option><option value="name">Nome A–Z</option><option value="last-desc">Último contacto</option></select></section>
  <section className="partners-table-card"><header><div><p className="eyebrow">Funil de prospeção</p><h2>{filtered.length} lead{filtered.length===1?"":"s"}</h2></div><span className="table-note">Estados identificados por etiquetas coloridas</span></header><div className="partners-table-wrap"><table className="partners-table leads-table"><thead><tr><th>ID</th><th>Lead</th><th>Empresa</th><th>País</th><th>Interesse</th><th>Responsável</th><th>Estado</th><th>Prioridade</th><th>Próxima ação</th><th/></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td>#{String(x.id).padStart(3,"0")}</td><td><button className="company-link" onClick={()=>setModal({mode:"view",item:x})}><span className="company-avatar">{x.name.charAt(0)}</span><span><strong>{x.name}</strong><small>{x.email}</small></span></button></td><td><strong>{x.company}</strong><small>{x.role}</small></td><td><strong>{x.country}</strong><small>{x.city}</small></td><td>{x.interest}</td><td>{x.owner}</td><td><span className={`lead-status ${slug(x.status)}`}>{x.status}</span></td><td><span className={`priority-label ${slug(x.priority)}`}>{x.priority}</span></td><td><strong>{x.nextAction}</strong><small>{x.lastContact?`Último contacto: ${x.lastContact}`:"Sem contacto"}</small></td><td><div className="row-actions"><button onClick={()=>setModal({mode:"view",item:x})}>Ver</button>{canEdit&&<button onClick={()=>setModal({mode:"edit",item:x})}>Editar</button>}</div></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="empty-state"><strong>Nenhum lead encontrado.</strong><p>Altere a pesquisa ou os filtros.</p></div>}</section>
 </div>{modal&&<LeadModal item={modal.item} mode={modal.mode} canEdit={canEdit} onSave={onSave} onDelete={onDelete} onConvert={onConvert} onClose={close}/>}</AppLayout>;
}
