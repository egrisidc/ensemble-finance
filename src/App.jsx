import { useState, useMemo } from “react”;

const G = {
bg:”#1a0a0a”, surface:”#221010”, card:”#2a1414”, border:”#4a2020”,
accent:”#c9a84c”, accent2:”#e8c76a”, red:”#e05252”, green:”#52c98a”,
blue:”#5290c9”, text:”#f0e6d3”, muted:”#8a6a5a”, dim:”#4a2a2a”,
};

const SEED_MEMBERS = [
{ id:1, name:“ნინო ჭავჭავაძე”,  role:“მოცეკვავე”,   phone:”+995 598 11 22 33”, joined:“2023-09-01”, monthlyFee:80 },
{ id:2, name:“გიორგი ბარამიძე”, role:“მოცეკვავე”,   phone:”+995 598 22 33 44”, joined:“2023-09-01”, monthlyFee:80 },
{ id:3, name:“მარიამ ელიაური”,  role:“სოლისტი”,     phone:”+995 598 33 44 55”, joined:“2022-01-15”, monthlyFee:100},
{ id:4, name:“დავით კაპანაძე”,  role:“ქორეოგრაფი”, phone:”+995 598 44 55 66”, joined:“2020-06-01”, monthlyFee:0  },
{ id:5, name:“ანა ჯავახიშვილი”, role:“მოცეკვავე”,   phone:”+995 598 55 66 77”, joined:“2024-01-10”, monthlyFee:80 },
{ id:6, name:“ლუკა მჭედლიძე”,  role:“მოცეკვავე”,   phone:”+995 598 66 77 88”, joined:“2023-03-20”, monthlyFee:80 },
];

const SEED_TX = [
{ id:101, date:“2025-01-05”, type:“income”,  category:“საწევრო”,    amount:480,  description:“საწევრო — იანვარი” },
{ id:102, date:“2025-01-20”, type:“income”,  category:“კონცერტი”,   amount:1200, description:“გაზაფხულის კონცერტი — ბილეთები” },
{ id:103, date:“2025-02-05”, type:“income”,  category:“საწევრო”,    amount:320,  description:“საწევრო — თებერვალი (ნაწ.)” },
{ id:104, date:“2025-02-12”, type:“income”,  category:“სპონსორი”,   amount:2000, description:“სს ქართული ღვინო — სპონსორობა” },
{ id:105, date:“2025-03-03”, type:“income”,  category:“საწევრო”,    amount:160,  description:“საწევრო — მარტი (2 წევრი)” },
{ id:106, date:“2025-03-08”, type:“income”,  category:“გრანტი”,     amount:3000, description:“კულტ. სამინისტრო — გრანტი” },
{ id:201, date:“2025-01-10”, type:“expense”, category:“დარბაზი”,    amount:300,  description:“სარეპ. დარბ. — იანვ.” },
{ id:202, date:“2025-01-18”, type:“expense”, category:“კოსტიუმები”, amount:850,  description:“ეროვნ. კოსტიუმები — 5 კომპლ.” },
{ id:203, date:“2025-02-08”, type:“expense”, category:“დარბაზი”,    amount:300,  description:“სარეპ. დარბ. — თებ.” },
{ id:204, date:“2025-02-15”, type:“expense”, category:“ტრანსპ.”,    amount:180,  description:“გასტროლები — ბათუმი” },
{ id:205, date:“2025-03-05”, type:“expense”, category:“დარბაზი”,    amount:300,  description:“სარეპ. დარბ. — მარ.” },
{ id:206, date:“2025-03-07”, type:“expense”, category:“ინვენტარი”,  amount:120,  description:“მუს. ინსტრ. შეძენა” },
];

const SEED_LATE = [
{ id:1, memberId:5, month:“2025-01”, amount:80,  paidDate:null },
{ id:2, memberId:6, month:“2025-01”, amount:80,  paidDate:null },
{ id:3, memberId:5, month:“2025-02”, amount:80,  paidDate:null },
];

const BUDGET0 = {
monthly:700, annual:8000,
categories:{ “დარბაზი”:300,“კოსტიუმები”:500,“ტრანსპ.”:200,“ინვენტარი”:150,“მარკ.”:100,“სხვა”:100 },
};

const INC_CATS = [“საწევრო”,“კონცერტი”,“სპონსორი”,“გრანტი”,“შემოწ.”,“სხვა”];
const EXP_CATS = [“დარბაზი”,“კოსტიუმები”,“ტრანსპ.”,“ინვენტარი”,“მარკ.”,“ხელფასი”,“სხვა”];
const ROLES    = [“მოცეკვავე”,“სოლისტი”,“ქორეოგრაფი”,“მუსიკოსი”,“ადმ.”];

const gel = n => new Intl.NumberFormat(“ka-GE”,{style:“currency”,currency:“GEL”,minimumFractionDigits:2}).format(n||0);
const mLabel = ym => { const [y,m]=ym.split(”-”); return [“იანვ”,“თებ”,“მარ”,“აპრ”,“მაი”,“ივნ”,“ივლ”,“აგვ”,“სექ”,“ოქტ”,“ნოე”,“დეკ”][+m-1]+” “+y; };

/* ─── Shared UI ─────────────────────────────────────────────────── */
const Badge=({c=“accent”,children})=>{
const bg={accent:`${G.accent}22`,green:`${G.green}22`,red:`${G.red}22`,blue:`${G.blue}22`};
const fg={accent:G.accent,green:G.green,red:G.red,blue:G.blue};
return <span style={{display:“inline-block”,padding:“2px 9px”,borderRadius:20,fontSize:11,letterSpacing:1,fontFamily:”‘JetBrains Mono’,monospace”,background:bg[c],color:fg[c],border:`1px solid ${fg[c]}33`}}>{children}</span>;
};
const Card=({children,style})=><div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:12,padding:22,…style}}>{children}</div>;
const Lbl=({children})=><div style={{fontSize:9,color:G.muted,letterSpacing:2.5,marginBottom:6,textTransform:“uppercase”}}>{children}</div>;
const Inp=props=><input {…props} style={{background:G.surface,border:`1px solid ${G.border}`,color:G.text,padding:“10px 14px”,borderRadius:8,fontFamily:“inherit”,fontSize:13,width:“100%”,outline:“none”,…props.style}}/>;
const Sel=({children,…p})=><select {…p} style={{background:G.surface,border:`1px solid ${G.border}`,color:G.text,padding:“10px 14px”,borderRadius:8,fontFamily:“inherit”,fontSize:13,width:“100%”,outline:“none”}}>{children}</select>;
const Btn=({children,variant=“pri”,…p})=>{
const s={pri:{background:G.accent,color:”#1a0a0a”,border:“none”},ghost:{background:“transparent”,color:G.muted,border:`1px solid ${G.border}`},danger:{background:`${G.red}18`,color:G.red,border:`1px solid ${G.red}44`}};
return <button {…p} style={{…s[variant],padding:“9px 18px”,borderRadius:8,cursor:“pointer”,fontFamily:“inherit”,fontSize:13,letterSpacing:.3,transition:“all .15s”,…p.style}}>{children}</button>;
};
const Bar=({value,max,c})=>{
const pct=Math.min((value/max)*100,100);
const col=c||(pct>90?G.red:pct>70?G.accent:G.green);
return <div><div style={{height:6,background:G.dim,borderRadius:3}}><div style={{height:“100%”,width:`${pct}%`,background:col,borderRadius:3,transition:“width .5s”}}/></div><div style={{display:“flex”,justifyContent:“space-between”,marginTop:4}}><span style={{fontSize:10,color:G.muted}}>{pct.toFixed(1)}%</span><span style={{fontSize:10,color:G.muted,fontFamily:”‘JetBrains Mono’,monospace”}}>{gel(value)} / {gel(max)}</span></div></div>;
};
const FRow=({label,children})=><div style={{marginBottom:13}}><Lbl>{label}</Lbl>{children}</div>;

const Modal=({title,onClose,children})=>(

  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(6px)"}} onClick={onClose}>
    <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:16,padding:30,width:"92%",maxWidth:460,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:18,color:G.accent}}>{title}</div>
        <button onClick={onClose} style={{background:"transparent",border:"none",color:G.muted,fontSize:20,cursor:"pointer"}}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

/* ─── Main App ───────────────────────────────────────────────────── */
export default function App() {
const [tab,setTab]         = useState(“dash”);
const [tx,setTx]           = useState(SEED_TX);
const [members,setMembers] = useState(SEED_MEMBERS);
const [late,setLate]       = useState(SEED_LATE);
const [budget,setBudget]   = useState(BUDGET0);
const [modal,setModal]     = useState(null);
const [flt,setFlt]         = useState({type:“all”,cat:“all”,month:“all”});
const [txF,setTxF]         = useState({date:””,type:“income”,category:””,amount:””,description:””});
const [memF,setMemF]       = useState({name:””,role:“მოცეკვავე”,phone:””,joined:””,monthlyFee:“80”});
const [budF,setBudF]       = useState(null);
const [lateF,setLateF]     = useState({memberId:””,month:””,amount:””});
const [note,setNote]       = useState(null);

const toast=(msg,err)=>{ setNote({msg,err}); setTimeout(()=>setNote(null),2800); };

const totalIn  = useMemo(()=>tx.filter(t=>t.type===“income”).reduce((s,t)=>s+t.amount,0),[tx]);
const totalEx  = useMemo(()=>tx.filter(t=>t.type===“expense”).reduce((s,t)=>s+t.amount,0),[tx]);
const balance  = totalIn - totalEx;
const months   = useMemo(()=>[…new Set(tx.map(t=>t.date.slice(0,7)))].sort().reverse(),[tx]);
const allCats  = useMemo(()=>[…new Set(tx.map(t=>t.category))],[tx]);
const unpaid   = late.filter(l=>!l.paidDate);
const lateTotal= unpaid.reduce((s,l)=>s+l.amount,0);
const curMonEx = tx.filter(t=>t.type===“expense”&&t.date.startsWith(“2025-03”)).reduce((s,t)=>s+t.amount,0);

const monthly = useMemo(()=>{
const m={};
tx.forEach(t=>{ const k=t.date.slice(0,7); if(!m[k]) m[k]={income:0,expense:0}; m[k][t.type]+=t.amount; });
return Object.entries(m).sort().map(([mo,d])=>({mo,…d,net:d.income-d.expense}));
},[tx]);

const filtered = useMemo(()=>tx.filter(t=>{
if(flt.type!==“all”&&t.type!==flt.type) return false;
if(flt.cat!==“all”&&t.category!==flt.cat) return false;
if(flt.month!==“all”&&!t.date.startsWith(flt.month)) return false;
return true;
}).sort((a,b)=>b.date.localeCompare(a.date)),[tx,flt]);

const addTx=()=>{
if(!txF.date||!txF.category||!txF.amount||!txF.description) return toast(“შეავსეთ ყველა ველი”,true);
setTx(p=>[…p,{…txF,id:Date.now(),amount:+txF.amount}]);
setTxF({date:””,type:“income”,category:””,amount:””,description:””});
setModal(null); toast(“ტრანზ. დამატ. ✓”);
};
const delTx=id=>{ setTx(p=>p.filter(t=>t.id!==id)); toast(“წაშლილია”,true); };
const addMem=()=>{
if(!memF.name) return toast(“სახელი სავალდ.”,true);
setMembers(p=>[…p,{…memF,id:Date.now(),monthlyFee:+memF.monthlyFee||0}]);
setMemF({name:””,role:“მოცეკვავე”,phone:””,joined:””,monthlyFee:“80”});
setModal(null); toast(“წევრი დამ. ✓”);
};
const delMem=id=>setMembers(p=>p.filter(m=>m.id!==id));
const markPaid=id=>{ setLate(p=>p.map(l=>l.id===id?{…l,paidDate:“2025-03-08”}:l)); toast(“გადახდილ. მოინიშნა ✓”); };
const addLate=()=>{
if(!lateF.memberId||!lateF.month||!lateF.amount) return toast(“შეავსეთ ველები”,true);
setLate(p=>[…p,{…lateF,id:Date.now(),memberId:+lateF.memberId,amount:+lateF.amount,paidDate:null}]);
setLateF({memberId:””,month:””,amount:””}); setModal(null); toast(“ჩ. დამ. ✓”);
};
const saveBud=()=>{ setBudget(budF); setModal(null); toast(“ბიუჯ. შენახ. ✓”); };

const maxBar = Math.max(…monthly.map(d=>Math.max(d.income,d.expense)),1);

/* ── Tabs config ── */
const tabs=[[“dash”,“📊 Dashboard”],[“tx”,“💸 ტრანზ.”],[“members”,“👥 წევრები”],[“late”,“⚠️ ვადაგ.”],[“budget”,“🎯 ბიუჯ.”],[“report”,“📋 ანგარ.”]];

return (
<div style={{fontFamily:”‘Noto Serif Georgian’,‘Georgia’,serif”,minHeight:“100vh”,background:G.bg,color:G.text}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Georgian:wght@300;400;600&family=JetBrains+Mono:wght@300;400&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${G.accent}55;border-radius:2px}select option{background:${G.surface}}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.fi{animation:fi .28s ease}button:hover{opacity:.88}`}</style>

```
  {/* Toast */}
  {note&&<div style={{position:"fixed",top:18,right:18,zIndex:300,background:note.err?G.red:G.green,color:"#fff",padding:"9px 18px",borderRadius:8,fontSize:13,boxShadow:"0 4px 20px #0006"}}>{note.msg}</div>}

  {/* Header */}
  <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,padding:"14px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:26}}>🕺</span>
      <div>
        <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:18,fontWeight:600,color:G.accent,letterSpacing:1}}>ქართული ანსამბლი</div>
        <div style={{fontSize:9,letterSpacing:3.5,color:G.muted,textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>ფინანსების მართვა</div>
      </div>
    </div>
    <div style={{textAlign:"right"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,color:balance>=0?G.green:G.red,fontWeight:300}}>{gel(balance)}</div>
      <div style={{fontSize:9,letterSpacing:3,color:G.muted,marginTop:1}}>ბალანსი</div>
    </div>
  </div>

  {/* Tab bar */}
  <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,padding:"0 26px",display:"flex",overflowX:"auto"}}>
    {tabs.map(([k,l])=>(
      <button key={k} onClick={()=>setTab(k)} style={{padding:"11px 16px",background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:tab===k?G.accent:G.muted,borderBottom:`2px solid ${tab===k?G.accent:"transparent"}`,whiteSpace:"nowrap",transition:"color .2s",letterSpacing:.3}}>
        {l}{k==="late"&&unpaid.length>0&&<span style={{marginLeft:5,background:G.red,color:"#fff",borderRadius:20,fontSize:9,padding:"1px 5px"}}>{unpaid.length}</span>}
      </button>
    ))}
  </div>

  {/* Content */}
  <div style={{padding:"24px 26px",maxWidth:1160,margin:"0 auto"}} className="fi" key={tab}>

    {/* ══ DASHBOARD ══ */}
    {tab==="dash"&&<div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {[[gel(totalIn),"შემოსავ.",G.green,`${tx.filter(t=>t.type==="income").length} ჩ.`],[gel(totalEx),"ხარჯი",G.red,`${tx.filter(t=>t.type==="expense").length} ჩ.`],[gel(balance),"ბალანსი",balance>=0?G.accent:G.red],[gel(lateTotal),"ვადაგ. ვალდ.",unpaid.length?G.red:G.muted,`${unpaid.length} ჩ.`],[members.length,"წევრები",G.blue]].map(([v,l,c,s])=>(
          <div key={l} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:12,padding:"18px 20px",flex:1,minWidth:130}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,color:c,fontWeight:300}}>{v}</div>
            <div style={{fontSize:9,letterSpacing:2.5,color:G.muted,marginTop:7,textTransform:"uppercase"}}>{l}</div>
            {s&&<div style={{fontSize:10,color:G.dim,marginTop:3}}>{s}</div>}
          </div>
        ))}
      </div>

      <Card>
        <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:16,color:G.accent,marginBottom:18}}>თვიური მიმოხილვა</div>
        <div style={{display:"flex",gap:14,alignItems:"flex-end",height:150,overflowX:"auto",paddingBottom:6}}>
          {monthly.map(({mo,income,expense})=>(
            <div key={mo} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:64}}>
              <div style={{display:"flex",gap:4,alignItems:"flex-end",height:128}}>
                <div title={gel(income)}  style={{width:20,borderRadius:"3px 3px 0 0",background:G.green,opacity:.85,height:`${(income/maxBar)*122+2}px`,transition:"height .4s"}}/>
                <div title={gel(expense)} style={{width:20,borderRadius:"3px 3px 0 0",background:G.red,  opacity:.85,height:`${(expense/maxBar)*122+2}px`,transition:"height .4s"}}/>
              </div>
              <div style={{fontSize:9,color:G.muted,fontFamily:"'JetBrains Mono',monospace"}}>{mLabel(mo).slice(0,3)}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginTop:10}}>
          {[[G.green,"შემოსავ."],[G.red,"ხარჯი"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:G.muted}}><div style={{width:10,height:10,background:c,borderRadius:2}}/>{l}</div>)}
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:16,color:G.accent}}>ბიუჯეტის კონტროლი</div>
          <Btn variant="ghost" onClick={()=>{setBudF(JSON.parse(JSON.stringify(budget)));setModal("bud");}} style={{fontSize:11,padding:"5px 12px"}}>✎ შეცვ.</Btn>
        </div>
        <div style={{marginBottom:14}}><div style={{fontSize:12,color:G.muted,marginBottom:7}}>ყოველთვ. ხარჯი</div><Bar value={curMonEx} max={budget.monthly}/></div>
        <div><div style={{fontSize:12,color:G.muted,marginBottom:7}}>წლიური ხარჯი</div><Bar value={totalEx} max={budget.annual}/></div>
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:16,color:G.accent}}>ბოლო ტრანზ.</div>
          <Btn variant="ghost" onClick={()=>setTab("tx")} style={{fontSize:11,padding:"5px 12px"}}>ყველა →</Btn>
        </div>
        {tx.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(t=>(
          <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${G.dim}`}}>
            <div style={{display:"flex",gap:11,alignItems:"center"}}>
              <div style={{width:34,height:34,borderRadius:8,background:t.type==="income"?`${G.green}18`:`${G.red}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:t.type==="income"?G.green:G.red}}>{t.type==="income"?"↑":"↓"}</div>
              <div>
                <div style={{fontSize:13}}>{t.description}</div>
                <div style={{fontSize:10,color:G.muted,marginTop:2}}>{t.date} · {t.category}</div>
              </div>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",color:t.type==="income"?G.green:G.red,fontSize:14}}>{t.type==="income"?"+":"-"}{gel(t.amount)}</div>
          </div>
        ))}
      </Card>
    </div>}

    {/* ══ TRANSACTIONS ══ */}
    {tab==="tx"&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:20,color:G.accent}}>ტრანზაქციები</h2>
        <Btn onClick={()=>setModal("tx")}>+ ახალი ტრანზ.</Btn>
      </div>
      <Card style={{padding:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{k:"type",opts:[["all","ყველა ტიპი"],["income","შემოს."],["expense","ხარჯი"]]},{k:"cat",opts:[["all","ყველა კატ."],...allCats.map(c=>[c,c])]},{k:"month",opts:[["all","ყველა თვე"],...months.map(m=>[m,mLabel(m)])]}].map(({k,opts})=>(
            <div key={k} style={{flex:1,minWidth:140}}>
              <Sel value={flt[k]} onChange={e=>setFlt(f=>({...f,[k]:e.target.value}))}>
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </Sel>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:G.surface,borderBottom:`1px solid ${G.border}`}}>
              {["თარ.","კატ.","აღწ.","ტიპი","თანხა",""].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:9,letterSpacing:2,color:G.muted,fontWeight:400,textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((t,i)=>(
                <tr key={t.id} style={{borderBottom:`1px solid ${G.dim}`,background:i%2?`${G.surface}44`:"transparent"}}>
                  <td style={{padding:"12px 16px",color:G.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:11,whiteSpace:"nowrap"}}>{t.date}</td>
                  <td style={{padding:"12px 16px"}}><Badge c="accent">{t.category}</Badge></td>
                  <td style={{padding:"12px 16px",color:"#ddd",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description}</td>
                  <td style={{padding:"12px 16px"}}><Badge c={t.type==="income"?"green":"red"}>{t.type==="income"?"შემ.":"ხარ."}</Badge></td>
                  <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:t.type==="income"?G.green:G.red,whiteSpace:"nowrap"}}>{t.type==="income"?"+":"-"}{gel(t.amount)}</td>
                  <td style={{padding:"12px 16px"}}><button onClick={()=>delTx(t.id)} style={{background:"transparent",border:"none",color:G.dim,cursor:"pointer",fontSize:15}}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length&&<div style={{padding:36,textAlign:"center",color:G.muted,fontStyle:"italic"}}>ჩანაწ. ვერ მოიძ.</div>}
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${G.border}`,display:"flex",justifyContent:"space-between",background:G.surface,flexWrap:"wrap",gap:6}}>
          <div style={{fontSize:11,color:G.muted}}>{filtered.length} ჩ.</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>სულ: <span style={{color:(filtered.reduce((s,t)=>s+(t.type==="income"?t.amount:-t.amount),0)>=0?G.green:G.red)}}>{gel(filtered.reduce((s,t)=>s+(t.type==="income"?t.amount:-t.amount),0))}</span></div>
        </div>
      </Card>
    </div>}

    {/* ══ MEMBERS ══ */}
    {tab==="members"&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:20,color:G.accent}}>ანსამბლის წევრები</h2>
        <Btn onClick={()=>setModal("mem")}>+ ახალი წევრი</Btn>
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {members.map(m=>{
          const ov=late.filter(l=>l.memberId===m.id&&!l.paidDate);
          return (
            <div key={m.id} style={{background:G.card,border:`1px solid ${ov.length?G.red:G.border}`,borderRadius:12,padding:18,flex:1,minWidth:210,position:"relative"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${G.accent},#7a4e2d)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#1a0a0a",fontWeight:700,marginBottom:11}}>{m.name.charAt(0)}</div>
              <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:15,marginBottom:2}}>{m.name}</div>
              <div style={{fontSize:10,color:G.accent,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{m.role}</div>
              {m.phone&&<div style={{fontSize:11,color:G.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{m.phone}</div>}
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:8}}>
                <Badge c="blue">{gel(m.monthlyFee)}/თვ.</Badge>
                {ov.length>0&&<Badge c="red">⚠ {ov.length} ვადაგ.</Badge>}
              </div>
              <button onClick={()=>delMem(m.id)} style={{position:"absolute",top:14,right:14,background:"transparent",border:"none",color:G.dim,cursor:"pointer",fontSize:15}}>✕</button>
            </div>
          );
        })}
      </div>
    </div>}

    {/* ══ LATE ══ */}
    {tab==="late"&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:20,color:G.accent}}>ვადაგასული გადასახდელები</h2>
        <Btn onClick={()=>setModal("late")}>+ დამატება</Btn>
      </div>
      {!unpaid.length&&<div style={{background:G.card,border:`1px solid ${G.green}44`,borderRadius:12,padding:36,textAlign:"center",color:G.green}}>✓ ვადაგ. გადასახ. არ არის!</div>}
      {!!unpaid.length&&<Card style={{padding:0,overflow:"hidden"}}>
        <div style={{background:`${G.red}11`,borderBottom:`1px solid ${G.red}33`,padding:"12px 18px",display:"flex",justifyContent:"space-between"}}>
          <div style={{color:G.red,fontSize:13}}>სულ: <strong style={{fontFamily:"'JetBrains Mono',monospace"}}>{gel(lateTotal)}</strong></div>
          <div style={{fontSize:11,color:G.muted}}>{unpaid.length} ჩ.</div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:G.surface}}>{["წევრი","თვე","თანხა","სტ.",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:9,letterSpacing:2,color:G.muted,fontWeight:400,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>
            {unpaid.map(l=>{
              const mem=members.find(m=>m.id===l.memberId);
              return <tr key={l.id} style={{borderBottom:`1px solid ${G.dim}`}}>
                <td style={{padding:"12px 16px"}}>{mem?.name||"—"}</td>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.muted,fontSize:12}}>{mLabel(l.month)}</td>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.red}}>{gel(l.amount)}</td>
                <td style={{padding:"12px 16px"}}><Badge c="red">⚠ გად.</Badge></td>
                <td style={{padding:"12px 16px"}}><Btn variant="ghost" onClick={()=>markPaid(l.id)} style={{fontSize:11,padding:"4px 11px"}}>✓ გადახდ.</Btn></td>
              </tr>;
            })}
          </tbody>
        </table>
      </Card>}
      {late.filter(l=>l.paidDate).length>0&&<Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${G.border}`,fontSize:13,color:G.muted}}>გადახდის ისტ.</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <tbody>{late.filter(l=>l.paidDate).map(l=>{
            const mem=members.find(m=>m.id===l.memberId);
            return <tr key={l.id} style={{borderBottom:`1px solid ${G.dim}`}}>
              <td style={{padding:"11px 16px"}}>{mem?.name||"—"}</td>
              <td style={{padding:"11px 16px",color:G.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{mLabel(l.month)}</td>
              <td style={{padding:"11px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.green}}>{gel(l.amount)}</td>
              <td style={{padding:"11px 16px"}}><Badge c="green">✓ {l.paidDate}</Badge></td>
            </tr>;
          })}</tbody>
        </table>
      </Card>}
    </div>}

    {/* ══ BUDGET ══ */}
    {tab==="budget"&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:20,color:G.accent}}>ბიუჯეტის გეგმა</h2>
        <Btn onClick={()=>{setBudF(JSON.parse(JSON.stringify(budget)));setModal("bud");}}>✎ რედ.</Btn>
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {[[gel(budget.monthly),"თვ. ლიმ.",G.accent],[gel(budget.annual),"წლ. ლიმ.",G.blue],[gel(curMonEx),"თვ. ხარჯი",curMonEx>budget.monthly?G.red:G.green],[gel(budget.monthly-curMonEx),"დარჩ.",budget.monthly-curMonEx>=0?G.green:G.red]].map(([v,l,c])=>(
          <div key={l} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:12,padding:"18px 20px",flex:1,minWidth:130}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color:c,fontWeight:300}}>{v}</div>
            <div style={{fontSize:9,letterSpacing:2.5,color:G.muted,marginTop:7,textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>
      <Card><div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:15,color:G.accent,marginBottom:16}}>ყოველთვ. ლიმ.</div><Bar value={curMonEx} max={budget.monthly}/></Card>
      <Card>
        <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:15,color:G.accent,marginBottom:18}}>კატეგ. ბიუჯეტი</div>
        {Object.entries(budget.categories).map(([cat,lim])=>{
          const spent=tx.filter(t=>t.type==="expense"&&t.category===cat).reduce((s,t)=>s+t.amount,0);
          return <div key={cat} style={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13}}>{cat}</span><Badge c={spent>lim?"red":"green"}>{spent>lim?"გადამეტ.":"OK"}</Badge></div>
            <Bar value={spent} max={lim}/>
          </div>;
        })}
      </Card>
    </div>}

    {/* ══ REPORT ══ */}
    {tab==="report"&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
      <h2 style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:20,color:G.accent}}>ფინანსური ანგარიში</h2>
      <div style={{background:`linear-gradient(135deg,${G.card},${G.surface})`,border:`1px solid ${G.accent}44`,borderRadius:12,padding:26}}>
        <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:16,color:G.accent,marginBottom:18}}>✦ ზოგადი შეჯამება</div>
        <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
          {[[gel(totalIn),"შემ.",G.green],[gel(totalEx),"ხარ.",G.red],[gel(balance),"ბალ.",balance>=0?G.accent:G.red],[totalIn>0?((balance/totalIn)*100).toFixed(1)+"%":"—","მარჟა",G.blue],[tx.length,"ტრანზ.",G.muted],[gel(lateTotal),"ვადაგ.",unpaid.length?G.red:G.muted]].map(([v,l,c])=>(
            <div key={l} style={{flex:1,minWidth:110,textAlign:"center"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:17,color:c}}>{v}</div>
              <div style={{fontSize:9,color:G.muted,letterSpacing:2,marginTop:5,textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        {[{title:"შემოსავ. კატ.",cats:INC_CATS,type:"income",color:G.green},{title:"ხარჯ. კატ.",cats:EXP_CATS,type:"expense",color:G.red}].map(({title,cats,type,color})=>{
          const tot=tx.filter(t=>t.type===type).reduce((s,t)=>s+t.amount,0);
          return <Card key={type} style={{flex:1,minWidth:250}}>
            <div style={{fontFamily:"'Noto Serif Georgian',serif",fontSize:15,color:G.accent,marginBottom:14}}>{title}</div>
            {cats.map(cat=>{
              const v=tx.filter(t=>t.category===cat&&t.type===type).reduce((s,t)=>s+t.amount,0);
              if(!v) return null;
              const p=(v/tot*100).toFixed(1);
              return <div key={cat} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#ddd"}}>{cat}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color}}>{gel(v)} <span style={{color:G.muted}}>({p}%)</span></span></div>
                <div style={{height:3,background:G.dim,borderRadius:2}}><div style={{height:"100%",width:`${p}%`,background:color,opacity:.7,borderRadius:2}}/></div>
              </div>;
            })}
            <div style={{borderTop:`1px solid ${G.border}`,paddingTop:10,marginTop:6,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:G.text}}>სულ</span><span style={{fontFamily:"'JetBrains Mono',monospace",color,fontSize:14}}>{gel(tot)}</span></div>
          </Card>;
        })}
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${G.border}`,fontFamily:"'Noto Serif Georgian',serif",fontSize:15,color:G.accent}}>თვიური ჩაშლა</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:G.surface}}>{["თვე","შემ.","ხარ.","სალდო","ტრ."].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:9,letterSpacing:2,color:G.muted,fontWeight:400,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{monthly.map(({mo,income,expense,net})=>(
              <tr key={mo} style={{borderBottom:`1px solid ${G.dim}`}}>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.muted,fontSize:12}}>{mLabel(mo)}</td>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.green}}>{gel(income)}</td>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:G.red}}>{gel(expense)}</td>
                <td style={{padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",color:net>=0?G.accent:G.red,fontWeight:600}}>{net>=0?"+":""}{gel(net)}</td>
                <td style={{padding:"12px 16px",fontSize:16}}>{net>500?"📈":net>0?"📊":net===0?"➡️":"📉"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>}
  </div>

  {/* ══ MODAL: Add Transaction ══ */}
  {modal==="tx"&&<Modal title="ახალი ტრანზ." onClose={()=>setModal(null)}>
    <FRow label="თარიღი"><Inp type="date" value={txF.date} onChange={e=>setTxF(f=>({...f,date:e.target.value}))}/></FRow>
    <FRow label="ტიპი"><Sel value={txF.type} onChange={e=>setTxF(f=>({...f,type:e.target.value,category:""}))}>
      <option value="income">შემოსავალი</option><option value="expense">ხარჯი</option>
    </Sel></FRow>
    <FRow label="კატეგ."><Sel value={txF.category} onChange={e=>setTxF(f=>({...f,category:e.target.value}))}>
      <option value="">— აირჩ. —</option>{(txF.type==="income"?INC_CATS:EXP_CATS).map(c=><option key={c} value={c}>{c}</option>)}
    </Sel></FRow>
    <FRow label="თანხა (₾)"><Inp type="number" placeholder="0.00" value={txF.amount} onChange={e=>setTxF(f=>({...f,amount:e.target.value}))}/></FRow>
    <FRow label="აღწ."><Inp type="text" placeholder="დეტ..." value={txF.description} onChange={e=>setTxF(f=>({...f,description:e.target.value}))}/></FRow>
    <div style={{display:"flex",gap:10,marginTop:18}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>გაუქ.</Btn><Btn onClick={addTx} style={{flex:2}}>დამ.</Btn></div>
  </Modal>}

  {/* ══ MODAL: Add Member ══ */}
  {modal==="mem"&&<Modal title="ახ. წევრი" onClose={()=>setModal(null)}>
    <FRow label="სახ. გვარი"><Inp type="text" placeholder="ნ. ჩახავა" value={memF.name} onChange={e=>setMemF(f=>({...f,name:e.target.value}))}/></FRow>
    <FRow label="როლი"><Sel value={memF.role} onChange={e=>setMemF(f=>({...f,role:e.target.value}))}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</Sel></FRow>
    <FRow label="ტელ."><Inp type="tel" placeholder="+995 598 ..." value={memF.phone} onChange={e=>setMemF(f=>({...f,phone:e.target.value}))}/></FRow>
    <FRow label="გაწ. თარ."><Inp type="date" value={memF.joined} onChange={e=>setMemF(f=>({...f,joined:e.target.value}))}/></FRow>
    <FRow label="თვ. გადასახ. (₾)"><Inp type="number" value={memF.monthlyFee} onChange={e=>setMemF(f=>({...f,monthlyFee:e.target.value}))}/></FRow>
    <div style={{display:"flex",gap:10,marginTop:18}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>გაუქ.</Btn><Btn onClick={addMem} style={{flex:2}}>დამ.</Btn></div>
  </Modal>}

  {/* ══ MODAL: Add Late ══ */}
  {modal==="late"&&<Modal title="ვადაგ. ჩ." onClose={()=>setModal(null)}>
    <FRow label="წევრი"><Sel value={lateF.memberId} onChange={e=>setLateF(f=>({...f,memberId:e.target.value}))}>
      <option value="">— აირჩ. —</option>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
    </Sel></FRow>
    <FRow label="თვე"><input type="month" value={lateF.month} onChange={e=>setLateF(f=>({...f,month:e.target.value}))} style={{background:G.surface,border:`1px solid ${G.border}`,color:G.text,padding:"10px 14px",borderRadius:8,fontFamily:"inherit",fontSize:13,width:"100%",outline:"none"}}/></FRow>
    <FRow label="თანხა (₾)"><Inp type="number" placeholder="80" value={lateF.amount} onChange={e=>setLateF(f=>({...f,amount:e.target.value}))}/></FRow>
    <div style={{display:"flex",gap:10,marginTop:18}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>გაუქ.</Btn><Btn onClick={addLate} style={{flex:2}}>დამ.</Btn></div>
  </Modal>}

  {/* ══ MODAL: Edit Budget ══ */}
  {modal==="bud"&&budF&&<Modal title="ბიუჯ. რედ." onClose={()=>setModal(null)}>
    <FRow label="თვ. ლიმ. (₾)"><Inp type="number" value={budF.monthly} onChange={e=>setBudF(f=>({...f,monthly:+e.target.value}))}/></FRow>
    <FRow label="წლ. ლიმ. (₾)"><Inp type="number" value={budF.annual} onChange={e=>setBudF(f=>({...f,annual:+e.target.value}))}/></FRow>
    <div style={{borderTop:`1px solid ${G.border}`,marginTop:14,paddingTop:14}}>
      <div style={{fontSize:11,color:G.muted,marginBottom:10,letterSpacing:1}}>კატეგ. ლიმ.</div>
      {Object.entries(budF.categories).map(([cat,lim])=>(
        <div key={cat} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
          <span style={{flex:1,fontSize:12}}>{cat}</span>
          <Inp type="number" value={lim} onChange={e=>setBudF(f=>({...f,categories:{...f.categories,[cat]:+e.target.value}}))} style={{flex:1}}/>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:10,marginTop:18}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>გაუქ.</Btn><Btn onClick={saveBud} style={{flex:2}}>შენახ.</Btn></div>
  </Modal>}
</div>
```

);
}
