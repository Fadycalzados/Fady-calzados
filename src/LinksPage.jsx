export default function LinksPage() {
  const links = [
    {
      icon: "🛍️",
      label: "Ver Colección",
      sub: "Zapatos nuevos disponibles",
      href: "https://www.fadycalzados.com",
      bg: "#c9a84c",
      color: "#111",
    },
    {
      icon: "💬",
      label: "Pedir por WhatsApp",
      sub: "Respuesta inmediata · 24h",
      href: "https://wa.me/34681889165?text=Hola%21%20Vi%20vuestros%20zapatos%20en%20Instagram%20y%20me%20gustar%C3%ADa%20pedir%20%F0%9F%91%A0",
      bg: "#25D366",
      color: "#fff",
    },
    {
      icon: "🎥",
      label: "Ver Vídeos de Zapatos",
      sub: "Colección SS25 en vídeo",
      href: "https://www.fadycalzados.com/videos",
      bg: "#111",
      color: "#fff",
      border: "1px solid #c9a84c",
    },
    {
      icon: "📸",
      label: "Seguirnos en Instagram",
      sub: "@fady.calzados",
      href: "https://www.instagram.com/fady.calzados/",
      bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      color: "#fff",
    },
    {
      icon: "👍",
      label: "Seguirnos en Facebook",
      sub: "Fady Calzados",
      href: "https://www.facebook.com/profile.php?id=363905600787667",
      bg: "#1877F2",
      color: "#fff",
    },
    {
      icon: "📦",
      label: "Seguir mi Pedido",
      sub: "Escríbenos y te informamos",
      href: "https://wa.me/34681889165?text=Hola%21%20Quiero%20saber%20el%20estado%20de%20mi%20pedido",
      bg: "#1a1a1a",
      color: "#fff",
      border: "1px solid #333",
    },
    {
      icon: "ℹ️",
      label: "Quiénes Somos",
      sub: "Tres hermanos · Desde 2010",
      href: "https://www.fadycalzados.com/quienes-somos",
      bg: "#1a1a1a",
      color: "#fff",
      border: "1px solid #333",
    },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 0 60px",fontFamily:"Montserrat,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0a0a0a;}
        .lk-btn{display:flex;align-items:center;gap:14px;width:100%;max-width:420px;padding:16px 20px;border-radius:14px;text-decoration:none;transition:transform 0.18s cubic-bezier(0.23,1,0.32,1),box-shadow 0.18s;cursor:pointer;border:none;}
        .lk-btn:active{transform:scale(0.97);}
        @media(hover:hover){.lk-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.45);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .lk-fade{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      {/* Header */}
      <div style={{width:"100%",maxWidth:480,padding:"48px 24px 32px",textAlign:"center"}} className="lk-fade">
        {/* Logo circle */}
        <div style={{width:88,height:88,borderRadius:"50%",background:"linear-gradient(135deg,#c9a84c,#a07830)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 4px 24px rgba(201,168,76,0.35)"}}>
          <div style={{textAlign:"center",lineHeight:1}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:300,color:"#fff",letterSpacing:"0.08em"}}>F</div>
          </div>
        </div>

        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:300,color:"#fff",letterSpacing:"0.45em",marginBottom:4}}>
          FADY
        </div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:8,letterSpacing:"0.7em",color:"#c9a84c",textTransform:"uppercase",marginBottom:14}}>
          CALZADOS
        </div>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>
          Calzado de mujer · Vitoria-Gasteiz<br/>Desde 2010 · Envío a toda España
        </div>
      </div>

      {/* Links */}
      <div style={{width:"100%",maxWidth:420,padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {links.map((lk, i) => (
          <a key={i} href={lk.href} target="_blank" rel="noopener noreferrer"
            className="lk-btn lk-fade"
            style={{background:lk.bg,color:lk.color,border:lk.border||"none",animationDelay:`${0.08*i+0.15}s`}}>
            <span style={{fontSize:22,flexShrink:0}}>{lk.icon}</span>
            <div style={{flex:1,textAlign:"left"}}>
              <div style={{fontFamily:"Montserrat,sans-serif",fontSize:13,fontWeight:600,letterSpacing:"0.02em",lineHeight:1.2}}>{lk.label}</div>
              <div style={{fontFamily:"Montserrat,sans-serif",fontSize:10,opacity:0.7,marginTop:2,letterSpacing:"0.03em"}}>{lk.sub}</div>
            </div>
            <span style={{fontSize:14,opacity:0.6,flexShrink:0}}>›</span>
          </a>
        ))}
      </div>

      {/* Trust badges */}
      <div className="lk-fade" style={{animationDelay:"0.6s",marginTop:36,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center",padding:"0 24px"}}>
        {["📦 Envío gratis +30€","💳 Pago contra reembolso","⭐ +30.000 clientas"].map((b,i)=>(
          <div key={i} style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.08em",textAlign:"center"}}>{b}</div>
        ))}
      </div>

      {/* Footer */}
      <div className="lk-fade" style={{animationDelay:"0.7s",marginTop:40,fontFamily:"Montserrat,sans-serif",fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.12)",textAlign:"center"}}>
        © FADY CALZADOS · VITORIA-GASTEIZ
      </div>
    </div>
  );
}
