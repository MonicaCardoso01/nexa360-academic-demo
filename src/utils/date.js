export function greeting(){const h=new Date().getHours();return h<12?"Bom dia":h<19?"Boa tarde":"Boa noite";}
export function today(){return new Intl.DateTimeFormat("pt-PT",{day:"2-digit",month:"long",year:"numeric"}).format(new Date());}
