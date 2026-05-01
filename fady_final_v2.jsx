import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const HEEL = null;
const WA_NUM = "34611243978";
const SHOPIFY_DOMAIN = "gfg8hj-yd.myshopify.com";
const SHOPIFY_TOKEN = "6defb920c830f6d263705aa0bcb6a074";
const SHOPIFY_URL = "https://" + SHOPIFY_DOMAIN + "/api/2024-01/graphql.json";

// Fetch products from Shopify
const fetchShopifyProducts = async () => {
  const query = "{products(first:60){edges{node{id title handle tags variants(first:20){edges{node{id title price{amount}availableForSale}}}images(first:4){edges{node{url}}}}}}}";
  const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  return data.data.products.edges.map(e => {
    const node = e.node;
    const price = node.variants.edges[0]
      ? parseFloat(node.variants.edges[0].node.price.amount).toFixed(2).replace(".",",")
      : "16,99";
    const images = node.images.edges.map(i => i.node.url);
    const sizes = node.variants.edges
      .filter(v => v.node.availableForSale)
      .map(v => v.node.title)
      .filter(t => !isNaN(parseInt(t)));
    return {
      id: node.id,
      shopifyId: node.id,
      name: node.title,
      handle: node.handle,
      price,
      images,
      photo: images.length > 0,
      photoUrl: images[0] || null,
      sizes,
      variants: node.variants.edges.map(v => v.node),
      color: "NEGRO",
      colors: ["#111"],
      cat: "COLECCION",
      tag: null,
      desc: node.title,
      colour: "",
      composition: "",
      measurements: "",
    };
  });
};

const go = (url) => { window.open(url, '_blank'); };
const handleConfirmOrder = (cartItems, total, freeShip) => {
  const msg = buildOrderMsg(cartItems, total, freeShip);
  const link = "https://api.whatsapp.com/send?phone=" + WA_NUM + "&text=" + msg;
  window.open(link, "_blank");
};
const waLink = (msg) => "https://api.whatsapp.com/send?phone=" + WA_NUM + "&text=" + (msg || "Hola! Me interesan los zapatos de Fady Calzados");

const buildOrderMsg = (cartItems, total, freeShip) => {
  const codFee = 1.00;
  const finalTotal = total + codFee;
  const productos = cartItems.map(i => "• " + i.name + " — Talla " + i.selSize).join("%0A");
  const totalStr = total.toFixed(2).replace(".", ",");
  const finalStr = finalTotal.toFixed(2).replace(".", ",");
  const envio = freeShip ? "GRATIS ✅" : "4,99 €";
  return "👠 *Hola Fady Calzados!* Quiero hacer un pedido:%0A"
    + "---%0A"
    + "*PRODUCTOS:*%0A"
    + productos + "%0A%0A"
    + "🏷 Subtotal: " + totalStr + " €%0A"
    + "🚚 Envío: " + envio + "%0A"
    + "💵 Recargo COD: 1,00 €%0A"
    + "*💰 TOTAL A PAGAR: " + finalStr + " €*%0A%0A"
    + "Método: Contra Reembolso%0A"
    + "---%0A"
    + "*Mis datos de envío:*%0A"
    + "Nombre:%0A"
    + "Dirección:%0A"
    + "Ciudad y CP:%0A"
    + "Teléfono:";
};

const PRODUCTS = [
  { id:1,  name:"Sandalia Crystal Negro",   cat:"NOCHE",    color:"NEGRO",  colors:["#111","#8B0000"], price:"16,99", tag:"Nueva Temporada", photo:true,
    desc:"Sandalia de plataforma con tiras horizontales y hebillas de strass. Tacon bloque de 10cm.", colour:"Negro mate.", composition:"Exterior: 100% Poliuretano.", measurements:"Tacon: 10cm. Plataforma: 2cm." },
  { id:2,  name:"Stiletto Crystal Dorado",  cat:"NOCHE",    color:"DORADO", colors:["#C9A84C"],        price:"16,99", tag:"Nueva Temporada", photo:false,
    desc:"Stiletto de tacon aguja con plataforma dorada.", colour:"Dorado brillo.", composition:"Exterior: 100% Poliuretano.", measurements:"Tacon: 12cm." },
  { id:3,  name:"Slingback Rhinestone",      cat:"ELEGANTE", color:"NEGRO",  colors:["#111","#f0f0f0"], price:"16,99", tag:"Clasico", photo:false,
    desc:"Slingback negro con tira de rhinestones.", colour:"Negro.", composition:"Exterior: 100% Poliuretano.", measurements:"Tacon: 8cm." },
  { id:4,  name:"Platform Rosa Strappy",     cat:"TENDENCIA",color:"ROSA",   colors:["#E91E8C"],        price:"16,99", tag:"Tendencia", photo:false,
    desc:"Sandalia rosa con tiras cruzadas y tacon bloque.", colour:"Rosa fucsia.", composition:"Exterior: 100% Neopreno.", measurements:"Tacon: 9cm." },
  { id:5,  name:"Coral Neon Platform",       cat:"TENDENCIA",color:"CORAL",  colors:["#FF6347"],        price:"16,99", tag:null, photo:false,
    desc:"Plataforma coral neon con tira al tobillo.", colour:"Coral neon.", composition:"Exterior: 100% Sintetico.", measurements:"Tacon: 10cm." },
  { id:6,  name:"Crystal Silver Stiletto",   cat:"NOCHE",    color:"PLATA",  colors:["#C0C0C0"],        price:"16,99", tag:"Nueva Temporada", photo:false,
    desc:"Stiletto plateado con strass.", colour:"Plata glitter.", composition:"Exterior: Glitter sobre PU.", measurements:"Tacon: 13cm." },
  { id:7,  name:"Green Strappy Platform",    cat:"ELEGANTE", color:"VERDE",  colors:["#2E8B57"],        price:"16,99", tag:null, photo:false,
    desc:"Sandalia verde esmeralda con multiples tiras.", colour:"Verde esmeralda.", composition:"Exterior: 100% Saten.", measurements:"Tacon: 10cm." },
  { id:8,  name:"White Block Mule",          cat:"CASUAL",   color:"BLANCO", colors:["#f0f0f0"],        price:"16,99", tag:null, photo:false,
    desc:"Mule blanco con plataforma.", colour:"Blanco puro.", composition:"Exterior: 100% PU.", measurements:"Tacon: 8cm." },
  { id:9,  name:"Camel Wood Block",          cat:"CASUAL",   color:"CAMEL",  colors:["#C19A6B"],        price:"16,99", tag:null, photo:false,
    desc:"Sandalia camel con tacon efecto madera.", colour:"Camel natural.", composition:"Exterior: Cuero sintetico.", measurements:"Tacon: 9cm." },
  { id:10, name:"Graffiti Art Platform",     cat:"ATREVIDA", color:"MULTI",  colors:["#E91E8C","#FF6347"], price:"16,99", tag:"Edicion Limitada", photo:false,
    desc:"Plataforma con estampado graffiti.", colour:"Multicolor.", composition:"Exterior: 100% Poliester.", measurements:"Tacon: 12cm." },
  { id:11, name:"Rainbow Espadrille",        cat:"CASUAL",   color:"MULTI",  colors:["#E91E8C","#C9A84C"], price:"16,99", tag:null, photo:false,
    desc:"Espadrille con tiras multicolor.", colour:"Multicolor.", composition:"Tela y esparto.", measurements:"Cuna: 6cm." },
  { id:12, name:"Black Patent Stiletto",     cat:"ELEGANTE", color:"NEGRO",  colors:["#111"],           price:"16,99", tag:"Clasico", photo:false,
    desc:"Stiletto negro charol.", colour:"Negro charol.", composition:"Exterior: PU charol.", measurements:"Tacon: 12cm." },
];

const BG = {NEGRO:"#e8e8e8",DORADO:"#f0ece0",PLATA:"#e8e8ed",ROSA:"#f5e8ef",CORAL:"#f5ece8",VERDE:"#e8f0ea",BLANCO:"#f5f5f5",CAMEL:"#f0ece5",MULTI:"#ede8f0"};
const SIZES = [35,36,37,38,39,40,41];
const SIZE_GUIDE = [{eu:35,uk:2,us:4.5,cm:22.3},{eu:36,uk:3,us:5.5,cm:23.0},{eu:37,uk:4,us:6.5,cm:23.7},{eu:38,uk:5,us:7.5,cm:24.3},{eu:39,uk:6,us:8.5,cm:25.0},{eu:40,uk:7,us:9.5,cm:25.7},{eu:41,uk:8,us:10.5,cm:26.3}];

function ShippingTimer() {
  const [timeStr, setTimeStr] = useState("");
  const [mode, setMode] = useState("before");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const day = now.getDay();
      const isWeekend = day === 0 || day === 6;

      if (isWeekend) {
        // Countdown to Monday 9am
        const monday = new Date();
        monday.setDate(monday.getDate() + ((1 + 7 - monday.getDay()) % 7 || 7));
        monday.setHours(9,0,0,0);
        const diff = monday - now;
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        setTimeStr(String(h).padStart(2,"0")+"h "+String(m).padStart(2,"0")+"m "+String(s).padStart(2,"0")+"s");
        setMode("weekend");
        return;
      }

      if (now.getHours() < 14) {
        const cutoff = new Date();
        cutoff.setHours(14,0,0,0);
        const diff = cutoff - now;
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        setTimeStr(String(h).padStart(2,"0")+"h "+String(m).padStart(2,"0")+"m "+String(s).padStart(2,"0")+"s");
        setMode("before");
      } else {
        // Countdown to tomorrow 9am
        const tom = new Date();
        tom.setDate(tom.getDate()+1);
        tom.setHours(9,0,0,0);
        const diff = tom - now;
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        setTimeStr(String(h).padStart(2,"0")+"h "+String(m).padStart(2,"0")+"m "+String(s).padStart(2,"0")+"s");
        setMode("after");
      }
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const isFriday = new Date().getDay() === 5;

  if (mode === "before") return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 13px",background:"#f0fff4",border:"1px solid #c8e6c9",borderRadius:6,marginTop:10}}>
      <span style={{fontSize:17,flexShrink:0,marginTop:1}}>🚚</span>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#444",lineHeight:1.6}}>
        {isFriday
          ? <span>Pide antes de las <strong style={{color:"#111"}}>14:00</strong> y recibelo el <strong style={{color:"#111"}}>lunes</strong> con <strong style={{color:"#111"}}>Correos Express 24h</strong>.</span>
          : <span>Pide antes de las <strong style={{color:"#111"}}>14:00</strong> y recibelo <strong style={{color:"#111"}}>manana</strong> con <strong style={{color:"#111"}}>Correos Express 24h</strong>.</span>
        }
        <div style={{marginTop:5,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"#888",letterSpacing:"0.06em"}}>QUEDAN:</span>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:14,fontWeight:700,color:"#1a7a1a",letterSpacing:"0.03em",fontVariantNumeric:"tabular-nums"}}>{timeStr}</span>
        </div>
      </div>
    </div>
  );

  if (mode === "after") return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 13px",background:"#fafafa",border:"1px solid #e8e8e8",borderRadius:6,marginTop:10}}>
      <span style={{fontSize:17,flexShrink:0,marginTop:1}}>🕐</span>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#666",lineHeight:1.5}}>
        Envio manana via <strong style={{color:"#111"}}>Correos Express</strong>.
        <div style={{marginTop:4,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"#999",letterSpacing:"0.05em"}}>PROXIMA SALIDA EN:</span>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,fontWeight:700,color:"#111",fontVariantNumeric:"tabular-nums"}}>{timeStr}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 13px",background:"#fff8f0",border:"1px solid #ffe0c0",borderRadius:6,marginTop:10}}>
      <span style={{fontSize:17,flexShrink:0,marginTop:1}}>📦</span>
      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#666",lineHeight:1.5}}>
        Envios se reanudan el <strong style={{color:"#111"}}>lunes</strong> via <strong style={{color:"#111"}}>Correos Express</strong>.
        <div style={{marginTop:4,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"#999",letterSpacing:"0.05em"}}>LUNES EN:</span>
          <span style={{fontFamily:"Montserrat,sans-serif",fontSize:13,fontWeight:700,color:"#111",fontVariantNumeric:"tabular-nums"}}>{timeStr}</span>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ sizeFilter, setSizeFilter, colorFilter, setColorFilter, heelFilter, setHeelFilter, HEEL_HEIGHTS, UNIQUE_COLORS, anyFilter }) {
  const [openDrop, setOpenDrop] = useState(null);

  const COLOR_LABELS = {NEGRO:"Negro",BLANCO:"Blanco",DORADO:"Dorado",PLATA:"Plata",ROSA:"Rosa",CORAL:"Coral",VERDE:"Verde",CAMEL:"Camel",MULTI:"Multi"};
  const COLOR_HEX = {NEGRO:"#111",BLANCO:"#f0f0f0",DORADO:"#C9A84C",PLATA:"#C0C0C0",ROSA:"#E91E8C",CORAL:"#FF6347",VERDE:"#2E8B57",CAMEL:"#C19A6B",MULTI:null};

  const close = () => setOpenDrop(null);

  return (
    <div className="filter-bar" onClick={close}>

      {/* SIZE */}
      <div style={{position:"relative",flexShrink:0}}>
        <button className={"filter-pill"+(sizeFilter?" active":"")}
          onClick={e=>{e.stopPropagation();setOpenDrop(openDrop==="size"?null:"size");}}>
          {sizeFilter ? "Talla "+sizeFilter : "TALLA"} {openDrop==="size"?"▲":"▼"}
        </button>
        {openDrop==="size"&&(
          <div className="filter-dropdown" onClick={e=>e.stopPropagation()}>
            <div className={"filter-opt"+(sizeFilter===null?" sel":"")}
              onClick={()=>{setSizeFilter(null);close();}}>Todas las tallas</div>
            {[35,36,37,38,39,40,41].map(s=>(
              <div key={s} className={"filter-opt"+(sizeFilter===s?" sel":"")}
                onClick={()=>{setSizeFilter(s);close();}}>
                EU {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-sep"/>

      {/* COLOR */}
      <div style={{position:"relative",flexShrink:0}}>
        <button className={"filter-pill"+(colorFilter?" active":"")}
          onClick={e=>{e.stopPropagation();setOpenDrop(openDrop==="color"?null:"color");}}>
          {colorFilter ? (
            <span style={{display:"flex",alignItems:"center",gap:6}}>
              {COLOR_HEX[colorFilter]&&<span style={{width:10,height:10,borderRadius:"50%",background:COLOR_HEX[colorFilter],border:"1px solid rgba(255,255,255,0.3)",display:"inline-block"}}/>}
              {COLOR_LABELS[colorFilter]||colorFilter}
            </span>
          ) : "COLOR"} {openDrop==="color"?"▲":"▼"}
        </button>
        {openDrop==="color"&&(
          <div className="filter-dropdown" onClick={e=>e.stopPropagation()}>
            <div className={"filter-opt"+(colorFilter===null?" sel":"")}
              onClick={()=>{setColorFilter(null);close();}}>Todos los colores</div>
            {UNIQUE_COLORS.map(c=>(
              <div key={c} className={"filter-opt"+(colorFilter===c?" sel":"")}
                onClick={()=>{setColorFilter(c);close();}}>
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  {COLOR_HEX[c]&&<span style={{width:12,height:12,borderRadius:"50%",background:COLOR_HEX[c],border:"1px solid #e0e0e0",display:"inline-block",flexShrink:0}}/>}
                  {COLOR_LABELS[c]||c}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-sep"/>

      {/* HEEL */}
      <div style={{position:"relative",flexShrink:0}}>
        <button className={"filter-pill"+(heelFilter?" active":"")}
          onClick={e=>{e.stopPropagation();setOpenDrop(openDrop==="heel"?null:"heel");}}>
          {heelFilter ? "Tacon "+heelFilter : "TACON"} {openDrop==="heel"?"▲":"▼"}
        </button>
        {openDrop==="heel"&&(
          <div className="filter-dropdown" onClick={e=>e.stopPropagation()}>
            <div className={"filter-opt"+(heelFilter===null?" sel":"")}
              onClick={()=>{setHeelFilter(null);close();}}>Todos los tacones</div>
            {HEEL_HEIGHTS.map(h=>(
              <div key={h} className={"filter-opt"+(heelFilter===h?" sel":"")}
                onClick={()=>{setHeelFilter(h);close();}}>
                {h}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR */}
      {anyFilter&&(
        <>
          <div className="filter-sep"/>
          <button className="filter-pill clear"
            onClick={()=>{setSizeFilter(null);setColorFilter(null);setHeelFilter(null);close();}}>
            LIMPIAR ✕
          </button>
        </>
      )}
    </div>
  );
}

function Zoom3D({ src, alt, fallback, bg }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const onMouseMove = (e) => {
    const el = wrapRef.current;
    if (!el || !imgRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -10;
    const rotY = (x - 0.5) * 10;
    const moveX = (x - 0.5) * 18;
    const moveY = (y - 0.5) * 18;
    if (imgRef.current) imgRef.current.style.transform = "scale(1.1) translate("+moveX+"px,"+moveY+"px)";
    if (el) el.style.transform = "perspective(800px) rotateX("+rotX+"deg) rotateY("+rotY+"deg)";
  };
  const onMouseLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "scale(1) translate(0,0)";
    if (wrapRef.current) wrapRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };
  return (
    <div ref={wrapRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{width:"100%",height:"100%",background:bg||"#f9f9f9",cursor:"crosshair",transformStyle:"preserve-3d",willChange:"transform",transition:"transform 0.15s ease-out"}}>
      {src
        ? <img ref={imgRef} src={src} alt={alt} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.1s ease-out",willChange:"transform"}}/>
        : <div ref={imgRef} style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:90,opacity:0.4,transition:"transform 0.1s ease-out"}}>
            {fallback}
          </div>}
      <div style={{position:"absolute",bottom:8,right:8,background:"rgba(255,255,255,0.85)",padding:"3px 8px",fontFamily:"Montserrat,sans-serif",fontSize:8,letterSpacing:"0.15em",color:"#888",borderRadius:2,opacity:0,transition:"opacity 0.3s"}}
        className="zoom-hint">ZOOM</div>
    </div>
  );
}

function ProductGallery({ product }) {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const touchRef = useRef(null);

  const images = product.images && product.images.filter(Boolean).length > 0
    ? product.images.filter(Boolean)
    : product.photoUrl ? [product.photoUrl] : [];

  const slides = [
    ...images.map((url, i) => ({ type: "photo", url, label: i === 0 ? "Principal" : i === 1 ? "Lateral" : i === 2 ? "Detalle" : "Vista "+i })),
    { type: "video", label: "Video" },
  ];

  const prev = () => setCur(c => c === 0 ? slides.length-1 : c-1);
  const next = () => setCur(c => c === slides.length-1 ? 0 : c+1);

  const onTS = e => { touchRef.current = e.touches[0].clientX; };
  const onTE = e => {
    if (!touchRef.current) return;
    const d = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? next() : prev();
    touchRef.current = null;
  };

  const slide = slides[cur];

  return (
    <div style={{width:"100%",userSelect:"none"}}>
      {/* Main slide */}
      <div style={{width:"100%",aspectRatio:"1/1",position:"relative",overflow:"hidden",background:"#f9f9f9"}}
        onTouchStart={onTS} onTouchEnd={onTE}>
        {slide.type === "photo" && (
          <Zoom3D src={slide.url} alt={product.name} fallback="👠" bg={BG[product.color]||"#f9f9f9"}/>
        )}
        {slide.type === "video" && (
          <div style={{width:"100%",height:"100%",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
            onClick={()=>setPlaying(p=>!p)}>
            {playing
              ? <div style={{fontSize:48,marginBottom:8}}>🎬</div>
              : <div style={{width:64,height:64,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
                  <span style={{fontSize:24,marginLeft:4,color:"#fff"}}>▶</span>
                </div>}
            <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.6)"}}>
              {playing ? "REPRODUCIENDO" : "VER VIDEO"}
            </div>
          </div>
        )}
        {/* Nav arrows */}
        <button onClick={prev} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>‹</button>
        <button onClick={next} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>›</button>
        {/* Counter */}
        <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.28)",backdropFilter:"blur(4px)",padding:"3px 9px",borderRadius:20,fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.9)",zIndex:2}}>
          {cur+1}/{slides.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{display:"flex",gap:3,padding:"8px 12px",background:"#fcfcfc",overflowX:"auto",scrollbarWidth:"none"}}>
        {slides.map((sl,i)=>(
          <div key={i} onClick={()=>setCur(i)}
            style={{flexShrink:0,width:52,height:52,border:i===cur?"2px solid #111":"1px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",background:sl.type==="video"?"#111":(sl.url?"#f9f9f9":BG[product.color]||"#f9f9f9"),transition:"border 0.2s"}}>
            {sl.type==="photo" && sl.url && <img src={sl.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
            {sl.type==="photo" && !sl.url && <span style={{fontSize:20,opacity:0.4}}>👠</span>}
            {sl.type==="video" && <span style={{fontSize:14,color:"#fff"}}>▶</span>}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{display:"flex",justifyContent:"center",gap:5,paddingBottom:4}}>
        {slides.map((_,i)=>(
          <div key={i} onClick={()=>setCur(i)}
            style={{width:i===cur?20:5,height:5,borderRadius:3,background:i===cur?"#111":"#ddd",transition:"all 0.3s",cursor:"pointer"}}/>
        ))}
      </div>
    </div>
  );
}

function ReelCard({ product, liked, onLike, onOpen, onQuickAdd }) {
  const [imgIdx, setImgIdx] = useState(0);
  const angles = [
    {label:"Principal", opacity:1},
    {label:"Lateral",   opacity:0.7},
    {label:"Detalle",   opacity:0.5},
    {label:"Trasera",   opacity:0.35},
  ];
  return (
    <div style={{position:"relative",aspectRatio:"2/3",background:BG[product.color]||"#f0f0f0",overflow:"hidden",cursor:"pointer",borderRadius:4}} onClick={onOpen}>
      {/* Main image */}
      {product.photo && HEEL
        ? <img src={HEEL} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s"}}/>
        : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(40px,10vw,70px)",opacity:angles[imgIdx].opacity,transition:"opacity 0.3s"}}>👠</div>}

      {/* 4 thumbnail dots top */}
      <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,zIndex:3}}>
        {angles.map((_,i)=>(
          <div key={i}
            onMouseEnter={()=>setImgIdx(i)}
            onMouseLeave={()=>setImgIdx(0)}
            onClick={e=>{e.stopPropagation();setImgIdx(i);}}
            style={{width:i===imgIdx?20:6,height:4,borderRadius:2,background:i===imgIdx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.25s",cursor:"pointer"}}/>
        ))}
      </div>

      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 55%,rgba(0,0,0,0.75))"}}/>
      {product.tag && <div style={{position:"absolute",top:8,left:8,background:"rgba(255,255,255,0.9)",padding:"3px 8px",fontFamily:"Montserrat,sans-serif",fontSize:8,letterSpacing:"0.1em",color:"#555"}}>{product.tag}</div>}
      <button style={{position:"absolute",top:8,right:8,background:"none",border:"none",fontSize:20,cursor:"pointer",filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.5))",zIndex:3}}
        onClick={e=>{e.stopPropagation();onLike();}}>
        {liked?"❤️":"🤍"}
      </button>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 10px 12px",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",borderTop:"1px solid rgba(255,255,255,0.2)"}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:13,color:"#fff",marginBottom:3,fontStyle:"italic"}}>{product.name}</div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:12,color:"#fff",fontWeight:700,marginBottom:6}}>{product.price} €</div>
        <button style={{width:"100%",background:"#fff",color:"#111",border:"none",padding:"8px",fontFamily:"Montserrat,sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.15em",cursor:"pointer",borderRadius:2}}
          onClick={e=>{e.stopPropagation();onQuickAdd();}}>
          QUICK ADD
        </button>
      </div>
    </div>
  );
}

function TikSlide({ product, liked, onLike, onAddToCart, onWa }) {
  const videoRef = useRef(null);
  const slideRef = useRef(null);
  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (videoRef.current) {
        if (entry.isIntersecting) videoRef.current.play().catch(()=>{});
        else videoRef.current.pause();
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={slideRef} style={{height:"100vh",scrollSnapAlign:"start",scrollSnapStop:"always",position:"relative",overflow:"hidden",background:BG[product.color]||"#111",flexShrink:0}}>
      <video ref={videoRef} muted loop playsInline preload="none"
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}>
        <source src="" type="video/mp4"/>
      </video>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {product.photo && HEEL
          ? <img src={HEEL} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : <div style={{fontSize:120,opacity:0.5}}>👠</div>}
      </div>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 45%,rgba(0,0,0,0.35) 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,padding:"60px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#fff",letterSpacing:"0.25em"}}>FADY</div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.2em"}}>@fadycalzados</div>
      </div>
      <div style={{position:"absolute",right:14,bottom:200,display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
        <button style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer"}} onClick={onLike}>
          <div style={{fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"}}>{liked?"❤️":"🤍"}</div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.85)"}}>Me gusta</div>
        </button>
        <button style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer"}} onClick={onWa}>
          <div style={{fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"}}>💬</div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.85)"}}>Chat</div>
        </button>
        <button style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer"}} onClick={onAddToCart}>
          <div style={{fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))"}}>🛍</div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.85)"}}>Comprar</div>
        </button>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 16px 32px",background:"rgba(0,0,0,0.3)",backdropFilter:"blur(18px)",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
        {product.tag && <div style={{display:"inline-block",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px",fontFamily:"Montserrat,sans-serif",fontSize:8,letterSpacing:"0.2em",color:"rgba(255,255,255,0.8)",marginBottom:8}}>{product.tag}</div>}
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,color:"#fff",fontWeight:300,fontStyle:"italic",marginBottom:4,lineHeight:1.1}}>{product.name}</div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:14,color:"#fff",fontWeight:500,marginBottom:14}}>{product.price} € <span style={{fontSize:11,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"2px 8px",marginLeft:6}}>2x33,99€</span></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:13,background:"#fff",color:"#111",border:"none",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.3em",cursor:"pointer",fontWeight:500}} onClick={onAddToCart}>
            AÑADIR A LA CESTA
          </button>
          <button style={{width:48,height:48,background:"#25D366",border:"none",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}} onClick={onWa}>💬</button>
        </div>
      </div>
    </div>
  );
}

export default function FadyCalzados() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [wished, setWished] = useState([]);
  const [selSize, setSelSize] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("DESCRIPTION");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickPopup, setQuickPopup] = useState(null);
  const [quickSize, setQuickSize] = useState(null);
  const [spVisible, setSpVisible] = useState(false);
  const [spData, setSpData] = useState({name:"Elena",city:"Madrid",product:"Sandalia Crystal"});
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [codSelected, setCodSelected] = useState(true);
  const [showTikTok, setShowTikTok] = useState(false);
  const [tikLiked, setTikLiked] = useState([]);
  const [tikSizeOpen, setTikSizeOpen] = useState(false);
  const [tikSelSize, setTikSelSize] = useState(null);
  const [tikProduct, setTikProduct] = useState(PRODUCTS[0]);
  const collRef = useRef(null);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [sizeFilter, setSizeFilter] = useState(null);
  const [colorFilter, setColorFilter] = useState(null);
  const [heelFilter, setHeelFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selColors, setSelColors] = useState([]);
  const [selSizes, setSelSizes] = useState([]);
  const [selHeights, setSelHeights] = useState([]);
  const tikFeedRef = useRef(null);

  const cartCount = cart.length;

  // Extract unique heel heights from measurements
  const HEEL_HEIGHTS = [...new Set(PRODUCTS.map(p => {
    const m = p.measurements.match(/(\d+)cm/);
    return m ? m[1]+"cm" : null;
  }).filter(Boolean))].sort((a,b) => parseInt(a)-parseInt(b));

  // Unique colors
  const UNIQUE_COLORS = [...new Set(PRODUCTS.map(p => p.color))];

  const { productId } = useParams();
  const navigate = useNavigate();

  // Filter products
  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : PRODUCTS;
  const product = productId ? (displayProducts.find(p => (p.handle || String(p.id)) === productId) ?? null) : null;

  const filtered = displayProducts.filter(p => {
    if (colorFilter && p.color !== colorFilter) return false;
    return true;
  });

  const anyFilter = sizeFilter || colorFilter || heelFilter;

  const COLORS_F = [
    {n:"NEGRO",h:"#111"},{n:"BLANCO",h:"#f0f0f0"},{n:"DORADO",h:"#C9A84C"},
    {n:"PLATA",h:"#C0C0C0"},{n:"ROSA",h:"#E91E8C"},{n:"CORAL",h:"#FF6347"},
    {n:"VERDE",h:"#2E8B57"},{n:"CAMEL",h:"#C19A6B"},{n:"MULTI",h:null}
  ];
  const HEIGHTS_F = ["Bajo (hasta 5cm)","Medio (5-8cm)","Alto (8cm+)"];
  const filterCount = selColors.length + selSizes.length + selHeights.length;
  const pairs = Math.floor(cartCount / 2);
  const singles = cartCount % 2;
  const cartTotal = (pairs * 33.99) + (singles * 16.99);
  const savings = cartCount >= 2 ? parseFloat(((cartCount * 16.99) - cartTotal).toFixed(2)) : 0;
  const freeShipping = cartCount >= 2;
  const pairsNeeded = Math.max(0, 2 - cartCount);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120);
    // Fetch Shopify products and use as main product list
    fetchShopifyProducts().then(prods => {
      if (prods && prods.length > 0) {
        setShopifyProducts(prods);
      }
    }).catch(err => console.log("Shopify error:", err));
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    const names = ["Marta","Lucia","Carla","Paula","Sofia","Alba","Rocio","Carmen","Ana","Isabel"];
    const cities = ["Valencia","Sevilla","Barcelona","Malaga","Bilbao","Alicante","Madrid","Murcia"];
    const showSP = () => {
      setSpData({
        name: names[Math.floor(Math.random()*names.length)],
        city: cities[Math.floor(Math.random()*cities.length)],
        product: PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)].name
      });
      setSpVisible(true);
      setTimeout(() => setSpVisible(false), 4500);
    };
    const t = setTimeout(showSP, 5000);
    const i = setInterval(showSP, 22000);
    return () => { window.removeEventListener("scroll", fn); clearTimeout(t); clearInterval(i); };
  }, []);

  const handleShopifyCheckout = (prod, size) => {
    if (!size) return;
    const variant = prod.variants?.find(v => v.title.includes(String(size)));
    if (variant) {
      const numericId = String(variant.id).split("/").pop();
      window.open("https://gfg8hj-yd.myshopify.com/cart/" + numericId + ":1", "_blank");
      return;
    }
    go(waLink("Hola! Quiero " + prod.name + " talla " + size));
  };

  const buildCartCheckoutUrl = () => {
    const lineItems = cart.map(item => {
      const variant = item.variants?.find(v => v.title.includes(String(item.selSize)));
      if (variant) {
        const numericId = String(variant.id).split("/").pop();
        return numericId + ":1";
      }
      return null;
    }).filter(Boolean);
    if (lineItems.length > 0) {
      return "https://gfg8hj-yd.myshopify.com/cart/" + lineItems.join(",");
    }
    return "https://gfg8hj-yd.myshopify.com/cart";
  };

  const addToCart = (p, size) => {
    if (!size) return;
    const isFirst = cart.length === 0;
    setCart(prev => [...prev, {...p, selSize:size, cartId:Date.now()}]);
    setQuickPopup(null);
    navigate("/");
    if (isFirst) {
      setUpsellVisible(true);
      setTimeout(() => setUpsellVisible(false), 6000);
    } else {
      setCartOpen(true);
    }
  };

  const addFromTik = () => {
    if (!tikSelSize) return;
    setCart(prev => [...prev, {...tikProduct, selSize:tikSelSize, cartId:Date.now()}]);
    setTikSizeOpen(false);
    setTikSelSize(null);
    setShowTikTok(false);
    setCartOpen(true);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const TABS = ["DESCRIPTION","COLOUR","COMPOSITION","MEASUREMENTS"];
  const getTab = (p, t) => {
    if (!p) return "";
    if (t === "DESCRIPTION") return p.desc;
    if (t === "COLOUR") return p.colour;
    if (t === "COMPOSITION") return p.composition;
    if (t === "MEASUREMENTS") return p.measurements;
    return "";
  };

  return (
    <div style={{fontFamily:"Montserrat,sans-serif",background:"#fcfcfc",minHeight:"100vh",color:"#111"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .cg{font-family:'Cormorant Garamond',serif!important;}
        .mt{font-family:'Montserrat',sans-serif!important;}
        body{overflow-x:hidden;background:#fcfcfc;}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes heartPop{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(1)}}
        @keyframes heroZoom{from{transform:scale(1)}to{transform:scale(1.06)}}
        @keyframes waPulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.45),0 0 0 0 rgba(37,211,102,0.4)}50%{box-shadow:0 4px 20px rgba(37,211,102,0.45),0 0 0 12px rgba(37,211,102,0)}}

        .nav{position:sticky;top:0;left:0;right:0;z-index:50;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:rgba(255,255,255,0.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6;}
        .nav.scrolled{background:rgba(255,255,255,0.8);}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;letter-spacing:0.35em;position:absolute;left:50%;transform:translateX(-50%);text-decoration:none;color:#111;}
        .nav-logo span{display:block;font-family:'Montserrat',sans-serif;font-size:6px;letter-spacing:0.7em;font-weight:300;margin-top:2px;opacity:0.6;}
        .nav-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border:none;background:none;cursor:pointer;font-size:20px;position:relative;transition:opacity 0.2s;}
        .nav-btn:hover{opacity:0.5;}
        .cart-badge{position:absolute;top:-2px;right:-2px;width:16px;height:16px;background:#111;color:#fff;border-radius:50%;font-size:9px;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-weight:500;}

        .hero{width:100%;height:100svh;position:relative;overflow:hidden;background:#111;}
        .hero-img{width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:brightness(0.82);animation:heroZoom 12s ease forwards;}
        .hero-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.12) 48%,transparent 72%);}
        .hero-grad2{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.28) 0%,transparent 22%);}
        .hero-content{position:absolute;bottom:40px;left:22px;right:22px;color:#fff;opacity:0;transform:translateY(18px);transition:all 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s;}
        .hero-content.vis{opacity:1;transform:translateY(0);}

        .hero-cta{display:inline-flex;align-items:center;gap:10px;background:#fff;color:#111;border:none;padding:14px 28px;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.35em;cursor:pointer;transition:all 0.3s;}
        .hero-cta:hover{background:#f0f0f0;}
        .hero-cta-ghost{display:inline-flex;align-items:center;gap:10px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.6);padding:13px 24px;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.32em;cursor:pointer;transition:all 0.3s;}
        .hero-cta-ghost:hover{background:rgba(255,255,255,0.12);border-color:#fff;}

        .toolbar{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid rgba(0,0,0,0.07);background:#fcfcfc;position:sticky;top:58px;z-index:90;}

        .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;background:#fcfcfc;}
        @media(min-width:768px){.pgrid{gap:48px;padding:48px;}}
        .pcard{cursor:pointer;position:relative;}
        .pimg-wrap{width:100%;aspect-ratio:3/4;overflow:hidden;position:relative;background:#fff;}
        .pimg{width:100%;height:100%;object-fit:cover;filter:grayscale(0.15);transition:transform 0.7s ease;}
        .pcard:hover .pimg{transform:scale(1.05);}
        .vista-rapida{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:7px 18px;background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:999px;font-family:'Montserrat',sans-serif;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:#111;cursor:pointer;opacity:0;transition:opacity 0.35s ease;}
        .pcard:hover .vista-rapida{opacity:1;}

        .pname{font-family:'Cormorant Garamond',Georgia,serif;font-size:11px;color:#111;font-weight:400;margin-bottom:6px;line-height:1.3;letter-spacing:0.25em;text-transform:uppercase;text-align:center;}
        .pprice{font-family:'Montserrat',sans-serif;font-size:10px;color:#999;font-weight:300;letter-spacing:0.2em;text-align:center;}
        .pinfo{margin-top:20px;display:flex;flex-direction:column;align-items:center;padding:0 8px;}

        .mov{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:flex-end;backdrop-filter:blur(5px);}
        .msheet{background:#fcfcfc;width:100%;max-height:93vh;overflow-y:auto;border-radius:18px 18px 0 0;animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1);}
        .tabs-bar{display:flex;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(0,0,0,0.07);padding:0 16px;background:#fcfcfc;}
        .tabs-bar::-webkit-scrollbar{display:none;}
        .tab-btn{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.12em;padding:14px;border:none;background:none;color:#bbb;cursor:pointer;white-space:nowrap;border-bottom:1.5px solid transparent;transition:all 0.2s;flex-shrink:0;}
        .tab-btn.act{color:#111;border-bottom-color:#111;font-weight:500;}

        .size-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:6px;}
        .size-btn{height:40px;border:1px solid #e8e8e8;background:#fcfcfc;font-family:'Montserrat',sans-serif;font-size:11px;color:#111;cursor:pointer;transition:all 0.2s;border-radius:3px;}
        .size-btn:hover{border-color:#111;}
        .size-btn.sel{background:#111;color:#fff;border-color:#111;}

        .cta-main{width:100%;padding:17px;background:#111;color:#fff;border:none;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.28em;cursor:pointer;margin-bottom:8px;}
        .cta-main:disabled{background:#d8d8d8;cursor:not-allowed;}

        .fov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:200;pointer-events:none;transition:background 0.4s;}
        .fov.open{background:rgba(0,0,0,0.38);pointer-events:all;}
        .cov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;pointer-events:none;transition:background 0.4s;}
        .cov.open{background:rgba(0,0,0,0.38);pointer-events:all;}
        .cdrawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,100vw);background:#fcfcfc;z-index:401;transform:translateX(100%);transition:transform 0.45s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;box-shadow:-6px 0 28px rgba(0,0,0,0.1);}
        .cdrawer.open{transform:translateX(0);}
        .chdr{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;}
        .cbody{flex:1;overflow-y:auto;}
        .ship-bar{padding:14px 20px;background:#f8f8f8;border-bottom:1px solid rgba(0,0,0,0.05);}
        .prog{height:3px;background:#e8e8e8;border-radius:2px;overflow:hidden;}
        .prog-fill{height:100%;background:#111;border-radius:2px;transition:width 0.6s cubic-bezier(0.16,1,0.3,1);}
        .citem{display:flex;gap:14px;padding:16px 20px;border-bottom:1px solid rgba(0,0,0,0.05);align-items:flex-start;}

        .sg-ov{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:500;display:flex;align-items:flex-end;backdrop-filter:blur(5px);}
        .sg-sheet{background:#fcfcfc;width:100%;max-height:80vh;overflow-y:auto;border-radius:18px 18px 0 0;animation:slideUp 0.35s cubic-bezier(0.16,1,0.3,1);padding:28px 20px;}

        .qp-ov{position:fixed;inset:0;background:rgba(0,0,0,0.48);z-index:500;display:flex;align-items:flex-end;backdrop-filter:blur(6px);}
        .qp-box{background:#fcfcfc;width:100%;border-radius:18px 18px 0 0;padding:24px 18px 36px;animation:slideUp 0.35s cubic-bezier(0.16,1,0.3,1);}

        .sp-toast{position:fixed;bottom:100px;left:15px;max-width:280px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3);padding:12px 14px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.1);display:flex;align-items:center;gap:10px;z-index:999;opacity:0;pointer-events:none;transform:translateY(20px);transition:all 0.5s cubic-bezier(0.16,1,0.3,1);}
        .sp-toast.vis{opacity:1;pointer-events:all;transform:translateY(0);}

        .upsell-toast{position:fixed;bottom:0;left:0;right:0;z-index:350;background:#fff;border-top:1px solid rgba(0,0,0,0.08);padding:18px 20px 28px;box-shadow:0 -8px 32px rgba(0,0,0,0.12);transform:translateY(100%);transition:transform 0.45s cubic-bezier(0.16,1,0.3,1);}
        .upsell-toast.vis{transform:translateY(0);}

        .wa-wrap{position:fixed;bottom:24px;right:20px;z-index:199;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
        .wa-ping{background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:12px 12px 0 12px;padding:10px 14px;font-family:'Montserrat',sans-serif;font-size:10px;color:#111;box-shadow:0 4px 16px rgba(0,0,0,0.1);max-width:200px;text-align:right;opacity:0;pointer-events:none;}
        .wa-float{width:54px;height:54px;border-radius:50%;background:#25D366;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(37,211,102,0.45);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;font-size:26px;}
        .wa-float:hover{transform:scale(1.08);}

        .insta-section{padding:48px 0 32px;background:#fcfcfc;}
        .reel-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#eee;}
        @media(min-width:640px){.reel-grid{grid-template-columns:repeat(4,1fr);}}

        /* Filter bar */
        .filter-bar{
          display:none;
          background:#fdfaf0;
          border-bottom:1px solid #e6d5b8;
          padding:10px 12px;
          gap:8px;
          overflow-x:auto;
          scrollbar-width:none;
          align-items:center;
          position:sticky;
          top:58px;
          z-index:88;
        }
        .filter-bar::-webkit-scrollbar{display:none;}
        .filter-pill{
          flex-shrink:0;
          padding:7px 14px;
          border-radius:20px;
          border:1px solid #e6d5b8;
          background:#fff;
          font-family:'Montserrat',sans-serif;
          font-size:10px;
          color:#8a7350;
          cursor:pointer;
          white-space:nowrap;
          transition:all 0.2s;
          font-weight:500;
          letter-spacing:0.05em;
          position:relative;
        }
        .filter-pill:hover{border-color:#8a7350;}
        .filter-pill.active{
          background:#111;
          color:#fff;
          border-color:#111;
        }
        .filter-pill.clear{
          background:transparent;
          border-color:#ccc;
          color:#999;
          font-size:9px;
          letter-spacing:0.1em;
        }
        .filter-sep{
          width:1px;
          height:20px;
          background:#e6d5b8;
          flex-shrink:0;
        }
        .filter-dropdown{
          position:absolute;
          top:calc(100% + 6px);
          left:0;
          background:#fff;
          border:1px solid #e6d5b8;
          border-radius:8px;
          box-shadow:0 8px 24px rgba(0,0,0,0.1);
          z-index:300;
          min-width:130px;
          overflow:hidden;
        }
        .filter-opt{
          padding:11px 16px;
          font-family:'Montserrat',sans-serif;
          font-size:11px;
          color:#111;
          cursor:pointer;
          border-bottom:1px solid rgba(0,0,0,0.04);
          transition:background 0.15s;
        }
        .filter-opt:last-child{border-bottom:none;}
        .filter-opt:hover{background:#fdfaf0;}
        .filter-opt.sel{color:#8a7350;font-weight:700;}
        .promo-banner{position:sticky;top:58px;z-index:89;background:#111;color:#fff;padding:9px;text-align:center;font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.12em;font-weight:500;}
        .fov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:200;pointer-events:none;transition:background 0.4s;}
        .fov.open{background:rgba(0,0,0,0.38);pointer-events:all;}
        .fdrawer{position:fixed;top:0;right:0;bottom:0;width:min(320px,92vw);background:#fcfcfc;z-index:201;transform:translateX(100%);transition:transform 0.45s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;}
        .fdrawer.open{transform:translateX(0);}
        .fhdr{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;}
        .fbody{flex:1;overflow-y:auto;padding:24px 20px;}
        .fsec{margin-bottom:28px;}
        .fsec-title{font-family:'Montserrat',sans-serif;font-size:8px;letter-spacing:0.45em;color:#aaa;margin-bottom:14px;font-weight:400;}
        .cgrid{display:flex;flex-wrap:wrap;gap:10px;}
        .cswatch{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;}
        .ccirc{width:26px;height:26px;border-radius:50%;border:1px solid #e0e0e0;transition:all 0.2s;}
        .ccirc.sel{box-shadow:0 0 0 2px #fcfcfc,0 0 0 3.5px #111;}
        .clbl{font-family:'Montserrat',sans-serif;font-size:7px;color:#bbb;letter-spacing:0.08em;}
        .sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
        .sbtn{height:38px;border:1px solid #e8e8e8;background:#fcfcfc;font-family:'Montserrat',sans-serif;font-size:11px;color:#111;cursor:pointer;transition:all 0.2s;}
        .sbtn.sel{background:#111;color:#fff;border-color:#111;}
        .hopt{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid rgba(0,0,0,0.05);cursor:pointer;}
        .hopt:last-child{border-bottom:none;}
        .hchk{width:18px;height:18px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all 0.2s;}
        .hchk.chk{background:#111;border-color:#111;color:#fff;}
        .fftr{padding:16px 20px;border-top:1px solid rgba(0,0,0,0.07);display:flex;gap:10px;flex-shrink:0;}
        .fapply{flex:1;padding:14px;background:#111;color:#fff;border:none;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:0.3em;cursor:pointer;}
        .fclr{padding:14px 16px;background:transparent;color:#999;border:1px solid #e8e8e8;font-family:'Montserrat',sans-serif;font-size:9px;cursor:pointer;letter-spacing:0.1em;}

        .cftr{padding:16px 20px;border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;}
        .trust-row{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 0 4px;flex-wrap:wrap;}
        .zoom-wrap:hover .zoom-hint{opacity:1!important;}
        .trust-badge{height:22px;padding:3px 8px;border:1px solid #e8e8e8;border-radius:4px;font-family:'Montserrat',sans-serif;font-size:8px;font-weight:600;color:#999;letter-spacing:0.08em;}
        .cod-box{background:#fdfaf0;border:1px solid #e6d5b8;padding:20px;border-radius:8px;margin:15px 0;}
        .cod-title{font-family:'Montserrat',sans-serif;font-size:10px;letter-spacing:0.15em;font-weight:700;color:#8a7350;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px;}
        .cod-amount{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:600;color:#111;}
        .cod-detail{font-size:11px;color:#666;margin-top:6px;line-height:1.4;font-family:'Montserrat',sans-serif;}
        .cod-container{background:#fdfaf0;border:1px solid #e6d5b8;padding:20px;border-radius:4px;margin:15px 0;}
        .cod-header{display:flex;align-items:center;gap:10px;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;color:#8a7350;text-transform:uppercase;margin-bottom:12px;}
        .cod-total-row{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(138,115,80,0.2);padding-bottom:12px;margin-bottom:12px;}
        .cod-price{font-size:28px;font-weight:500;color:#111;font-family:'Montserrat',sans-serif;}
        .cod-note{font-size:11px;color:#777;line-height:1.5;font-style:italic;font-family:'Montserrat',sans-serif;}
        .cod-note strong{color:#111;font-weight:600;}
      `}</style>

      {/* NAV */}
      <nav className={"nav"+(scrollY>10?" scrolled":"")}>
        <Link to="/" className="nav-logo cg">
          FADY
          <span style={{color:"#aaa"}}>CALZADOS</span>
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <button className="nav-btn" style={{color:"#111",fontSize:18}} onClick={()=>setShowTikTok(true)}>🎬</button>
          <div style={{position:"relative"}}>
            <button className="nav-btn" style={{color:"#111"}} onClick={()=>setCartOpen(true)}>
              🛍
              {cartCount>0&&<div className="cart-badge">{cartCount}</div>}
            </button>
          </div>
        </div>
      </nav>

      {/* LOADING */}
      {shopifyProducts.length === 0 && (
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#111",color:"#fff",padding:"8px 16px",borderRadius:20,fontFamily:"Montserrat,sans-serif",fontSize:10,letterSpacing:"0.15em",zIndex:500}}>
          Cargando productos...
        </div>
      )}

      {/* PROMO BANNER */}
      {cartCount===1&&(
        <div className="promo-banner">
          AÑADE 1 PAR MAS — 2 PARES POR SOLO 35€ CON ENVIO GRATIS
        </div>
      )}

      {/* HERO */}
      <div className="hero">
        {HEEL&&<img src={HEEL} alt="Fady Calzados" className="hero-img"/>}
        {!HEEL&&<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",fontSize:120,opacity:0.3}}>👠</div>}
        <div className="hero-grad"/>
        <div className="hero-grad2"/>
        <div className={"hero-content"+(loaded?" vis":"")}>
          <div className="mt" style={{fontSize:9,letterSpacing:"0.45em",color:"rgba(255,255,255,0.6)",marginBottom:10}}>NUEVA COLECCION SS25</div>
          <div className="cg" style={{fontSize:"clamp(36px,10vw,56px)",fontWeight:300,lineHeight:1.05,marginBottom:14,fontStyle:"italic"}}>Tacones<br/>de Mujer</div>
          <div className="mt" style={{fontSize:11,fontWeight:300,color:"rgba(255,255,255,0.68)",marginBottom:26,lineHeight:1.7}}>Diseno exclusivo para la<br/>mujer espanola. Envio 24h.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            <button className="hero-cta mt" onClick={()=>collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"})}>
              VER COLECCION
            </button>
            <button className="hero-cta-ghost mt" onClick={()=>setShowTikTok(true)}>
              LOOKBOOK
            </button>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar" ref={collRef}>
        <div className="mt" style={{fontSize:11,color:"#999",fontWeight:300,letterSpacing:"0.05em"}}>{filtered.length} Productos</div>
        <button className="mt" style={{display:"flex",alignItems:"center",gap:8,fontFamily:"Montserrat,sans-serif",fontSize:11,fontWeight:500,color:"#111",background:"none",border:"none",cursor:"pointer",letterSpacing:"0.06em"}}
          onClick={()=>setFiltersOpen(true)}>
          FILTROS
          {filterCount>0
            ? <span style={{width:17,height:17,background:"#111",color:"#fff",borderRadius:"50%",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600}}>{filterCount}</span>
            : <span style={{fontSize:14}}>⊞</span>}
        </button>
      </div>

      {/* FILTER BAR */}
      <FilterBar
        sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
        colorFilter={colorFilter} setColorFilter={setColorFilter}
        heelFilter={heelFilter} setHeelFilter={setHeelFilter}
        HEEL_HEIGHTS={HEEL_HEIGHTS}
        UNIQUE_COLORS={UNIQUE_COLORS}
        anyFilter={anyFilter}
      />

      {/* PRODUCT GRID */}
      <div className="pgrid">
        {filtered.map(p=>(
          <div key={p.id} className="pcard">
            <button style={{position:"absolute",top:10,right:12,fontSize:14,cursor:"pointer",zIndex:3,border:"none",background:"none",color:wished.includes(p.id)?"#111":"rgba(0,0,0,0.2)",transition:"all 0.2s"}}
              onClick={e=>{e.stopPropagation();setWished(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id]);}}>
              {wished.includes(p.id)?"♥":"♡"}
            </button>
            <Link to={`/product/${p.handle||p.id}`} style={{display:"block",textDecoration:"none",color:"inherit"}}
              onClick={()=>{setSelSize(null);setActiveTab("DESCRIPTION");}}>
              {p.tag&&<div className="mt" style={{position:"absolute",top:12,left:12,fontSize:7,letterSpacing:"0.25em",color:"#888",zIndex:2,textTransform:"uppercase"}}>{p.tag}</div>}
              <div className="pimg-wrap">
                {p.photoUrl
                  ? <img src={p.photoUrl} alt={p.name} className="pimg"/>
                  : p.photo&&HEEL
                    ? <img src={HEEL} alt={p.name} className="pimg"/>
                    : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(48px,10vw,72px)",opacity:0.3}}>👠</div>}
                <div className="vista-rapida">Vista Rápida</div>
              </div>
              <div className="pinfo">
                <div className="pname cg">{p.name}</div>
                <div className="pprice mt">{p.price} €</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* INSTAGRAM SECTION */}
      <div className="insta-section">
        <div style={{padding:"0 16px 20px",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
          <div>
            <div className="mt" style={{fontSize:9,letterSpacing:"0.35em",color:"#aaa",marginBottom:4}}>COMPRA EN</div>
            <div className="cg" style={{fontSize:28,fontWeight:300,color:"#111",lineHeight:1.1}}>Nuestro <em>Instagram</em></div>
          </div>
          <a className="mt" href="https://instagram.com/fadycalzados" target="_blank" rel="noreferrer"
            style={{fontSize:11,color:"#111",fontWeight:400,display:"flex",alignItems:"center",gap:4,textDecoration:"none"}}>
            📸 @fadycalzados
          </a>
        </div>
        <div className="reel-grid">
          {filtered.map(p=>(
            <ReelCard key={p.id} product={p}
              liked={wished.includes(p.id)}
              onLike={()=>setWished(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])}
              onOpen={()=>{navigate('/product/'+(p.handle||p.id));setSelSize(null);}}
              onQuickAdd={()=>{setQuickPopup(p);setQuickSize(null);}}
            />
          ))}
        </div>
      </div>

      <div style={{height:90}}/>

      {/* PRODUCT SHEET */}
      {product&&(
        <div className="mov" onClick={()=>navigate(-1)}>
          <div className="msheet" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
              <div style={{width:38,height:4,background:"#e0e0e0",borderRadius:2}}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}>
              <button onClick={()=>navigate(-1)} style={{background:"none",border:"1px solid #e8e8e8",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:14,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <ProductGallery product={product}/>
            <div style={{padding:"20px 16px 36px"}}>
              <div className="mt" style={{fontSize:8,letterSpacing:"0.45em",color:"#bbb",marginBottom:8}}>{product.cat}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div className="mt" style={{fontSize:16,fontWeight:300,color:"#111",lineHeight:1.2,flex:1,marginRight:12}}>{product.name}</div>
                <button style={{fontSize:22,border:"none",background:"none",cursor:"pointer",color:wished.includes(product.id)?"#111":"#ccc"}}
                  onClick={()=>setWished(prev=>prev.includes(product.id)?prev.filter(x=>x!==product.id):[...prev,product.id])}>
                  {wished.includes(product.id)?"♥":"♡"}
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12,borderBottom:"1px solid rgba(0,0,0,0.08)"}}>
                <div className="cg" style={{fontSize:26,fontWeight:300,color:"#111"}}>{product.price} €</div>
                <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"#999"}}>2 pares = 35€</div>
              </div>
              <div style={{fontFamily:"Montserrat,sans-serif",fontSize:10,color:"#888",marginTop:8,marginBottom:16}}>👁 {Math.floor(Math.random()*18)+8} personas viendo ahora</div>
              <div style={{background:"#f8fdf8",border:"1px solid #d4edda",borderRadius:8,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20}}>💵</span>
                <div>
                  <div className="mt" style={{fontSize:11,fontWeight:500,color:"#1a5c1a",marginBottom:2}}>Pago contra reembolso</div>
                  <div className="mt" style={{fontSize:10,color:"#2d8a2d"}}>Pagas cuando llega. Cargo por reembolso: +1EUR.</div>
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div className="mt" style={{fontSize:9,letterSpacing:"0.3em",color:"#aaa"}}>SELECCIONA TALLA (EU)</div>
                  <button className="mt" onClick={()=>setSizeGuideOpen(true)}
                    style={{fontSize:10,color:"#111",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
                    Guia de tallas
                  </button>
                </div>
                <div className="size-grid">
                  {(product && product.sizes && product.sizes.length > 0 ? product.sizes : SIZES).map(s=>(<button key={s} className={"size-btn mt"+(selSize===s?" sel":"")} onClick={()=>setSelSize(s)}>{s}</button>))}
                </div>
                {selSize&&<div className="mt" style={{fontSize:10,color:"#c0392b",marginTop:8,fontWeight:500}}>Solo 2 unidades en talla {selSize}</div>}
              </div>
              <button className="cta-main mt" disabled={!selSize} onClick={()=>addToCart(product,selSize)}>
                {selSize?"ANADIR A LA CESTA — TALLA "+selSize:"SELECCIONA UNA TALLA"}
              </button>
              {selSize&&(
                <button className="mt"
                  onClick={()=>handleShopifyCheckout(product,selSize)}
                  style={{width:"100%",padding:14,background:"#fff",color:"#111",border:"1.5px solid #111",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.22em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8,transition:"all 0.2s"}}>
                  💳 PAGAR CON TARJETA
                </button>
              )}
              <button className="mt" onClick={()=>go(waLink("Hola! Quiero el modelo "+product.name+(selSize?" en talla "+selSize:"")+" por "+product.price+"EUR"))}
                style={{width:"100%",padding:14,background:"#fff",color:"#111",border:"1.5px solid #e0e0e0",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.22em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,borderRadius:2,transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#111"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#e0e0e0"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                PEDIR POR WHATSAPP
              </button>
              <ShippingTimer/>
              <div style={{marginTop:22}}>
                <div className="tabs-bar">
                  {TABS.map(t=><button key={t} className={"tab-btn mt"+(activeTab===t?" act":"")} onClick={()=>setActiveTab(t)}>{t}</button>)}
                </div>
                <div style={{padding:"16px 16px 0",fontFamily:"Montserrat,sans-serif",fontSize:12,color:"#666",lineHeight:1.75}}>
                  {getTab(product,activeTab)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK POPUP */}
      {quickPopup&&(
        <div className="qp-ov" onClick={()=>setQuickPopup(null)}>
          <div className="qp-box" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div className="cg" style={{fontSize:20,fontWeight:300,color:"#111",fontStyle:"italic"}}>{quickPopup.name}</div>
              <button onClick={()=>setQuickPopup(null)} style={{background:"none",border:"none",fontSize:18,color:"#aaa",cursor:"pointer"}}>✕</button>
            </div>
            {freeShipping&&<div style={{background:"#f0fff4",border:"1px solid #c8e6c9",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>🎁</span>
              <div className="mt" style={{fontSize:11,color:"#1a5c1a"}}>Anade este par y consigue envio gratis!</div>
            </div>}
            <div className="mt" style={{fontSize:9,letterSpacing:"0.3em",color:"#aaa",marginBottom:10}}>SELECCIONA TALLA (EU)</div>
            <div className="size-grid">
              {SIZES.map(s=><button key={s} className={"size-btn mt"+(quickSize===s?" sel":"")} onClick={()=>setQuickSize(s)}>{s}</button>)}
            </div>
            {quickSize&&<div className="mt" style={{fontSize:10,color:"#c0392b",marginTop:8,marginBottom:10,fontWeight:500}}>Solo 2 en talla {quickSize}</div>}
            <button className="mt" disabled={!quickSize} onClick={()=>addToCart(quickPopup,quickSize)}
              style={{width:"100%",padding:15,background:quickSize?"#111":"#ddd",color:"#fff",border:"none",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.28em",cursor:quickSize?"pointer":"not-allowed",marginTop:8}}>
              {quickSize?"ANADIR TALLA "+quickSize:" SELECCIONA UNA TALLA"}
            </button>
          </div>
        </div>
      )}

      {/* FILTER DRAWER */}
      <div className={"fov"+(filtersOpen?" open":"")} onClick={()=>setFiltersOpen(false)}/>
      <div className={"fdrawer"+(filtersOpen?" open":"")}>
        <div className="fhdr">
          <div className="mt" style={{fontSize:11,letterSpacing:"0.18em",color:"#111",fontWeight:500}}>FILTROS</div>
          <button style={{fontSize:19,background:"none",border:"none",cursor:"pointer",color:"#999"}} onClick={()=>setFiltersOpen(false)}>✕</button>
        </div>
        <div className="fbody">
          <div className="fsec">
            <div className="fsec-title mt">COLOR</div>
            <div className="cgrid">
              {COLORS_F.map(c=>(
                <div key={c.n} className="cswatch" onClick={()=>setSelColors(prev=>prev.includes(c.n)?prev.filter(x=>x!==c.n):[...prev,c.n])}>
                  <div className={"ccirc"+(selColors.includes(c.n)?" sel":"")}
                    style={{background:c.h||"conic-gradient(#E91E8C,#FF6347,#C9A84C,#2E8B57,#E91E8C)",outline:c.h==="#f0f0f0"?"1px solid #ddd":"none"}}/>
                  <div className="clbl mt">{c.n.slice(0,5)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fsec">
            <div className="fsec-title mt">TALLA (EU)</div>
            <div className="sgrid">
              {SIZES.map(s=>(
                <button key={s} className={"sbtn mt"+(selSizes.includes(s)?" sel":"")}
                  onClick={()=>setSelSizes(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="fsec">
            <div className="fsec-title mt">ALTURA DEL TACON</div>
            {HEIGHTS_F.map(h=>(
              <div key={h} className="hopt" onClick={()=>setSelHeights(prev=>prev.includes(h)?prev.filter(x=>x!==h):[...prev,h])}>
                <div className="mt" style={{fontSize:12,color:"#111",fontWeight:300}}>{h}</div>
                <div className={"hchk"+(selHeights.includes(h)?" chk":"")}>{selHeights.includes(h)?"✓":""}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fftr">
          <button className="fclr mt" onClick={()=>{setSelColors([]);setSelSizes([]);setSelHeights([]);}}>LIMPIAR</button>
          <button className="fapply mt" onClick={()=>setFiltersOpen(false)}>VER {filtered.length} RESULTADOS</button>
        </div>
      </div>

      {/* CART DRAWER */}
      <div className={"cov"+(cartOpen?" open":"")} onClick={()=>setCartOpen(false)}/>
      <div className={"cdrawer"+(cartOpen?" open":"")}>
        <div className="chdr">
          <div className="mt" style={{fontSize:10,letterSpacing:"0.28em",color:"#111",fontWeight:500}}>CESTA {cartCount>0&&"("+cartCount+")"}</div>
          <button style={{fontSize:19,background:"none",border:"none",cursor:"pointer",color:"#999"}} onClick={()=>setCartOpen(false)}>✕</button>
        </div>
        <div className="cbody">
          <div className="ship-bar">
            {freeShipping?(
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#111",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>✓</div>
                <div>
                  <div className="mt" style={{fontSize:11,color:"#111",fontWeight:700,marginBottom:1}}>ENVIO GRATIS ACTIVADO</div>
                  <div className="mt" style={{fontSize:10,color:"#555"}}>
                    Oferta 2x33,99EUR aplicada
                    {savings>0&&<span style={{color:"#2d8a2d",fontWeight:600}}> · Ahorras {savings.toFixed(2).replace(".",",")}EUR</span>}
                  </div>
                </div>
              </div>
            ):(
              <div style={{marginBottom:8}}>
                <div className="mt" style={{fontSize:11,color:"#111",fontWeight:600,marginBottom:2}}>
                  Te falta <span style={{color:"#111",textDecoration:"underline",textUnderlineOffset:2}}>{pairsNeeded} par</span> para Envio Gratis
                </div>
                <div className="mt" style={{fontSize:10,color:"#888"}}>2 pares = 33,99EUR con envio incluido</div>
              </div>
            )}
            <div className="prog"><div className="prog-fill" style={{width:Math.min((cartCount/2)*100,100)+"%"}}/></div>
          </div>
          {cartCount===0&&(
            <div style={{padding:"48px 20px",textAlign:"center"}}>
              <div style={{fontSize:44,marginBottom:14}}>👠</div>
              <div className="mt" style={{fontSize:12,color:"#bbb",marginBottom:16}}>Tu cesta esta vacia</div>
              <button className="mt" onClick={()=>setCartOpen(false)}
                style={{fontSize:10,color:"#111",textDecoration:"underline",background:"none",border:"none",cursor:"pointer",letterSpacing:"0.18em"}}>
                SEGUIR COMPRANDO
              </button>
            </div>
          )}
          {cart.map(item=>(
            <div key={item.cartId} className="citem">
              <div style={{width:62,height:62,flexShrink:0,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:BG[item.color]||"#f5f5f5"}}>
                {item.photo&&HEEL?<img src={HEEL} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:28}}>👠</span>}
              </div>
              <div style={{flex:1}}>
                <div className="mt" style={{fontSize:11,color:"#111",marginBottom:3,lineHeight:1.3}}>{item.name}</div>
                <div className="mt" style={{fontSize:9,color:"#aaa",marginBottom:5,letterSpacing:"0.05em"}}>TALLA {item.selSize} · {item.color}</div>
                <div className="cg" style={{fontSize:16,color:"#111"}}>{item.price} €</div>
              </div>
              <button style={{fontSize:14,color:"#ccc",background:"none",border:"none",cursor:"pointer"}} onClick={()=>removeFromCart(item.cartId)}>✕</button>
            </div>
          ))}
        </div>
        {cartCount>0&&(
          <div className="cftr">
            {cartCount>=2&&(
              <div style={{background:"#fdfaf0",border:"1px solid #e6d5b8",borderRadius:6,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.2em",color:"#8a7350",fontWeight:700,marginBottom:6}}>
                  ✨ OFERTA APLICADA
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#555"}}>2 pares × 33,99€</div>
                  {savings>0&&<div style={{fontFamily:"Montserrat,sans-serif",fontSize:11,color:"#2d8a2d",fontWeight:600}}>Ahorras {savings.toFixed(2).replace(".",",")}€</div>}
                </div>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div className="mt" style={{fontSize:10,color:"#aaa",letterSpacing:"0.12em"}}>TOTAL + 1EUR COD {freeShipping&&"· ENVIO GRATIS"}</div>
              <div>
                {savings>0&&<div className="mt" style={{fontSize:11,color:"#bbb",textDecoration:"line-through",textAlign:"right"}}>{(cartCount*16.99).toFixed(2).replace(".",",")}€</div>}
                <div className="cg" style={{fontSize:24,fontWeight:300,color:"#111"}}>{cartTotal.toFixed(2).replace(".",",")} €</div>
              </div>
            </div>
            <div style={{background:"#f8fdf8",border:"1px solid #d4edda",borderRadius:6,padding:"9px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>💵</span>
              <div className="mt" style={{fontSize:9,color:"#2d6a4f"}}><strong>Pago contra reembolso</strong> — Pagas cuando llega</div>
            </div>
            {codSelected&&(
              <div className="cod-container">
                <div className="cod-header">
                  <span style={{fontSize:14}}>✉️</span> Pago Contra Reembolso
                </div>
                <div className="cod-total-row">
                  <span className="mt" style={{fontSize:12,color:"#555"}}>Importe Total:</span>
                  <span className="mt cod-price">{(cartTotal+1).toFixed(2).replace(".",",")} €</span>
                </div>
                <div className="mt cod-note">
                  Incluye <strong>1,00€</strong> de recargo por gestion de cobro.<br/>
                  Por favor, prepare el importe exacto para el repartidor.
                </div>
              </div>
            )}
            <button className="hero-cta mt"
              style={{width:"100%",justifyContent:"center",padding:20,background:"#111",color:"#fff",marginTop:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:10,letterSpacing:"0.28em"}}
              onClick={()=>window.open(buildCartCheckoutUrl(), "_blank")}>
              FINALIZAR COMPRA
            </button>
            <div className="trust-row">
              {["VISA","MASTER","PAYPAL","COD"].map((b,i)=>(
                <div key={i} className="trust-badge mt">{b}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIZE GUIDE */}
      {sizeGuideOpen&&(
        <div className="sg-ov" onClick={()=>setSizeGuideOpen(false)}>
          <div className="sg-sheet" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div className="cg" style={{fontSize:26,fontWeight:300,color:"#111",fontStyle:"italic"}}>Guia de tallas</div>
              <button onClick={()=>setSizeGuideOpen(false)} style={{background:"none",border:"1px solid #e8e8e8",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:14,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
              <thead>
                <tr style={{borderBottom:"1.5px solid #111"}}>
                  {["EU","UK","US","CM"].map(h=><th key={h} className="mt" style={{fontSize:8,letterSpacing:"0.32em",color:"#aaa",padding:"10px 8px",textAlign:"center",fontWeight:400}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((r,i)=>(
                  <tr key={r.eu} style={{borderBottom:"1px solid rgba(0,0,0,0.05)",background:i%2===0?"#fff":"#fafafa"}}>
                    <td className="cg" style={{fontSize:20,fontWeight:300,padding:"12px 8px",textAlign:"center",color:"#111"}}>{r.eu}</td>
                    <td className="mt" style={{fontSize:11,padding:"12px 8px",textAlign:"center",color:"#999"}}>{r.uk}</td>
                    <td className="mt" style={{fontSize:11,padding:"12px 8px",textAlign:"center",color:"#999"}}>{r.us}</td>
                    <td className="mt" style={{fontSize:11,padding:"12px 8px",textAlign:"center",color:"#999"}}>{r.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={()=>{go(waLink("Hola! Necesito ayuda para elegir mi talla"));setSizeGuideOpen(false);}}
              style={{width:"100%",padding:14,background:"#111",color:"#fff",border:"none",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.3em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{fontSize:16}}>💬</span> AYUDA CON TALLAS POR WHATSAPP
            </button>
          </div>
        </div>
      )}

      {/* TIKTOK MODAL */}
      {showTikTok&&(
        <div style={{position:"fixed",inset:0,zIndex:3000,background:"#000",overflowY:"scroll",scrollSnapType:"y mandatory",scrollbarWidth:"none"}} ref={tikFeedRef}>
          <button onClick={()=>setShowTikTok(false)}
            style={{position:"fixed",top:16,left:16,zIndex:3100,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",fontSize:18,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            ✕
          </button>
          <div className="cg" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:3100,fontSize:18,color:"#fff",letterSpacing:"0.3em",pointerEvents:"none"}}>FADY</div>
          {PRODUCTS.map((p)=>(
            <TikSlide key={p.id} product={p}
              liked={tikLiked.includes(p.id)}
              onLike={()=>setTikLiked(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])}
              onAddToCart={()=>{setTikProduct(p);setTikSizeOpen(true);setTikSelSize(null);}}
              onWa={()=>go(waLink("Hola! Vi el video de "+p.name+" y me encanta"))}
            />
          ))}
          {tikSizeOpen&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:3200,display:"flex",alignItems:"flex-end"}}
              onClick={()=>setTikSizeOpen(false)}>
              <div style={{background:"#fff",width:"100%",borderRadius:"18px 18px 0 0",padding:"20px 18px 36px"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div className="cg" style={{fontSize:20,fontWeight:300,color:"#111",fontStyle:"italic"}}>{tikProduct.name}</div>
                  <button onClick={()=>setTikSizeOpen(false)} style={{background:"none",border:"none",fontSize:18,color:"#aaa",cursor:"pointer"}}>✕</button>
                </div>
                <div className="mt" style={{fontSize:8,letterSpacing:"0.32em",color:"#aaa",marginBottom:10}}>SELECCIONA TU TALLA (EU)</div>
                <div className="size-grid">
                  {SIZES.map(s=>(
                    <button key={s} className={"size-btn mt"+(tikSelSize===s?" sel":"")} onClick={()=>setTikSelSize(s)}>{s}</button>
                  ))}
                </div>
                {tikSelSize&&<div className="mt" style={{fontSize:10,color:"#c0392b",marginTop:8,marginBottom:12,fontWeight:500}}>Solo 2 en talla {tikSelSize}</div>}
                <button className="mt" disabled={!tikSelSize} onClick={addFromTik}
                  style={{width:"100%",padding:15,background:tikSelSize?"#111":"#ddd",color:"#fff",border:"none",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.3em",cursor:tikSelSize?"pointer":"not-allowed"}}>
                  {tikSelSize?"ANADIR TALLA "+tikSelSize:"SELECCIONA UNA TALLA"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPSELL TOAST */}
      <div className={"upsell-toast"+(upsellVisible?" vis":"")}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
          <div style={{fontSize:26}}>👠</div>
          <div style={{flex:1}}>
            <div className="cg" style={{fontSize:18,color:"#111",marginBottom:4}}>Solo uno?</div>
            <div className="mt" style={{fontSize:11,color:"#888",lineHeight:1.5}}>
              Anade otro par por solo <strong style={{color:"#111"}}>16,00EUR mas</strong> y ahorra en el envio. 2 pares = <strong style={{color:"#111"}}>33,99EUR</strong>.
            </div>
          </div>
          <button onClick={()=>setUpsellVisible(false)} style={{fontSize:18,color:"#ccc",background:"none",border:"none",cursor:"pointer"}}>✕</button>
        </div>
        <button className="mt" onClick={()=>{setUpsellVisible(false);collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"});}}
          style={{width:"100%",padding:14,background:"#111",color:"#fff",border:"none",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.32em",cursor:"pointer",marginBottom:8}}>
          VER MAS MODELOS
        </button>
        <button className="mt" onClick={()=>setUpsellVisible(false)}
          style={{fontSize:9,color:"#bbb",letterSpacing:"0.15em",background:"none",border:"none",cursor:"pointer",width:"100%",padding:4}}>
          No, gracias
        </button>
      </div>

      {/* SOCIAL PROOF */}
      <div className={"sp-toast"+(spVisible?" vis":"")}>
        <div style={{fontSize:28}}>👠</div>
        <div>
          <div className="mt" style={{fontSize:11,color:"#111",fontWeight:500,marginBottom:2}}>{spData.name} de {spData.city}</div>
          <div className="mt" style={{fontSize:10,color:"#888",lineHeight:1.35}}>acabo de anadir <strong style={{color:"#111"}}>{spData.product}</strong></div>
          <div className="mt" style={{fontSize:8,color:"#bbb",marginTop:3}}>Hace {Math.floor(Math.random()*4)+1} minutos</div>
        </div>
      </div>

      {/* WA BUBBLE */}
      <a href={"https://wa.me/"+WA_NUM} onClick={e=>{e.preventDefault();go("https://wa.me/"+WA_NUM);}}
        style={{position:"fixed",bottom:28,right:20,zIndex:999,width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.15),0 4px 20px rgba(37,211,102,0.35)",textDecoration:"none",animation:"waPulse 2.5s ease-in-out infinite",transition:"transform 0.2s,box-shadow 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>
    </div>
  );
}
