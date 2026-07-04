import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { trackTikTokEvent } from "./src/components/analytics/TikTokPixel";

const HEEL = null;
const HERO_BG = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1920&q=90";
const WA_NUM = "34612574172";
const SHOPIFY_DOMAIN = "gfg8hj-yd.myshopify.com";
const SHOPIFY_TOKEN = "6defb920c830f6d263705aa0bcb6a074";
const SHOPIFY_URL = "https://" + SHOPIFY_DOMAIN + "/api/2024-01/graphql.json";

function AnimCount({ to, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * to));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(to);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString('es-ES')}{suffix}</span>;
}

const ORIG_POOLS = {
  low:  [25, 27, 28, 29, 30],
  high: [29, 32, 33, 34, 35],
};
const origPrice = (p) => {
  const hash = String(p.id || p.name).split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  const price = parseFloat(String(p.price||'0').replace(',','.'));
  if (price <= 11.5) return ORIG_POOLS.low[hash % ORIG_POOLS.low.length];
  if (price <= 13.5) return ORIG_POOLS.high[hash % ORIG_POOLS.high.length];
  return null;
};

const translateDescEs = (text) => {
  if (!text) return text;
  if (/\b(sandalia|zapato|tacón|elegante|diseño|colección|mujer|calidad|estilo|perfecta|alpargata|cuña|tiras|hebilla|purpurina)\b/i.test(text)) return text;
  return text
    // Phrase-level (must come before word-level)
    .replace(/that has no business looking this good/gi,'que no debería lucir tan bien')
    .replace(/brings the festival every time you walk in/gi,'trae la fiesta cada vez que la llevas')
    .replace(/every time you walk in/gi,'cada vez que entras')
    .replace(/brings the festival/gi,'trae la fiesta')
    .replace(/all the proof you need/gi,'toda la prueba que necesitas')
    .replace(/when done right[,]?\s*is actually/gi,'cuando se hace bien, es realmente')
    .replace(/is all the proof you need that/gi,'es toda la prueba de que')
    .replace(/the kind of shoe that/gi,'el tipo de zapato que')
    .replace(/the kind of heel that/gi,'el tipo de tacón que')
    .replace(/you[''`]ve been looking for/gi,'has estado buscando')
    .replace(/makes every outfit better/gi,'mejora cualquier look')
    .replace(/wear it your way/gi,'llévalo a tu manera')
    .replace(/dressed up or down/gi,'para combinar de mil formas')
    .replace(/from day to night/gi,'del día a la noche')
    .replace(/goes with everything/gi,'combina con todo')
    .replace(/built for the woman who/gi,'hecho para la mujer que')
    .replace(/made for the woman who/gi,'hecho para la mujer que')
    .replace(/turn heads/gi,'hacer cabezas girar')
    .replace(/step into/gi,'entra en')
    .replace(/walk in confidence/gi,'camina con confianza')
    .replace(/walk with confidence/gi,'camina con confianza')
    .replace(/you need that/gi,'que necesitas de que')
    .replace(/is actually/gi,'es realmente')
    // Colours
    .replace(/\bSilver\b/g,'Plateado').replace(/\bGolden?\b/gi,'Dorado').replace(/\bBlack\b/g,'Negro').replace(/\bWhite\b/g,'Blanco').replace(/\bRed\b/g,'Rojo').replace(/\bPink\b/g,'Rosa').replace(/\bNude\b/g,'Nude').replace(/\bBrown\b/g,'Marrón').replace(/\bGreen\b/g,'Verde').replace(/\bBlue\b/g,'Azul').replace(/\bPurple\b/g,'Morado').replace(/\bCoral\b/g,'Coral').replace(/\bCamel\b/g,'Camel').replace(/\bGlitter\b/gi,'brillo').replace(/\bSparkle\b/gi,'destellos').replace(/\bsparkling\b/gi,'con destellos').replace(/\bSparkly\b/gi,'brillante').replace(/\bSequin(ned)?\b/gi,'con lentejuelas').replace(/\bRhinestone\b/gi,'con cristales').replace(/\bCrystal\b/gi,'cristal')
    // Shoe types
    .replace(/\bespadrille\b/gi,'alpargata').replace(/\bstilettos?\b/gi,'stiletto').replace(/\bheels?\b/gi,'tacones').replace(/\bheel\b/gi,'tacón').replace(/\bsandals?\b/gi,'sandalias').replace(/\bplatform\b/gi,'plataforma').replace(/\bblock heel\b/gi,'tacón bloque').replace(/\bkitten heel\b/gi,'tacón medio').replace(/\bwedge\b/gi,'cuña').replace(/\bstrappy\b/gi,'con tiras').replace(/\bslingback\b/gi,'slingback').replace(/\bmule\b/gi,'mule').replace(/\bpump\b/gi,'salón').replace(/\bflat\b/gi,'plano').replace(/\bboot\b/gi,'bota').replace(/\bsneaker\b/gi,'zapatilla').replace(/\bballerina\b/gi,'bailarina').replace(/\bmule\b/gi,'mule').replace(/\bstrap\b/gi,'tira').replace(/\bbuckle\b/gi,'hebilla').replace(/\bbow\b/gi,'lazo').replace(/\bblock\b/gi,'bloque')
    // Adjectives
    .replace(/\belegant\b/gi,'elegante').replace(/\bchic\b/gi,'chic').replace(/\bluxury\b/gi,'de lujo').replace(/\bpremium\b/gi,'premium').replace(/\bstunning\b/gi,'impresionante').replace(/\bbeautiful\b/gi,'precioso').replace(/\bperfect\b/gi,'perfecto').replace(/\bgorgeous\b/gi,'espectacular').replace(/\bsophisticated\b/gi,'sofisticado').replace(/\btimeless\b/gi,'atemporal').replace(/\bversatile\b/gi,'versátil').replace(/\bcomfort(able)?\b/gi,'cómodo').replace(/\bbold\b/gi,'atrevido').replace(/\bdelicate\b/gi,'delicado').replace(/\bminimal(ist)?\b/gi,'minimalista').replace(/\bclassic\b/gi,'clásico').replace(/\bmodern\b/gi,'moderno').replace(/\bsleek\b/gi,'refinado').replace(/\bsharp\b/gi,'marcado').replace(/\bflirty\b/gi,'coqueto').replace(/\bplayful\b/gi,'divertido').replace(/\bsubtle\b/gi,'sutil').replace(/\bfeminine\b/gi,'femenino').replace(/\bpowerful\b/gi,'poderoso').replace(/\bconfident\b/gi,'segura').replace(/\bunforgettable\b/gi,'inolvidable').replace(/\bextraordinary\b/gi,'extraordinario').replace(/\bexceptional\b/gi,'excepcional').replace(/\bprecise\b/gi,'preciso').replace(/\bclean\b/gi,'limpio').replace(/\bshiny\b/gi,'brillante').replace(/\bglam(orous)?\b/gi,'glamuroso')
    // Nouns
    .replace(/\bstyle\b/gi,'estilo').replace(/\bdesign\b/gi,'diseño').replace(/\bcollection\b/gi,'colección').replace(/\bsimplicity\b/gi,'sencillez').replace(/\bintelligence\b/gi,'inteligencia').replace(/\bproof\b/gi,'prueba').replace(/\boutfit\b/gi,'look').replace(/\blook\b/gi,'look').replace(/\bmoment\b/gi,'momento').replace(/\bseason\b/gi,'temporada').replace(/\bdetail\b/gi,'detalle').replace(/\bquality\b/gi,'calidad').replace(/\bcraft\b/gi,'artesanía').replace(/\bsilhouette\b/gi,'silueta').replace(/\bstatement\b/gi,'protagonismo').replace(/\bwardrobe\b/gi,'armario').replace(/\bessential\b/gi,'imprescindible').replace(/\bfestival\b/gi,'fiesta')
    // Occasions
    .replace(/\bnight out\b/gi,'salida nocturna').replace(/\bevening\b/gi,'noche').replace(/\bparty\b/gi,'fiesta').replace(/\bspecial occasion\b/gi,'ocasión especial').replace(/\bwedding\b/gi,'boda').replace(/\boffice\b/gi,'oficina').replace(/\bcasual\b/gi,'casual').replace(/\bformal\b/gi,'formal').replace(/\bScandinavian\b/gi,'escandinavo')
    // Connectors & verbs
    .replace(/\bwith\b/gi,'con').replace(/\bthat\b/gi,'que').replace(/\bbrings?\b/gi,'trae').replace(/\bwalk\b/gi,'camina').replace(/\bmeet\b/gi,'conoce').replace(/\bneed\b/gi,'necesitas');
};

const fetchCollection = async (collectionId) => {
  const query = `{collection(id:"gid://shopify/Collection/${collectionId}"){products(first:250){edges{node{id handle title descriptionHtml priceRange{minVariantPrice{amount}}images(first:4){edges{node{url}}}media(first:10){edges{node{mediaContentType ...on Video{sources{url mimeType}previewImage{url}}}}}variants(first:20){edges{node{id title quantityAvailable}}}metafields(identifiers:[{namespace:"custom",key:"art_number"},{namespace:"custom",key:"measurements"},{namespace:"custom",key:"occasion"}]){key value}}}}}}`;
  try {
    const res = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    const edges = data?.data?.collection?.products?.edges || [];
    return edges.map(e => {
      const node = e.node;
      const price = parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2).replace(".", ",");
      const images = node.images.edges.map(i => i.node.url);
      const videos = (node.media?.edges || [])
        .filter(e => e.node.mediaContentType === 'VIDEO')
        .map(e => ({
          url: e.node.sources?.find(s => s.mimeType === 'video/mp4')?.url || e.node.sources?.[0]?.url,
          preview: e.node.previewImage?.url || null,
        }))
        .filter(v => v.url);
      const variants = node.variants.edges.map(v => v.node);
      const available = variants.filter(v => v.quantityAvailable === null || v.quantityAvailable > 0);
      const toSize = v => { const m = v.title.match(/\b(\d{2})\b/); return m ? m[1] : null; };
      const sizes = [...new Set(available.map(toSize).filter(Boolean))];
      const allVariantSizes = [...new Set(variants.map(toSize).filter(Boolean))];
      const soldOutSizes = allVariantSizes.filter(s => !sizes.includes(s));
      // Parse metafields
      const mfs = {};
      (node.metafields || []).forEach(m => { if (m) mfs[m.key] = m.value; });
      // Parse description HTML → plain text + care instructions
      const dHtml = node.descriptionHtml || '';
      const firstP = dHtml.match(/<p>([\s\S]*?)<\/p>/);
      const careMatch = dHtml.match(/(?:Care|Cuidados?):<\/strong>\s*([\s\S]*?)<\/p>/i);
      const descText = translateDescEs(firstP ? firstP[1].replace(/<[^>]+>/g, '') : node.title);
      const rawCare = careMatch ? careMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const careText = rawCare
        .replace(/Wipe clean with a soft damp cloth/gi, 'Limpiar con un paño suave húmedo')
        .replace(/Wipe clean with a soft cloth/gi, 'Limpiar con un paño suave')
        .replace(/Wipe clean with a damp cloth/gi, 'Limpiar con un paño húmedo')
        .replace(/Wipe with a soft damp cloth/gi, 'Limpiar con un paño suave húmedo')
        .replace(/Wipe with a damp cloth/gi, 'Limpiar con un paño húmedo')
        .replace(/Wipe clean with dry cloth/gi, 'Limpiar con un paño seco')
        .replace(/Wipe with a dry cloth/gi, 'Limpiar con un paño seco')
        .replace(/Avoid prolonged exposure to water/gi, 'Evitar la exposición prolongada al agua')
        .replace(/Store upright in a cool,?\s*dry place/gi, 'Guardar en posición vertical en un lugar fresco y seco')
        .replace(/Use a heel protector on delicate floors/gi, 'Usar protectores de tacón en suelos delicados')
        .replace(/Use heel protectors on delicate floors/gi, 'Usar protectores de tacón en suelos delicados')
        .replace(/Allow to dry naturally away from heat/gi, 'Dejar secar de forma natural lejos del calor')
        .replace(/Allow to dry naturally/gi, 'Dejar secar de forma natural')
        .replace(/Do not expose to (direct )?heat/gi, 'No exponer al calor directo')
        .replace(/Do not machine wash/gi, 'No lavar a máquina')
        .replace(/Do not wash/gi, 'No lavar')
        .replace(/Spot clean only/gi, 'Limpiar solo manchas')
        .replace(/Keep away from water/gi, 'Evitar el contacto con agua')
        .replace(/Avoid (prolonged )?contact with water/gi, 'Evitar el contacto con agua')
        .replace(/Avoid water/gi, 'Evitar el contacto con agua')
        .replace(/Store in a cool,?\s*dry place/gi, 'Guardar en lugar fresco y seco')
        .replace(/Store in a dry place/gi, 'Guardar en lugar seco')
        .replace(/Store in a cool place/gi, 'Guardar en lugar fresco')
        .replace(/Keep in a dust bag/gi, 'Guardar en bolsa antipolvo')
        .replace(/Air dry/gi, 'Secar al aire')
        .replace(/Do not expose to direct sunlight/gi, 'No exponer a la luz solar directa')
        .replace(/Avoid direct sunlight/gi, 'Evitar la luz solar directa')
        .replace(/Use a soft brush/gi, 'Usar un cepillo suave')
        .replace(/Brush off any (excess )?dirt/gi, 'Cepillar la suciedad')
        .replace(/Apply (a )?waterproof spray/gi, 'Aplicar spray impermeabilizante')
        .replace(/Waterproof spray recommended/gi, 'Se recomienda spray impermeabilizante')
        .replace(/Use shoe polish/gi, 'Usar betún para zapatos')
        .replace(/Polish with (a )?matching shoe cream/gi, 'Lustrar con crema de zapatos del mismo color')
        .replace(/Condition with (a )?leather conditioner/gi, 'Tratar con acondicionador de cuero')
        .replace(/Use a shoe tree/gi, 'Usar una horma para zapatos')
        .replace(/Stuff with tissue (paper )?to maintain shape/gi, 'Rellenar con papel para mantener la forma')
        .replace(/Stuff with tissue/gi, 'Rellenar con papel para mantener la forma')
        .replace(/Handle with care/gi, 'Manipular con cuidado')
        .replace(/Avoid sharp objects/gi, 'Evitar objetos punzantes')
        .replace(/Clean with a damp sponge/gi, 'Limpiar con una esponja húmeda')
        .replace(/Use a suede brush/gi, 'Usar un cepillo para ante')
        .replace(/Protect with suede spray/gi, 'Proteger con spray para ante');
      // Parse measurements string e.g. "Heel: 8cm · Platform: 2cm · Occasion: Work"
      const measStr = (mfs['measurements'] || '')
        .replace(/\bHeel:/gi, 'Tacón:')
        .replace(/\bPlatform:/gi, 'Plataforma:')
        .replace(/\bOccasion:/gi, 'Ocasión:')
        .replace(/\bHeight:/gi, 'Altura:')
        .replace(/\bWidth:/gi, 'Anchura:')
        .replace(/\bWork\b/g, 'Trabajo')
        .replace(/\bEvening\b/g, 'Noche')
        .replace(/\bParty\b/g, 'Fiesta')
        .replace(/\bWeekend\b/g, 'Fin de semana')
        .replace(/\bCasual\b/g, 'Casual');
      const heelM = measStr.match(/Tac[oó]n:\s*([\d.]+cm)/i) || (mfs['measurements']||'').match(/Heel:\s*([\d.]+cm)/i);
      const platM = measStr.match(/Plataforma:\s*([\d.]+cm)/i) || (mfs['measurements']||'').match(/Platform:\s*([\d.]+cm)/i);
      const artNumber = mfs['art_number'] || '';
      return {
        id: node.id, shopifyId: node.id,
        name: node.title, handle: node.handle,
        price, images, videos,
        photo: images.length > 0, photoUrl: images[0] || null,
        sizes, soldOutSizes, variants,
        color: inferColor(artNumber || node.title),
        colors: ["#111"], cat: "COLECCION", tag: null,
        artNumber,
        descText,
        careText,
        heelHeight: heelM ? heelM[1] : '',
        platform: platM ? platM[1] : '',
        occasion: (mfs['occasion']||'').replace(/\bEvening\b/gi,'Noche').replace(/\bParty\b/gi,'Fiesta').replace(/\bWork\b/gi,'Trabajo').replace(/\bWeekend\b/gi,'Fin de semana').replace(/\bCasual\b/gi,'Casual').replace(/\bFormal\b/gi,'Formal').replace(/\bBridal\b/gi,'Nupcial').replace(/\bSummer\b/gi,'Verano').replace(/\bWinter\b/gi,'Invierno'),
        // legacy compat
        desc: descText, colour: '', composition: '',
        measurements: measStr,
      };
    });
  } catch { return []; }
};

const inferColor = (title) => {
  const t = (title || '').toLowerCase();
  if (/negro|negra|black/.test(t)) return 'NEGRO';
  if (/blanco|blanca|white/.test(t)) return 'BLANCO';
  if (/dorad[oa]|gold|champagne/.test(t)) return 'DORADO';
  if (/plat[ea]ad[oa]|silver|plata/.test(t)) return 'PLATA';
  if (/ros[ao]|pink|fucsia/.test(t)) return 'ROSA';
  if (/coral|roj[ao]/.test(t)) return 'CORAL';
  if (/verde|green/.test(t)) return 'VERDE';
  if (/camel|beige/.test(t)) return 'CAMEL';
  if (/multicolor|leopardo|multi/.test(t)) return 'MULTI';
  return 'NEGRO';
};

const go = (url) => { window.open(url, '_blank'); };
const handleConfirmOrder = (cartItems, total, freeShip) => {
  const msg = buildOrderMsg(cartItems, total, freeShip);
  const link = "https://api.whatsapp.com/send?phone=" + WA_NUM + "&text=" + msg;
  trackTikTokEvent('Contact', {
    content_name: 'Order via WhatsApp',
    value: total,
    currency: 'EUR',
  });
  window.open(link, "_blank");
};
const waLink = (msg) => "https://api.whatsapp.com/send?phone=" + WA_NUM + "&text=" + (msg || "Hola! Me interesan los zapatos de Fady Calzados");

const buildOrderMsg = (cartItems, total, freeShip) => {
  const codFee = 1.00;
  const shippingFee = freeShip ? 0 : 3.99;
  const finalTotal = total + shippingFee + codFee;
  const productos = cartItems.map(i => "• " + i.name + " — Talla " + i.selSize).join("%0A");
  const totalStr = total.toFixed(2).replace(".", ",");
  const finalStr = finalTotal.toFixed(2).replace(".", ",");
  const envio = freeShip ? "GRATIS ✅" : "3,99 €";
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

      {/* COLOR SWATCHES — always visible */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        <button className={"swatch-btn"+(colorFilter===null?" sel":"")}
          title="Todos"
          onClick={()=>setColorFilter(null)}
          style={{background:"linear-gradient(135deg,#111 33%,#C9A84C 33%,#C9A84C 66%,#C0C0C0 66%)",borderColor:colorFilter===null?"#111":"transparent"}}/>
        {UNIQUE_COLORS.filter(c=>COLOR_HEX[c]).map(c=>(
          <button key={c} className={"swatch-btn"+(colorFilter===c?" sel":"")}
            title={COLOR_LABELS[c]||c}
            onClick={()=>setColorFilter(colorFilter===c?null:c)}
            style={{background:COLOR_HEX[c]==='#f0f0f0'?`repeating-linear-gradient(45deg,#ddd 0,#ddd 3px,#f0f0f0 3px,#f0f0f0 6px)`:COLOR_HEX[c],borderColor:colorFilter===c?"#111":"rgba(0,0,0,0.12)"}}/>
        ))}
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

const SITE_URL = "https://www.fadycalzados.com";
const BASE_TITLE = "Fady Calzados | Tacones y Zapatos de Mujer - Envío 24h España";
const BASE_DESC = "Descubre nuestra colección de tacones y zapatos de mujer. Envío express 24-48h. Pago contra reembolso disponible. Envío gratis en compra de 3 pares.";
const OG_IMAGE = "https://cdn.shopify.com/s/files/1/1022/4546/6454/files/27ac9766-3605-4848-b3c7-56ed5e91c325.jpg?v=1777482407";

function SEO({ product }) {
  if (product) {
    const title = `${product.name} | Fady Calzados`;
    const desc = product.desc
      ? `${product.desc} Tallas ${(product.sizes||[]).join(", ")}. Envío 24h en España.`
      : BASE_DESC;
    const image = product.photoUrl || OG_IMAGE;
    const url = `${SITE_URL}/product/${product.handle || product.id}`;
    const price = product.price ? product.price.replace(",", ".") : "16.99";

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: desc,
      image,
      brand: { "@type": "Brand", name: "Fady Calzados" },
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price,
        availability: "https://schema.org/InStock",
        url,
        seller: { "@type": "Organization", name: "Fady Calzados" },
      },
    };

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="EUR" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{BASE_TITLE}</title>
      <meta name="description" content={BASE_DESC} />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={BASE_TITLE} />
      <meta property="og:description" content={BASE_DESC} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={OG_IMAGE} />
    </Helmet>
  );
}

const ANNOUNCE_MSGS = [
  "✦  ENVÍO GRATIS EN COMPRA DE 3 PARES  ✦",
  "✦  PAGO CONTRA REEMBOLSO DISPONIBLE  ✦",
];

function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const t = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setIdx(i => (i + 1) % ANNOUNCE_MSGS.length);
        setPhase("in");
      }, 480);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  const inStyle = { opacity: 1, transform: "translateY(0)" };
  const outStyle = { opacity: 0, transform: "translateY(-7px)" };

  return (
    <div style={{
      background: "#0a0a0a",
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 8,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        fontWeight: 400,
        color: "rgba(255,255,255,0.75)",
        transition: "opacity 0.48s cubic-bezier(0.4,0,0.2,1), transform 0.48s cubic-bezier(0.4,0,0.2,1)",
        ...(phase === "in" ? inStyle : outStyle),
        whiteSpace: "nowrap",
        userSelect: "none",
      }}>
        {ANNOUNCE_MSGS[idx]}
      </span>
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
  const [activeVideo, setActiveVideo] = useState(null); // index of playing video
  const touchRef = useRef(null);

  const images = product.images && product.images.filter(Boolean).length > 0
    ? product.images.filter(Boolean)
    : product.photoUrl ? [product.photoUrl] : [];
  const productVideos = product.videos || [];

  const slides = images.length > 0
    ? images.map((url, i) => ({ url, label: i === 0 ? "Principal" : i === 1 ? "Lateral" : i === 2 ? "Detalle" : "Vista "+(i+1) }))
    : [{ url: null, label: "Principal" }];

  const prev = () => setCur(c => c === 0 ? slides.length-1 : c-1);
  const next = () => setCur(c => c === slides.length-1 ? 0 : c+1);
  const onTS = e => { touchRef.current = e.touches[0].clientX; };
  const onTE = e => {
    if (!touchRef.current) return;
    const d = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? next() : prev();
    touchRef.current = null;
  };

  return (
    <div style={{width:"100%",userSelect:"none"}}>
      {/* ── Photo carousel ── */}
      <div style={{width:"100%",aspectRatio:"3/4",position:"relative",overflow:"hidden",background:"#f7f7f7"}}
        onTouchStart={onTS} onTouchEnd={onTE}>
        <Zoom3D src={slides[cur].url} alt={product.name} fallback="👠" bg={BG[product.color]||"#f9f9f9"}/>
        <button onClick={prev} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>‹</button>
        <button onClick={next} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>›</button>
        <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.28)",backdropFilter:"blur(4px)",padding:"3px 9px",borderRadius:20,fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.9)",zIndex:2}}>
          {cur+1}/{slides.length}
        </div>
      </div>

      {/* Photo thumbnails */}
      <div style={{display:"flex",gap:3,padding:"8px 12px",background:"#fcfcfc",overflowX:"auto",scrollbarWidth:"none"}}>
        {slides.map((sl,i)=>(
          <div key={i} onClick={()=>setCur(i)}
            style={{flexShrink:0,width:52,height:52,border:i===cur?"2px solid #111":"1px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",background:sl.url?"#f9f9f9":BG[product.color]||"#f9f9f9",transition:"border 0.2s"}}>
            {sl.url ? <img src={sl.url} alt={product?.name||"Fady Calzados"} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center center"}}/> : <span style={{fontSize:20,opacity:0.4}}>👠</span>}
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

      {/* ── Video strip ── */}
      {productVideos.length > 0 && (
        <div style={{borderTop:"1px solid #f0f0f0",marginTop:4,paddingTop:12,paddingBottom:4}}>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:"#888",textTransform:"uppercase",padding:"0 12px",marginBottom:8}}>
            🎥 Vídeos del producto
          </div>

          {/* Active video player */}
          {activeVideo !== null && (
            <div style={{position:"relative",width:"100%",background:"#111",marginBottom:8}}>
              <video key={productVideos[activeVideo].url}
                src={productVideos[activeVideo].url}
                poster={productVideos[activeVideo].preview||undefined}
                controls autoPlay playsInline
                style={{width:"100%",maxHeight:420,display:"block",objectFit:"contain"}}/>
              <button onClick={()=>setActiveVideo(null)}
                style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.55)",border:"none",borderRadius:"50%",width:28,height:28,color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          )}

          {/* Video thumbnails row */}
          <div style={{display:"flex",gap:8,padding:"0 12px",overflowX:"auto",scrollbarWidth:"none"}}>
            {productVideos.map((v,i)=>(
              <div key={i} onClick={()=>setActiveVideo(activeVideo===i?null:i)}
                style={{flexShrink:0,width:100,height:100,borderRadius:8,overflow:"hidden",cursor:"pointer",position:"relative",background:"#111",border:activeVideo===i?"2.5px solid #111":"2.5px solid transparent",transition:"border 0.2s"}}>
                {v.preview
                  ? <img src={v.preview} alt={"Vídeo "+(i+1)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:activeVideo===i?0.5:0.85}}/>
                  : <div style={{width:"100%",height:"100%",background:"#222"}}/>
                }
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.92)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:"0 2px 8px rgba(0,0,0,0.25)"}}>
                    {activeVideo===i?"⏸":"▶"}
                  </div>
                  <div style={{fontFamily:"Montserrat,sans-serif",fontSize:8,color:"rgba(255,255,255,0.9)",fontWeight:600,letterSpacing:"0.05em"}}>
                    VÍDEO {i+1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

const WA_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

function TikSlide({ product, video: videoProp, vidIdx=0, vidTotal=1, liked, onLike, onWa }) {
  const videoRef = useRef(null);
  const slideRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const vid = videoProp || product.videos?.[0];
  const hasVideo = !!(vid?.url);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (videoRef.current) {
        if (entry.isIntersecting) videoRef.current.play().catch(()=>{});
        else { videoRef.current.pause(); setMuted(true); }
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <div ref={slideRef} style={{height:"100vh",scrollSnapAlign:"start",scrollSnapStop:"always",position:"relative",overflow:"hidden",background:"#111",flexShrink:0}}>
      {/* Video */}
      <video ref={videoRef} muted loop playsInline preload="metadata"
        onClick={toggleMute}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",cursor:"pointer"}}
        poster={vid?.preview||undefined}>
        {hasVideo&&<source src={vid.url} type="video/mp4"/>}
      </video>

      {/* Gradient overlay */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.05) 50%,rgba(0,0,0,0.3) 100%)",pointerEvents:"none"}}/>

      {/* Top bar */}
      <div style={{position:"absolute",top:0,left:0,right:0,padding:"60px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",pointerEvents:"none"}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#fff",letterSpacing:"0.25em"}}>FADY</div>
        <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.2em"}}>@fadycalzados</div>
      </div>

      {/* Sound indicator — tap video to toggle */}
      <div onClick={toggleMute} style={{position:"absolute",top:70,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.45)",borderRadius:20,padding:"5px 14px",display:"flex",alignItems:"center",gap:6,cursor:"pointer",opacity: muted?1:0,transition:"opacity 0.4s",pointerEvents: muted?"auto":"none"}}>
        <span style={{fontSize:14}}>🔇</span>
        <span style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"#fff",letterSpacing:"0.12em"}}>TOCA PARA SONIDO</span>
      </div>

      {/* Right side — like + WhatsApp */}
      <div style={{position:"absolute",right:14,bottom:210,display:"flex",flexDirection:"column",alignItems:"center",gap:22}}>
        <button style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer"}} onClick={onLike}>
          <div style={{fontSize:30,filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.6))"}}>{liked?"❤️":"🤍"}</div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.85)"}}>Me gusta</div>
        </button>
        <button style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer"}} onClick={onWa}>
          <div style={{width:58,height:58,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 14px rgba(37,211,102,0.6)"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          </div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.85)"}}>WhatsApp</div>
        </button>
      </div>

      {/* Video counter chip — top right — only shown when product has multiple videos */}
      {vidTotal > 1 && (
        <div style={{position:"absolute",top:70,right:16,background:"rgba(0,0,0,0.52)",backdropFilter:"blur(4px)",borderRadius:20,padding:"5px 12px",fontFamily:"Montserrat,sans-serif",fontSize:9,color:"rgba(255,255,255,0.9)",letterSpacing:"0.12em",zIndex:2}}>
          VÍDEO {vidIdx+1}/{vidTotal}
        </div>
      )}

      {/* Bottom bar — name only */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 20px 44px",background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%)"}}>
        <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,color:"#fff",fontWeight:300,fontStyle:"italic",lineHeight:1.2}}>{product.name}</div>
        {vidTotal > 1 && (
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:8,color:"rgba(255,255,255,0.45)",letterSpacing:"0.2em",marginTop:4}}>
            DESLIZA ARRIBA PARA VER MÁS VÍDEOS
          </div>
        )}
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
  const [waChatOpen, setWaChatOpen] = useState(false);
  const [waChatDismissed, setWaChatDismissed] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState([]);
  const [codSelected, setCodSelected] = useState(true);
  const [showTikTok, setShowTikTok] = useState(false);
  const [tikLiked, setTikLiked] = useState([]);
  const [tikSizeOpen, setTikSizeOpen] = useState(false);
  const [tikSelSize, setTikSelSize] = useState(null);
  const [tikProduct, setTikProduct] = useState(PRODUCTS[0]);
  const [tikStartIndex, setTikStartIndex] = useState(0);
  const collRef = useRef(null);
  const vidGridRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [videoProducts, setVideoProducts] = useState([]);
  const [sizeFilter, setSizeFilter] = useState(() => { const s = searchParams.get('talla'); return s ? parseInt(s) : null; });
  const [colorFilter, setColorFilter] = useState(() => searchParams.get('color') || null);
  const [heelFilter, setHeelFilter] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selColors, setSelColors] = useState([]);
  const [selSizes, setSelSizes] = useState([]);
  const [selHeights, setSelHeights] = useState([]);
  const tikFeedRef = useRef(null);
  const tikSwipeY = useRef(null);
  const tikHistoryPushed = useRef(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fady_rv') || '[]'); } catch { return []; }
  });
  const [returning, setReturning] = useState(false);
  const [returningDismissed, setReturningDismissed] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const heroTextRef = useRef(null);
  const [loadingDone, setLoadingDone] = useState(false);
  const [eyebrowText, setEyebrowText] = useState('');
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const rafRef = useRef(null);

  // Push a fake history entry when the modal opens so the browser's
  // back swipe closes the modal instead of leaving the site.
  useEffect(() => {
    if (showTikTok) {
      window.history.pushState({ tikModal: true }, '');
      tikHistoryPushed.current = true;
      const onPop = () => { tikHistoryPushed.current = false; setShowTikTok(false); };
      window.addEventListener('popstate', onPop, { once: true });
      return () => window.removeEventListener('popstate', onPop);
    }
  }, [showTikTok]);

  const closeTikModal = () => {
    if (tikHistoryPushed.current) {
      tikHistoryPushed.current = false;
      window.history.back(); // pops our pushed entry → popstate fires → setShowTikTok(false)
    } else {
      setShowTikTok(false);
    }
  };

  const cartCount = cart.length;

  // Extract unique heel heights from measurements
  const HEEL_HEIGHTS = [...new Set(PRODUCTS.map(p => {
    const m = p.measurements.match(/(\d+)cm/);
    return m ? m[1]+"cm" : null;
  }).filter(Boolean))].sort((a,b) => parseInt(a)-parseInt(b));

  // (UNIQUE_COLORS now derived from live displayProducts below)

  const { productId } = useParams();
  const navigate = useNavigate();

  // Filter products
  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : PRODUCTS;
  const product = productId ? (displayProducts.find(p => (p.handle || String(p.id)) === productId) ?? null) : null;

  if (sizeFilter && displayProducts.length > 0) {
    console.log("[FADY] sizeFilter active:", sizeFilter, typeof sizeFilter);
    console.log("[FADY] First product sizes array:", displayProducts[0].sizes);
  }
  const filtered = displayProducts.filter(p => {
    if (colorFilter && p.color !== colorFilter) return false;
    if (sizeFilter) {
      const pSizes = (p.sizes && p.sizes.length > 0) ? p.sizes : (p.shopifyId ? [] : SIZES.map(String));
      return pSizes.some(s => parseInt(s) === sizeFilter);
    }
    return true;
  });

  const anyFilter = !!(sizeFilter || colorFilter || heelFilter);

  // Sync filters → URL params
  useEffect(() => {
    const params = {};
    if (sizeFilter) params.talla = sizeFilter;
    if (colorFilter) params.color = colorFilter;
    setSearchParams(params, { replace: true });
  }, [sizeFilter, colorFilter]);

  const COLORS_F = [
    {n:"NEGRO",h:"#111"},{n:"BLANCO",h:"#f0f0f0"},{n:"DORADO",h:"#C9A84C"},
    {n:"PLATA",h:"#C0C0C0"},{n:"ROSA",h:"#E91E8C"},{n:"CORAL",h:"#FF6347"},
    {n:"VERDE",h:"#2E8B57"},{n:"CAMEL",h:"#C19A6B"},{n:"MULTI",h:null}
  ];

  const UNIQUE_COLORS = [...new Set(displayProducts.map(p => p.color))].filter(Boolean);
  const HEIGHTS_F = ["Bajo (hasta 5cm)","Medio (5-8cm)","Alto (8cm+)"];
  const filterCount = (sizeFilter ? 1 : 0) + (colorFilter ? 1 : 0) + selHeights.length;
  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(String(item.price).replace(",", ".")), 0);
  const freeShipping = cartCount >= 3;
  const pairsNeeded = Math.max(0, 3 - cartCount);

  // Loading screen
  useEffect(() => {
    const t = setTimeout(() => setLoadingDone(true), 800);
    return () => clearTimeout(t);
  }, []);


  // Returning visitor detection
  useEffect(() => {
    try {
      const been = localStorage.getItem('fady_been_here');
      if (been) { setTimeout(() => setReturning(true), 1800); }
      else localStorage.setItem('fady_been_here', '1');
    } catch {}
  }, []);

  // Nav hide on scroll down / show on scroll up
  useEffect(() => {
    const h = () => {
      const y = window.scrollY;
      if (navRef.current) {
        if (y > lastScrollY.current && y > 80) {
          navRef.current.style.transform = 'translateY(-100%)';
        } else {
          navRef.current.style.transform = 'translateY(0)';
        }
      }
      lastScrollY.current = y;
      if (heroTextRef.current) heroTextRef.current.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Typewriter eyebrow
  useEffect(() => {
    if (!loadingDone) return;
    const FULL = 'Fady Calzados · SS25';
    let i = 0;
    const t = setInterval(() => { setEyebrowText(FULL.slice(0, ++i)); if (i >= FULL.length) clearInterval(t); }, 55);
    return () => clearInterval(t);
  }, [loadingDone]);

  // Page transition on route change
  useEffect(() => {
    setPageTransition(true);
    const t = setTimeout(() => setPageTransition(false), 350);
    return () => clearTimeout(t);
  }, [productId]);

  // Save recently viewed product to localStorage
  useEffect(() => {
    if (!product) return;
    setRecentlyViewed(prev => {
      const next = [
        { id: product.id, name: product.name, price: product.price, photoUrl: product.photoUrl, handle: product.handle||product.id },
        ...prev.filter(r => r.id !== product.id)
      ].slice(0, 7);
      try { localStorage.setItem('fady_rv', JSON.stringify(next)); } catch {}
      return next;
    });
  }, [productId]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    const run = () => document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
    run();
    const t = setTimeout(run, 1200);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [shopifyProducts]);

  useEffect(() => {
    const t = setTimeout(() => setWaChatOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120);
    Promise.all([
      fetchCollection('695515939158'),
      fetchCollection('695515382102'),
      fetchCollection('700405678422'),
    ]).then(([styloProds, fadyProds, videoProds]) => {
      const all = [...styloProds, ...fadyProds];
      if (all.length > 0) setShopifyProducts(all);
      if (videoProds.length > 0) setVideoProducts(videoProds);
    }).catch(err => console.log("Shopify error:", err));
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => { window.removeEventListener("scroll", fn); };
  }, []);

  useEffect(() => {
    if (showTikTok && tikFeedRef.current) {
      setTimeout(() => {
        if (tikFeedRef.current) tikFeedRef.current.scrollTop = tikStartIndex * window.innerHeight;
      }, 30);
    }
  }, [showTikTok, tikStartIndex]);

  useEffect(() => {
    if (!cartOpen) return;
    window.history.pushState({ cart: true }, '', window.location.href);
    const onPop = () => setCartOpen(false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [cartOpen]);

  const handleShopifyCheckout = (prod, size) => {
    if (!size) return;
    const variant = prod.variants?.find(v => v.title.includes(String(size)));
    if (variant) {
      const numericId = String(variant.id).split("/").pop();
      window.open("https://checkout.fadycalzados.com/cart/" + numericId + ":1", "_blank");
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
      return "https://checkout.fadycalzados.com/cart/" + lineItems.join("+");
    }
    return "https://checkout.fadycalzados.com/cart";
  };

  const fireConfetti = () => {
    const colors = ['#111111','#c9a84c','#e74c3c','#3498db','#f39c12','#9b59b6','#1abc9c','#e91e8c','#ff6b35','#2ecc71'];
    const particles = Array.from({length:70},(_,i)=>{
      const angle = Math.random()*Math.PI*2;
      const dist = 80 + Math.random()*220;
      const cx = Math.cos(angle)*dist;
      const cy = Math.sin(angle)*dist - (60 + Math.random()*120);
      const isRect = Math.random()>0.4;
      return {
        id:i,
        color:colors[Math.floor(Math.random()*colors.length)],
        width:isRect?(5+Math.random()*7):(4+Math.random()*5),
        height:isRect?(3+Math.random()*4):(4+Math.random()*5),
        borderRadius:isRect?'1px':'50%',
        cx:`${cx}px`, cy:`${cy}px`,
        cr:`${(Math.random()-0.5)*720}deg`,
        cd:`${0.7+Math.random()*0.7}s`,
        cdelay:`${Math.random()*0.15}s`,
      };
    });
    setConfettiParticles(particles);
    setTimeout(()=>setConfettiParticles([]),1800);
  };

  const addToCart = (p, size) => {
    if (!size) return;
    setCart(prev => [...prev, {...p, selSize:size, cartId:Date.now()}]);
    fireConfetti();
    trackTikTokEvent('AddToCart', {
      content_id: p.id,
      content_name: p.title,
      currency: 'EUR',
      value: parseFloat(p.price),
      quantity: 1,
    });
    setQuickPopup(null);
    navigate("/");
    setTimeout(() => setCartOpen(true), 120);
    setUpsellVisible(true);
    setTimeout(() => setUpsellVisible(false), 6000);
  };

  const addFromTik = () => {
    if (!tikSelSize) return;
    setCart(prev => [...prev, {...tikProduct, selSize:tikSelSize, cartId:Date.now()}]);
    setTikSizeOpen(false);
    setTikSelSize(null);
    closeTikModal();
    setCartOpen(true);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const TABS = [{key:"DESCRIPTION",label:"DESCRIPCIÓN"},{key:"COMPOSITION",label:"COMPOSICIÓN"},{key:"MEASUREMENTS",label:"MEDIDAS"}];
  const getTab = (p, t) => {
    if (!p) return "";
    if (t === "DESCRIPTION") return p.desc;
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
        @keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes prodScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes marqueeFlow{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes loadFadeIn{0%{opacity:0;letter-spacing:0.7em}100%{opacity:1;letter-spacing:0.55em}}
        @keyframes loadLine{0%{width:0;opacity:0}100%{width:40px;opacity:1}}
        @keyframes pageIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes cardIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes textShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .rebajas-shimmer{background:linear-gradient(90deg,#111 35%,rgba(160,130,60,0.7) 50%,#111 65%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:textShimmer 5s linear infinite;}
        .skeleton-card .pimg-wrap,.skeleton-line{background:linear-gradient(90deg,#efefef 25%,#e0e0e0 50%,#efefef 75%);background-size:400px 100%;animation:shimmer 1.5s infinite;border-radius:2px;}
        .pcard-loaded{animation:cardIn 0.55s cubic-bezier(0.16,1,0.3,1) both;}
        @media(hover:hover){.pcard{transform-style:preserve-3d;transition:transform 0.15s ease-out,box-shadow 0.15s ease-out;}}
        .pimg-2{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.65s ease;}
        @media(hover:hover){.pcard:hover .pimg-2{opacity:1;}}
        .page-fade{position:fixed;inset:0;background:#fff;z-index:99999;pointer-events:none;animation:pageIn 0.35s ease reverse both;}
        .swatch-btn{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:border-color 0.2s,transform 0.2s;flex-shrink:0;}
        .swatch-btn:hover{transform:scale(1.18);}
        .swatch-btn.sel{border-color:#111 !important;}
        @keyframes confettiFly{0%{transform:translate(0,0) rotate(0deg);opacity:1}100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr));opacity:0}}
        .confetti-piece{position:fixed;top:50%;left:50%;pointer-events:none;z-index:9999;border-radius:var(--cbr);animation:confettiFly var(--cd) cubic-bezier(0.25,0.46,0.45,0.94) var(--cdelay) both;}
        @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(2%,2%)}30%{transform:translate(-1%,3%)}40%{transform:translate(3%,-1%)}50%{transform:translate(-2%,2%)}60%{transform:translate(1%,-2%)}70%{transform:translate(-3%,1%)}80%{transform:translate(2%,3%)}90%{transform:translate(-1%,-1%)}}

        /* Loading screen */
        .load-screen{position:fixed;inset:0;background:#111;z-index:10000;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.5s ease,visibility 0.5s ease;}
        .load-screen.done{opacity:0;visibility:hidden;pointer-events:none;}
        .load-logo{font-family:'Cormorant Garamond',serif;font-size:clamp(24px,6vw,44px);font-weight:300;color:#fff;text-align:center;line-height:1;animation:loadFadeIn 1s cubic-bezier(0.16,1,0.3,1) forwards;}
        .load-sub{font-family:Montserrat,sans-serif;font-size:7px;letter-spacing:0.75em;font-weight:300;margin-top:8px;color:rgba(255,255,255,0.4);text-transform:uppercase;display:block;}
        .load-line{height:1px;background:#c9a84c;margin:28px auto 0;animation:loadLine 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both;}


        /* Film grain — desktop only (battery concern on mobile) */
        .grain-ov{position:fixed;inset:-50%;width:200%;height:200%;pointer-events:none;z-index:9997;opacity:0.035;animation:grain 0.4s steps(1) infinite;}
        @media(hover:none){.grain-ov{display:none;}}
        @media(prefers-reduced-motion:reduce){.grain-ov{display:none;}}

        /* cursor:none only on pointer devices */
        @media(hover:none){a,button{cursor:auto!important;}}

        /* Marquee editorial */
        .marquee-strip{overflow:hidden;border-top:1px solid #ebebeb;border-bottom:1px solid #ebebeb;padding:14px 0;background:#fff;}
        .marquee-inner{display:inline-flex;white-space:nowrap;animation:marqueeFlow 36s linear infinite;}
        .marquee-inner:hover{animation-play-state:paused;}

        /* Scroll reveal */
        [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity 0.95s cubic-bezier(0.16,1,0.3,1),transform 0.95s cubic-bezier(0.16,1,0.3,1);}
        [data-reveal].revealed{opacity:1;transform:translateY(0);}
        [data-reveal][data-d="1"]{transition-delay:0.12s;}
        [data-reveal][data-d="2"]{transition-delay:0.24s;}
        [data-reveal][data-d="3"]{transition-delay:0.36s;}
        @media(prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none;transition:none;}[data-reveal].revealed{opacity:1;transform:none;}}

        /* Lookbook */
        .lbook-item{display:flex;min-height:85svh;}
        @media(max-width:767px){.lbook-item{flex-direction:column!important;min-height:auto;}}
        .lbook-img-wrap{flex:1;overflow:hidden;position:relative;min-height:50vw;}
        @media(max-width:767px){.lbook-img-wrap{min-height:100vw;max-height:110vw;}}
        .lbook-img{width:100%;height:100%;object-fit:cover;object-position:center 20%;transition:transform 1.4s cubic-bezier(0.16,1,0.3,1);}
        @media(hover:hover){.lbook-item:hover .lbook-img{transform:scale(1.04);}}
        .lbook-text{flex:0.72;display:flex;flex-direction:column;justify-content:center;padding:clamp(40px,8vw,88px) clamp(28px,6vw,72px);background:#fcfcfc;}
        @media(max-width:767px){.lbook-text{padding:32px 22px 44px;}}
        .lbook-text h2{font-size:clamp(26px,6vw,54px)!important;}
        .lbook-text p{font-size:clamp(14px,2.2vw,18px)!important;}

        /* Loading screen */
        @media(prefers-reduced-motion:reduce){.load-screen.done{transition:none;}}

        .nav{position:sticky;top:0;left:0;right:0;z-index:50;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:#fff;border-bottom:1px solid #e8e8e8;transition:transform 0.38s cubic-bezier(0.16,1,0.3,1);}
        .nav.scrolled{background:#fff;}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;letter-spacing:0.55em;position:absolute;left:50%;transform:translateX(-50%);text-decoration:none;color:#111;white-space:nowrap;line-height:1;}
        .nav-logo span{display:block;font-family:'Montserrat',sans-serif;font-size:5.5px;letter-spacing:0.75em;font-weight:300;margin-top:4px;color:#999;text-align:center;text-transform:uppercase;}
        .nav-btn{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:none;background:none;cursor:pointer;font-size:19px;position:relative;transition:opacity 0.2s;}
        .nav-btn:hover{opacity:0.45;}
        .cart-badge{position:absolute;top:-1px;right:-1px;width:15px;height:15px;background:#111;color:#fff;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-weight:500;}

        .hero{width:100%;height:100svh;position:relative;overflow:hidden;background:#111;}
        .hero-img{width:100%;height:100%;object-fit:cover;object-position:center 40%;filter:brightness(0.72);animation:heroZoom 12s ease forwards;}
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
        .pimg-wrap{width:100%;aspect-ratio:3/4;overflow:hidden;position:relative;background:#f7f7f7;}
        .pimg{width:100%;height:100%;object-fit:cover;filter:grayscale(0.15);transition:transform 0.7s ease;}
        .pcard:hover .pimg{transform:scale(1.05);}
        .vista-rapida{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:7px 18px;background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:999px;font-family:'Montserrat',sans-serif;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:#111;cursor:pointer;opacity:0;transition:opacity 0.35s ease;}
        .pcard:hover .vista-rapida{opacity:1;}

        .pname{font-family:'Cormorant Garamond',Georgia,serif;font-size:11px;color:#111;font-weight:400;margin-bottom:6px;line-height:1.3;letter-spacing:0.25em;text-transform:uppercase;text-align:center;}
        .pprice{font-family:'Montserrat',sans-serif;font-size:10px;color:#999;font-weight:300;letter-spacing:0.2em;text-align:center;}
        .pinfo{margin-top:20px;display:flex;flex-direction:column;align-items:center;padding:0 8px;}

        .mov{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:flex-end;backdrop-filter:blur(5px);}
        .msheet{background:#fcfcfc;width:100%;max-height:93vh;overflow-y:auto;border-radius:18px 18px 0 0;animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1);}
        @media(min-width:768px){
          .mov{align-items:center;justify-content:center;}
          .msheet{width:480px;max-width:480px;max-height:88vh;border-radius:18px;}
        }
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
        .chdr{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;}
        .cbody{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;}
        .ship-bar{padding:10px 16px;background:#f8f8f8;border-bottom:1px solid rgba(0,0,0,0.05);}
        .prog{height:3px;background:#e8e8e8;border-radius:2px;overflow:hidden;margin-top:6px;}
        .prog-fill{height:100%;background:#111;border-radius:2px;transition:width 0.6s cubic-bezier(0.16,1,0.3,1);}
        .citem{display:flex;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(0,0,0,0.05);align-items:center;}

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
        .wa-chat-popup{position:fixed;bottom:90px;right:20px;width:310px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);z-index:1000;overflow:hidden;transform:scale(0.85) translateY(20px);opacity:0;pointer-events:none;transition:transform 0.25s ease,opacity 0.25s ease;}
        .wa-chat-popup.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}
        .wa-chat-hdr{background:#25D366;padding:14px 16px;display:flex;align-items:center;gap:12px;}
        .wa-chat-avatar{width:42px;height:42px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
        .wa-chat-body{padding:14px 16px 8px;}
        .wa-chat-bubble{background:#f0fdf4;border-radius:0 12px 12px 12px;padding:12px 14px;font-size:13px;color:#111;line-height:1.5;margin-bottom:12px;position:relative;}
        .wa-chat-bubble::before{content:"";position:absolute;top:0;left:-8px;border:8px solid transparent;border-right-color:#f0fdf4;border-top-color:#f0fdf4;}
        .wa-chat-btn{display:block;width:100%;padding:13px;background:#25D366;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;margin-bottom:12px;font-family:inherit;}
        .wa-chat-btn:hover{background:#20b85a;}

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

        .cftr{padding:12px 16px;border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;}
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

      <SEO product={product} />

      {/* ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* LOADING SCREEN */}
      <div className={"load-screen"+(loadingDone?" done":"")}>
        <div className="load-logo">FADY<span className="load-sub">CALZADOS</span></div>
        <div className="load-line" style={{width:40}}/>
      </div>

      {/* PAGE TRANSITION */}
      {pageTransition&&<div className="page-fade"/>}

      {/* CONFETTI */}
      {confettiParticles.map(p=>(
        <div key={p.id} className="confetti-piece" style={{
          width:p.width, height:p.height, background:p.color,
          '--cx':p.cx,'--cy':p.cy,'--cr':p.cr,'--cd':p.cd,'--cdelay':p.cdelay,'--cbr':p.borderRadius,
        }}/>
      ))}

      {/* CUSTOM CURSOR */}

      {/* FILM GRAIN */}
      <svg className="grain-ov" xmlns="http://www.w3.org/2000/svg">
        <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#g)"/>
      </svg>

      {/* NAV */}
      <nav ref={navRef} className={"nav"+(scrollY>10?" scrolled":"")}>
        <Link to="/" className="nav-logo">
          FADY
          <span>CALZADOS</span>
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <button className="nav-btn" style={{color:"#111",fontSize:18}} onClick={()=>{setTikStartIndex(0);setShowTikTok(true);}}>🎬</button>
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
          3 PARES = ENVÍO GRATIS — COMPRA 3 PARES Y EL ENVÍO ES GRATIS
        </div>
      )}

      {/* HERO — clean luxury white */}
      <div style={{width:"100%",height:"100svh",background:"#fff",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>

        {/* Ticker */}
        <div style={{background:"#111",color:"#fff",padding:"9px 0",overflow:"hidden",flexShrink:0,zIndex:2,position:"relative"}}>
          <div style={{display:"inline-flex",whiteSpace:"nowrap",animation:"tickerScroll 22s linear infinite",willChange:"transform"}}>
            {[0,1].map(k=>(
              <span key={k} style={{display:"inline-flex"}}>
                {["REBAJAS — HASTA 80% DTO.","✦ ENVÍO GRATIS AL COMPRAR 3 PARES","FADY CALZADOS — DESDE 12,99€","✦ STYLO TACONES — DESDE 10,99€","ENTREGA EXPRESS 24-48H","✦ PAGO CONTRA REEMBOLSO"].map((t,i)=>(
                  <span key={i} className="mt" style={{fontSize:9,letterSpacing:"0.28em",fontWeight:400,padding:"0 40px"}}>{t}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Central content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(24px,6vw,60px) clamp(20px,5vw,60px)",textAlign:"center",position:"relative",zIndex:1}}>

          {/* Eyebrow */}
          <p style={{fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.55em",color:"#bbb",textTransform:"uppercase",marginBottom:"clamp(20px,4vw,36px)",minHeight:"1em"}}>{eyebrowText}<span style={{opacity:eyebrowText.length<20?1:0,transition:"opacity 0.3s"}}>|</span></p>

          {/* REBAJAS — the hero */}
          <div data-reveal data-d="1" style={{overflow:"hidden",marginBottom:"clamp(16px,3vw,28px)"}}>
            <div ref={heroTextRef} className="rebajas-shimmer" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(80px,22vw,220px)",fontWeight:300,lineHeight:0.82,letterSpacing:"-0.02em",textTransform:"uppercase",fontStyle:"italic",willChange:"transform"}}>
              Rebajas
            </div>
          </div>

          {/* Divider line */}
          <div data-reveal data-d="2" style={{width:"clamp(40px,8vw,80px)",height:1,background:"#111",marginBottom:"clamp(16px,3vw,28px)"}}/>

          {/* Sub copy */}
          <p data-reveal data-d="2" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(16px,3vw,26px)",fontWeight:300,color:"#888",fontStyle:"italic",marginBottom:"clamp(32px,5vw,52px)",maxWidth:480,lineHeight:1.6}}>
            Hasta un 80% de descuento — por tiempo limitado
          </p>

          {/* CTA row */}
          <div data-reveal data-d="3" style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",justifyContent:"center"}}>
            <button
              onClick={()=>collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"})}
              style={{background:"#111",color:"#fff",border:"1px solid #111",padding:"15px 52px",fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.45em",fontWeight:400,textTransform:"uppercase",transition:"transform 0.3s cubic-bezier(0.23,1,0.32,1),background 0.2s,color 0.2s",display:"inline-block"}}
              onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)*0.22;const dy=(e.clientY-r.top-r.height/2)*0.22;e.currentTarget.style.transform=`translate(${dx}px,${dy}px)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translate(0,0)";e.currentTarget.style.background="#111";e.currentTarget.style.color="#fff";}}
              onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#111";}}
            >
              Ver Ofertas
            </button>

            {videoProducts.length > 0 && (
              <div
                onClick={()=>vidGridRef.current&&vidGridRef.current.scrollIntoView({behavior:"smooth"})}
                style={{display:"inline-flex",alignItems:"center",gap:14,cursor:"pointer"}}
                onMouseEnter={e=>{const c=e.currentTarget.querySelector('.vid-circle');const t=e.currentTarget.querySelector('.vid-tri');if(c){c.style.background="#111";c.style.borderColor="#111";}if(t)t.style.borderLeftColor="#fff";}}
                onMouseLeave={e=>{const c=e.currentTarget.querySelector('.vid-circle');const t=e.currentTarget.querySelector('.vid-tri');if(c){c.style.background="transparent";c.style.borderColor="#ccc";}if(t)t.style.borderLeftColor="#111";}}
              >
                <div className="vid-circle" style={{width:46,height:46,borderRadius:"50%",border:"1px solid #ccc",background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.25s,border-color 0.25s"}}>
                  <div className="vid-tri" style={{width:0,height:0,borderTop:"7px solid transparent",borderBottom:"7px solid transparent",borderLeft:"13px solid #111",marginLeft:4,transition:"border-left-color 0.25s"}}/>
                </div>
                <div style={{textAlign:"left"}}>
                  <div className="mt" style={{fontSize:"8px",letterSpacing:"0.32em",color:"#bbb",textTransform:"uppercase",lineHeight:1.6}}>Compra a través de vídeos</div>
                  <div className="cg" style={{fontSize:15,color:"#111",fontWeight:300,fontStyle:"italic",lineHeight:1.2}}>Ver nuestra colección</div>
                </div>
              </div>
            )}
          </div>

          {/* Prices — subtle bottom */}
          <div data-reveal data-d="3" style={{display:"flex",alignItems:"center",gap:20,marginTop:"clamp(36px,6vw,60px)",flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{textAlign:"center"}}>
              <div className="cg" style={{fontSize:"clamp(18px,3vw,26px)",color:"#111",fontWeight:300,lineHeight:1}}>Desde 12,99€</div>
              <div className="mt" style={{fontSize:"7px",letterSpacing:"0.4em",color:"#ccc",marginTop:5,textTransform:"uppercase"}}>Fady Calzados</div>
            </div>
            <div style={{width:1,height:32,background:"#e8e8e8"}}/>
            <div style={{textAlign:"center"}}>
              <div className="cg" style={{fontSize:"clamp(18px,3vw,26px)",color:"#111",fontWeight:300,lineHeight:1}}>Desde 10,99€</div>
              <div className="mt" style={{fontSize:"7px",letterSpacing:"0.4em",color:"#ccc",marginTop:5,textTransform:"uppercase"}}>Stylo Tacones</div>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE STRIP */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[0,1].map(k=>(
            <span key={k} style={{display:"inline-flex"}}>
              {["Fady Calzados","Vitoria-Gasteiz","Desde 2010","+30.000 Seguidoras","Calidad Premium","Nueva Colección SS25","Envíos a toda España","Hecho con amor","Tres hermanos","Una pasión"].map((t,i)=>(
                <span key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(15px,2.8vw,22px)",fontWeight:300,fontStyle:"italic",color:"#aaa",padding:"0 36px",letterSpacing:"0.04em"}}>— {t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* COLECCIÓN EN VÍDEO — visible grid */}
      {/* SCROLLING PRODUCT BAR */}
      {displayProducts.length > 0 && (
        <div style={{overflow:"hidden",background:"#f0e6d8",borderTop:"1px solid rgba(139,98,64,0.18)",borderBottom:"1px solid rgba(139,98,64,0.18)",padding:"22px 0"}}>
          <div style={{display:"inline-flex",animation:"prodScroll 32s linear infinite",willChange:"transform",gap:0}}>
            {[...displayProducts.slice(0,6),...displayProducts.slice(0,6)].map((p,i)=>(
              <div key={i} style={{width:150,flexShrink:0,padding:"0 14px",textAlign:"center",borderRight:"1px solid rgba(139,98,64,0.14)"}}>
                <div style={{width:122,height:150,margin:"0 auto 10px",overflow:"hidden",background:"#e8d9c4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {p.photoUrl
                    ? <img src={p.photoUrl} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <span style={{fontSize:44,opacity:0.25}}>👠</span>
                  }
                </div>
                <div className="cg" style={{fontSize:10,letterSpacing:"0.18em",color:"#2c1a0e",textTransform:"uppercase",marginBottom:3,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div className="mt" style={{fontSize:10,color:"#8B6240",fontWeight:400}}>{p.price} €</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {/* SKELETON while Shopify loads */}
      {shopifyProducts.length === 0 && (
        <div className="pgrid">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="pcard skeleton-card" style={{pointerEvents:"none"}}>
              <div className="pimg-wrap"/>
              <div className="pinfo">
                <div className="skeleton-line" style={{height:11,width:"65%",margin:"0 auto 8px"}}/>
                <div className="skeleton-line" style={{height:9,width:"40%",margin:"0 auto"}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pgrid">
        {filtered.map((p,idx)=>(
          <div key={p.id} className="pcard pcard-loaded"
            style={{animationDelay:`${Math.min(idx*0.06,0.42)}s`}}
            onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-0.5)*14;const y=((e.clientY-r.top)/r.height-0.5)*-14;e.currentTarget.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';}}>
            <button style={{position:"absolute",top:10,right:12,fontSize:14,cursor:"pointer",zIndex:3,border:"none",background:"none",color:wished.includes(p.id)?"#111":"rgba(0,0,0,0.2)",transition:"all 0.2s"}}
              onClick={e=>{e.stopPropagation();setWished(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id]);}}>
              {wished.includes(p.id)?"♥":"♡"}
            </button>
            <Link to={`/product/${p.handle||p.id}`} style={{display:"block",textDecoration:"none",color:"inherit"}}
              onClick={()=>{setSelSize(null);setActiveTab("DESCRIPTION");}}>
              {p.tag&&<div className="mt" style={{position:"absolute",top:12,left:12,fontSize:7,letterSpacing:"0.25em",color:"#888",zIndex:2,textTransform:"uppercase"}}>{p.tag}</div>}
              {!p.tag && p.sizes && p.sizes.length > 0 && p.sizes.length <= 2 && (
                <div style={{position:"absolute",top:12,left:12,background:"#111",color:"#fff",fontFamily:"Montserrat,sans-serif",fontSize:"6.5px",letterSpacing:"0.22em",padding:"4px 9px",textTransform:"uppercase",zIndex:2}}>Últimas unidades</div>
              )}
              <div className="pimg-wrap" style={{position:"relative"}}>
                {p.photoUrl
                  ? <><img src={p.photoUrl} alt={p.name} className="pimg"/>
                      {p.images&&p.images[1]&&<img src={p.images[1]} alt={p.name} className="pimg pimg-2"/>}</>
                  : p.photo&&HEEL
                    ? <img src={HEEL} alt={p.name} className="pimg"/>
                    : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(48px,10vw,72px)",opacity:0.3}}>👠</div>}
                <div className="vista-rapida">Vista Rápida</div>
              </div>
              <div className="pinfo">
                <div className="pname cg">{p.name}</div>
                <div className="pprice mt" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  {origPrice(p)&&<span style={{textDecoration:"line-through",color:"#ccc",fontSize:9}}>{origPrice(p)} €</span>}
                  <span style={{color:origPrice(p)?"#c0392b":"#999"}}>{p.price} €</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* EDITORIAL SPOTLIGHT */}
      {shopifyProducts.length > 0 && (()=>{const sp=shopifyProducts[0];return(
        <div data-reveal style={{display:"flex",flexDirection:"column",background:"#f7f5f2",borderTop:"1px solid #ebebeb"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"clamp(320px,55vw,580px)"}}>
            <div style={{overflow:"hidden",position:"relative"}}>
              {sp.photoUrl
                ? <img src={sp.photoUrl} alt={sp.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center bottom",transition:"transform 0.9s ease"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,opacity:0.2}}>👠</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"clamp(28px,6vw,72px)"}}>
              <div className="mt" style={{fontSize:"8px",letterSpacing:"0.5em",color:"#bbb",marginBottom:16,textTransform:"uppercase"}}>Favorita de la temporada</div>
              <div className="cg" style={{fontSize:"clamp(28px,5vw,56px)",fontWeight:300,color:"#111",lineHeight:1.05,fontStyle:"italic",marginBottom:20}}>{sp.name}</div>
              <div style={{width:32,height:1,background:"#ccc",marginBottom:20}}/>
              <p className="cg" style={{fontSize:"clamp(14px,1.8vw,18px)",color:"#666",fontWeight:300,lineHeight:1.75,marginBottom:28,maxWidth:340}}>Diseñado para las que saben que el estilo no se improvisa — se elige con cuidado.</p>
              <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:28}}>
                {origPrice(sp)&&<span className="mt" style={{fontSize:14,color:"#bbb",textDecoration:"line-through"}}>{origPrice(sp)} €</span>}
                <span className="cg" style={{fontSize:28,color:origPrice(sp)?"#c0392b":"#111",fontWeight:300}}>{sp.price} €</span>
              </div>
              <Link to={`/product/${sp.handle||sp.id}`} onClick={()=>setSelSize(null)}
                style={{display:"inline-flex",alignItems:"center",gap:12,background:"#111",color:"#fff",fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.32em",padding:"15px 28px",textDecoration:"none",width:"fit-content",transition:"background 0.25s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#333"}
                onMouseLeave={e=>e.currentTarget.style.background="#111"}>
                VER MODELO
              </Link>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"clamp(28px,8vw,80px)",padding:"clamp(24px,4vw,40px)",borderTop:"1px solid #e8e8e8",flexWrap:"wrap"}}>
            {[{label:"Seguidoras",to:30000,suffix:"+"},{label:"Modelos SS25",to:shopifyProducts.length,suffix:""},{label:"Desde",to:2010,suffix:""}].map(({label,to,suffix})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div className="cg" style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:300,color:"#111",fontStyle:"italic"}}><AnimCount to={to} suffix={suffix}/></div>
                <div className="mt" style={{fontSize:"8px",letterSpacing:"0.35em",color:"#aaa",marginTop:4,textTransform:"uppercase"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      );})()}

      {/* COLECCIÓN EN VÍDEO */}
      {videoProducts.length > 0 && (
        <div ref={vidGridRef} style={{background:"#0a0a0a",padding:"52px 0 40px"}}>
          <div style={{textAlign:"center",padding:"0 20px 28px"}}>
            <div className="mt" style={{fontSize:8,letterSpacing:"0.55em",color:"#666",marginBottom:12,textTransform:"uppercase"}}>Fady Calzados</div>
            <div className="cg" style={{fontSize:38,fontWeight:300,color:"#fff",lineHeight:1.05,fontStyle:"italic"}}>Colección<br/>en Vídeo</div>
            <div className="mt" style={{fontSize:9,letterSpacing:"0.22em",color:"#555",marginTop:14}}>Toca para ver · Desliza para más</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,padding:"0 3px"}}>
            {videoProducts.flatMap((p) => (p.videos||[]).map((v,vi) => ({p,v,vi,total:(p.videos||[]).length}))).slice(0,12).map(({p,v,vi,total},i) => (
              <div key={`${p.id}-${vi}`}
                onClick={() => { setTikStartIndex(i); setShowTikTok(true); }}
                style={{position:"relative",aspectRatio:"9/16",overflow:"hidden",cursor:"pointer",background:"#111"}}
              >
                {v.preview
                  ? <img src={v.preview} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
                  : p.photoUrl
                    ? <img src={p.photoUrl} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
                    : <div style={{width:"100%",height:"100%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:32,opacity:0.2}}>👠</span></div>
                }
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.05) 55%)",pointerEvents:"none"}}/>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-60%)",width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.18)",backdropFilter:"blur(6px)",border:"1.5px solid rgba(255,255,255,0.45)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:0,height:0,borderTop:"9px solid transparent",borderBottom:"9px solid transparent",borderLeft:"16px solid rgba(255,255,255,0.9)",marginLeft:4}}/>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px 14px"}}>
                  <div className="cg" style={{fontSize:12,color:"rgba(255,255,255,0.92)",fontStyle:"italic",lineHeight:1.25,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  {total > 1 && <div style={{fontFamily:"Montserrat,sans-serif",fontSize:7,color:"rgba(255,255,255,0.45)",letterSpacing:"0.15em",marginTop:2}}>{vi+1}/{total}</div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:28}}>
            <button onClick={()=>{setTikStartIndex(0);setShowTikTok(true);}}
              style={{background:"none",border:"1px solid rgba(255,255,255,0.25)",color:"rgba(255,255,255,0.65)",padding:"12px 32px",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.38em",cursor:"pointer",transition:"all 0.25s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.65)";}}>
              VER TODOS LOS VÍDEOS
            </button>
          </div>
        </div>
      )}

      <div style={{height:90}}/>

      {/* PRODUCT SHEET */}
      {product&&(
        <div className="mov" onClick={()=>navigate("/")}>
          <div className="msheet" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
              <div style={{width:38,height:4,background:"#e0e0e0",borderRadius:2}}/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 16px 0"}}>
              <button onClick={()=>navigate("/")} style={{background:"none",border:"1px solid #e8e8e8",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:14,color:"#999",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <ProductGallery product={product}/>
            <div style={{padding:"20px 16px 36px"}}>

              {/* Title + wishlist */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <div className="mt" style={{fontSize:8,letterSpacing:"0.45em",color:"#bbb",marginBottom:5}}>COLECCION</div>
                  <div className="cg" style={{fontSize:22,fontWeight:300,color:"#111",lineHeight:1.1}}>{product.name}</div>
                  {product.artNumber&&<div className="mt" style={{fontSize:9,color:"#bbb",letterSpacing:"0.08em",marginTop:3}}>Art. {product.artNumber}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:14}}>
                  <button style={{fontSize:20,border:"none",background:"none",cursor:"pointer",color:wished.includes(product.id)?"#111":"#ccc",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}
                    onClick={()=>setWished(prev=>prev.includes(product.id)?prev.filter(x=>x!==product.id):[...prev,product.id])}>
                    {wished.includes(product.id)?"♥":"♡"}
                  </button>
                  <button style={{border:"1px solid #e8e8e8",background:"none",cursor:"pointer",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"border-color 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#111"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#e8e8e8"}
                    onClick={()=>{
                      const url = `${window.location.origin}/product/${product.handle||product.id}`;
                      if (navigator.share) {
                        navigator.share({ title: product.name, text: `${product.name} — ${product.price}€ en Fady Calzados`, url });
                      } else {
                        navigator.clipboard?.writeText(url).then(()=>alert('¡Enlace copiado!'));
                      }
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"12px 0",paddingBottom:12,borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:10}}>
                  {origPrice(product)&&<span className="mt" style={{fontSize:15,color:"#ccc",textDecoration:"line-through"}}>{origPrice(product)} €</span>}
                  <div className="cg" style={{fontSize:28,fontWeight:300,color:origPrice(product)?"#c0392b":"#111"}}>{product.price}<span style={{fontSize:16,marginLeft:3}}>€</span></div>
                </div>
                <div className="mt" style={{fontSize:9,color:"#888"}}>👁 {Math.floor(Math.random()*18)+8} viendo ahora</div>
              </div>

              {/* Description */}
              {product.descText&&(
                <div className="mt" style={{fontSize:13,color:"#555",lineHeight:1.75,marginBottom:16}}>
                  {product.descText}
                </div>
              )}


              {/* Care instructions */}
              {product.careText&&(
                <div style={{marginBottom:16}}>
                  <div className="mt" style={{fontSize:8,letterSpacing:"0.35em",color:"#aaa",marginBottom:8}}>CUIDADOS</div>
                  <div className="mt" style={{fontSize:11,color:"#888",lineHeight:1.7}}>{product.careText}</div>
                </div>
              )}

              {/* COD notice */}
              <div style={{background:"#f8fdf8",border:"1px solid #d4edda",borderRadius:8,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20}}>💵</span>
                <div>
                  <div className="mt" style={{fontSize:11,fontWeight:500,color:"#1a5c1a",marginBottom:2}}>Pago contra reembolso</div>
                  <div className="mt" style={{fontSize:10,color:"#2d8a2d"}}>Pagas cuando llega. Cargo por reembolso: +1EUR.</div>
                </div>
              </div>

              {/* Size selector */}
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div className="mt" style={{fontSize:9,letterSpacing:"0.3em",color:"#aaa"}}>SELECCIONA TALLA (EU)</div>
                  <button className="mt" onClick={()=>setSizeGuideOpen(true)}
                    style={{fontSize:10,color:"#111",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
                    Guia de tallas
                  </button>
                </div>
                <div className="size-grid">
                  {(product.sizes||[]).map(s=>(<button key={s} className={"size-btn mt"+(selSize===s?" sel":"")} onClick={()=>setSelSize(s)}>{s}</button>))}
                  {(product.soldOutSizes||[]).map(s=>(<button key={"x"+s} className="size-btn mt" disabled style={{color:"#ccc",textDecoration:"line-through",cursor:"not-allowed",background:"#fafafa"}}>{s}</button>))}
                </div>
                {selSize&&<div className="mt" style={{fontSize:10,color:"#c0392b",marginTop:8,fontWeight:500}}>Últimas unidades en talla {selSize}</div>}
              </div>

              {/* Add to cart */}
              <button className="cta-main mt" disabled={!selSize} onClick={()=>addToCart(product,selSize)}>
                {selSize?"AÑADIR A LA CESTA — TALLA "+selSize:"SELECCIONA UNA TALLA"}
              </button>

              {/* WhatsApp */}
              <button className="mt" onClick={()=>go(waLink("Hola! Quiero el modelo "+product.name+(selSize?" en talla "+selSize:"")+" por "+product.price+"EUR"))}
                style={{width:"100%",padding:14,background:"#fff",color:"#111",border:"1.5px solid #e0e0e0",fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.22em",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,borderRadius:2,transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#111"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#e0e0e0"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                PEDIR POR WHATSAPP
              </button>
              <ShippingTimer/>
            </div>

            {/* RECENTLY VIEWED */}
            {recentlyViewed.filter(r => r.id !== product.id).length > 0 && (
              <div style={{padding:"28px 16px 40px",borderTop:"1px solid #f0f0f0",background:"#fff"}}>
                <div style={{fontFamily:"Montserrat,sans-serif",fontSize:"7.5px",letterSpacing:"0.4em",color:"#bbb",marginBottom:14,textTransform:"uppercase"}}>Has visto recientemente</div>
                <div style={{display:"flex",gap:12,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",paddingBottom:4}}>
                  {recentlyViewed.filter(r => r.id !== product.id).map(rv => (
                    <Link key={rv.id} to={`/product/${rv.handle||rv.id}`} style={{textDecoration:"none",color:"inherit",flexShrink:0,width:85}}
                      onClick={()=>setSelSize(null)}>
                      <div style={{width:85,height:110,background:"#f5f5f5",overflow:"hidden",marginBottom:7}}>
                        {rv.photoUrl
                          ? <img src={rv.photoUrl} alt={rv.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center bottom"}}/>
                          : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,opacity:0.2}}>👠</div>}
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:9,color:"#111",letterSpacing:"0.1em",textTransform:"uppercase",lineHeight:1.4,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rv.name}</div>
                      <div style={{fontFamily:"Montserrat,sans-serif",fontSize:8,color:"#999"}}>{rv.price} €</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
              {(quickPopup?.sizes||[]).map(s=><button key={s} className={"size-btn mt"+(quickSize===s?" sel":"")} onClick={()=>setQuickSize(s)}>{s}</button>)}
              {(quickPopup?.soldOutSizes||[]).map(s=><button key={"x"+s} className="size-btn mt" disabled style={{color:"#ccc",textDecoration:"line-through",cursor:"not-allowed",background:"#fafafa"}}>{s}</button>)}
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
                <div key={c.n} className="cswatch" onClick={()=>setColorFilter(prev=>prev===c.n?null:c.n)}>
                  <div className={"ccirc"+(colorFilter===c.n?" sel":"")}
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
                <button key={s} className={"sbtn mt"+(sizeFilter===s?" sel":"")}
                  onClick={()=>setSizeFilter(prev=>prev===s?null:s)}>
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
          <button className="fclr mt" onClick={()=>{setSizeFilter(null);setColorFilter(null);setSelHeights([]);}}>LIMPIAR</button>
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
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div className="mt" style={{fontSize:10,color:freeShipping?"#2d6a4f":"#111",fontWeight:600,letterSpacing:"0.05em"}}>
                {freeShipping ? "✓ ENVÍO GRATIS ACTIVADO" : `Añade ${pairsNeeded} par${pairsNeeded>1?"es":""} más → Envío gratis`}
              </div>
              <div className="mt" style={{fontSize:9,color:"#aaa"}}>3 pares</div>
            </div>
            <div className="prog"><div className="prog-fill" style={{width:Math.min((cartCount/3)*100,100)+"%"}}/></div>
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
              <div style={{width:56,height:72,flexShrink:0,overflow:"hidden",background:BG[item.color]||"#f5f5f5"}}>
                {item.photoUrl?<img src={item.photoUrl} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center bottom"}}/>:<span style={{fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>👠</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="cg" style={{fontSize:13,color:"#111",marginBottom:2,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>
                <div className="mt" style={{fontSize:9,color:"#aaa",marginBottom:5,letterSpacing:"0.08em"}}>TALLA {item.selSize}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {origPrice(item)&&<span className="mt" style={{fontSize:10,color:"#ccc",textDecoration:"line-through"}}>{origPrice(item)} €</span>}
                  <span className="cg" style={{fontSize:15,color:origPrice(item)?"#c0392b":"#111"}}>{item.price} €</span>
                </div>
              </div>
              <button style={{fontSize:16,color:"#ccc",background:"none",border:"none",cursor:"pointer",padding:"4px",flexShrink:0}} onClick={()=>removeFromCart(item.cartId)}>✕</button>
            </div>
          ))}
        </div>
        {cartCount>0&&(
          <div className="cftr">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div className="mt" style={{fontSize:9,color:"#aaa",letterSpacing:"0.1em"}}>TOTAL {freeShipping?"· ENVÍO GRATIS":"· +1€ COD"}</div>
              <div className="cg" style={{fontSize:22,fontWeight:300,color:"#111"}}>{cartTotal.toFixed(2).replace(".",",")} €</div>
            </div>
            <div style={{background:"#f8fdf8",border:"1px solid #d4edda",borderRadius:4,padding:"7px 10px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>💵</span>
              <div className="mt" style={{fontSize:9,color:"#2d6a4f"}}><strong>Pago contra reembolso</strong> — Pagas cuando llega. Cargo: +1€</div>
            </div>
            {codSelected&&(
              <div className="cod-container">
                <div className="cod-header">
                  <span style={{fontSize:14}}>✉️</span> Pago Contra Reembolso
                </div>
                <div className="cod-total-row">
                  <span className="mt" style={{fontSize:12,color:"#555"}}>Importe Total:</span>
                  <span className="mt cod-price">{(cartTotal+(freeShipping?0:3.99)+1).toFixed(2).replace(".",",")} €</span>
                </div>
                <div className="mt cod-note">
                  🚚 <strong>Envío gratis</strong> en compra de 3 modelos
                </div>
              </div>
            )}
            {cartCount===1&&(
              <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:6,padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:8}}>
                <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
                <div className="mt" style={{fontSize:11,color:"#7a5c00",lineHeight:1.5}}>
                  <strong>Pedido mínimo: 2 pares.</strong><br/>
                  Por favor, añade al menos un par más para continuar.<br/>
                  <span style={{color:"#2d6a4f",fontWeight:600}}>💡 Con 3 pares el envío es GRATIS</span>
                </div>
              </div>
            )}
            {cartCount>=2&&cartCount<3&&(
              <div style={{background:"#f0fff4",border:"1px solid #c8e6c9",borderRadius:6,padding:"8px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>🚚</span>
                <div className="mt" style={{fontSize:11,color:"#1a5c1a"}}>
                  Añade 1 par más y consigue <strong>envío gratis</strong>
                </div>
              </div>
            )}
            <button className="hero-cta mt"
              disabled={cartCount===1}
              style={{width:"100%",justifyContent:"center",padding:16,background:cartCount===1?"#ccc":"#111",color:"#fff",marginTop:8,border:"none",cursor:cartCount===1?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:10,fontSize:10,letterSpacing:"0.28em"}}
              onClick={()=>{
                if(cartCount===1) return;
                const lineItems = cart.map(item=>{
                  const v = item.variants?.find(v=>v.title.includes(String(item.selSize)));
                  return v ? String(v.id).split("/").pop()+":1" : null;
                }).filter(Boolean);
                const url = lineItems.length > 0
                  ? "https://gfg8hj-yd.myshopify.com/cart/"+lineItems.join(",")
                  : "https://gfg8hj-yd.myshopify.com/cart";
                window.open(url, "_blank");
              }}>
              FINALIZAR COMPRA
            </button>
            <button
              style={{width:"100%",justifyContent:"center",padding:"11px 0",background:"none",color:"#111",marginTop:8,border:"1.5px solid #e0e0e0",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:10,letterSpacing:"0.28em",fontFamily:"Montserrat,sans-serif"}}
              onClick={()=>{setCartOpen(false);navigate("/");}}>
              ← SEGUIR COMPRANDO
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
        <div
          style={{position:"fixed",inset:0,zIndex:3000,background:"#000",overflowY:"scroll",scrollSnapType:"y mandatory",scrollbarWidth:"none"}}
          ref={tikFeedRef}
          onTouchStart={e=>{ tikSwipeY.current = e.touches[0].clientY; }}
          onTouchEnd={e=>{
            if (tikSwipeY.current === null) return;
            const dy = e.changedTouches[0].clientY - tikSwipeY.current;
            if (dy > 80 && tikFeedRef.current && tikFeedRef.current.scrollTop < 5) {
              closeTikModal();
              setTimeout(()=>collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"}),120);
            }
            tikSwipeY.current = null;
          }}
        >
          {/* Drag-pill hint */}
          <div style={{position:"fixed",top:8,left:"50%",transform:"translateX(-50%)",zIndex:3100,width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.25)",pointerEvents:"none"}}/>
          <button onClick={()=>closeTikModal()}
            style={{position:"fixed",top:16,left:16,zIndex:3100,width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",fontSize:18,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
            ✕
          </button>
          <div className="cg" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:3100,fontSize:18,color:"#fff",letterSpacing:"0.3em",pointerEvents:"none"}}>FADY</div>
          {/* Back to products — ghost button bottom center */}
          <button
            onClick={()=>{closeTikModal();setTimeout(()=>collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"}),120);}}
            style={{position:"fixed",bottom:36,left:"50%",transform:"translateX(-50%)",zIndex:3100,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.55)",padding:"9px 22px",borderRadius:30,fontFamily:"Montserrat,sans-serif",fontSize:9,letterSpacing:"0.28em",cursor:"pointer",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:8,transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}>
            ← VOLVER A TIENDA
          </button>
          {videoProducts.flatMap(p=>(p.videos||[]).map((v,i)=>({p,v,i,total:(p.videos||[]).length}))).map(({p,v,i,total},idx)=>(
            <TikSlide key={`${p.id}-${i}`} product={p} video={v} vidIdx={i} vidTotal={total}
              liked={tikLiked.includes(p.id)}
              onLike={()=>setTikLiked(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])}
              onWa={()=>{trackTikTokEvent('Contact',{content_id:p.id,content_name:p.name});go(waLink("Hola! Vi el video de "+p.name+" y me interesa, me lo puedes mostrar?"));}}
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
                  {(tikProduct?.sizes||[]).map(s=>(<button key={s} className={"size-btn mt"+(tikSelSize===s?" sel":"")} onClick={()=>setTikSelSize(s)}>{s}</button>))}
                  {(tikProduct?.soldOutSizes||[]).map(s=>(<button key={"x"+s} className="size-btn mt" disabled style={{color:"#ccc",textDecoration:"line-through",cursor:"not-allowed",background:"#fafafa"}}>{s}</button>))}
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
              Compra <strong style={{color:"#111"}}>3 pares</strong> y el envío es <strong style={{color:"#111"}}>GRATIS</strong>. 3 pares = envío incluido.
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


      {/* WA CHAT POPUP */}
      {!waChatDismissed && (
        <div className={"wa-chat-popup"+(waChatOpen?" open":"")}>
          <div className="wa-chat-hdr">
            <div className="wa-chat-avatar">👟</div>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:14}}>Fady Calzados</div>
              <div style={{color:"rgba(255,255,255,0.85)",fontSize:11,display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:"#fff",display:"inline-block"}}></span>
                En línea
              </div>
            </div>
            <button onClick={()=>{setWaChatOpen(false);setWaChatDismissed(true);}}
              style={{background:"none",border:"none",color:"rgba(255,255,255,0.8)",fontSize:18,cursor:"pointer",lineHeight:1}}>✕</button>
          </div>
          <div className="wa-chat-body">
            <div className="wa-chat-bubble">
              👋 ¡Hola! ¿Tienes alguna pregunta sobre tallas, modelos o envíos?<br/>
              <span style={{color:"#888",fontSize:11}}>Escríbenos por WhatsApp, ¡te respondemos al momento!</span>
            </div>
            <a className="wa-chat-btn"
              href={"https://wa.me/"+WA_NUM+"?text="+encodeURIComponent("¡Hola! Me gustaría obtener más información sobre vuestros zapatos 👟")}
              onClick={e=>{e.preventDefault();go("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent("¡Hola! Me gustaría obtener más información sobre vuestros zapatos 👟"));setWaChatOpen(false);setWaChatDismissed(true);}}>
              💬 Iniciar chat
            </a>
          </div>
        </div>
      )}

      {/* REBAJAS SECTION */}
      <div style={{background:"#fff",borderTop:"1px solid #ebebeb",overflow:"hidden",position:"relative",padding:"clamp(72px,14vw,130px) clamp(24px,6vw,80px)",textAlign:"center"}}>
        {/* Ghost watermark */}
        <div aria-hidden style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",pointerEvents:"none",userSelect:"none"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(140px,34vw,320px)",fontWeight:300,color:"rgba(0,0,0,0.04)",lineHeight:1,whiteSpace:"nowrap",letterSpacing:"-0.02em",fontStyle:"italic"}}>Rebajas</span>
        </div>

        <div style={{position:"relative",zIndex:1}}>
          <p data-reveal style={{fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.55em",color:"#bbb",textTransform:"uppercase",marginBottom:28}}>Oferta Especial</p>

          <h2 data-reveal data-d="1" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(64px,18vw,180px)",fontWeight:300,color:"#111",lineHeight:0.85,letterSpacing:"-0.01em",marginBottom:28,fontStyle:"italic"}}>Rebajas</h2>

          <div data-reveal data-d="2" style={{width:"clamp(36px,6vw,60px)",height:1,background:"#ccc",margin:"0 auto 28px"}}/>

          <p data-reveal data-d="2" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(16px,3vw,24px)",fontWeight:300,color:"#999",fontStyle:"italic",marginBottom:52,lineHeight:1.65,maxWidth:440,margin:"0 auto 52px"}}>
            Hasta un 80% de descuento.<br/>Por tiempo limitado.
          </p>

          <div data-reveal data-d="3" style={{marginBottom:60}}>
            <button
              onClick={()=>collRef.current&&collRef.current.scrollIntoView({behavior:"smooth"})}
              style={{background:"#111",color:"#fff",border:"1px solid #111",padding:"15px 52px",fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.45em",fontWeight:400,textTransform:"uppercase",transition:"transform 0.3s cubic-bezier(0.23,1,0.32,1),background 0.2s,color 0.2s",display:"inline-block"}}
              onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)*0.22;const dy=(e.clientY-r.top-r.height/2)*0.22;e.currentTarget.style.transform=`translate(${dx}px,${dy}px)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translate(0,0)";e.currentTarget.style.background="#111";e.currentTarget.style.color="#fff";}}
              onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#111";}}
            >
              Ver Ofertas
            </button>
          </div>

          {/* Savings trio */}
          <div data-reveal data-d="3" style={{display:"flex",justifyContent:"center",gap:"clamp(28px,8vw,80px)",flexWrap:"wrap",borderTop:"1px solid #ebebeb",paddingTop:48}}>
            {[["−50%","Sandalias"],["−65%","Tacones"],["−80%","Selección"]].map(([pct,label],i)=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,8vw,68px)",fontWeight:300,color:"#111",lineHeight:1,fontStyle:"italic"}}>{pct}</div>
                <div style={{fontFamily:"Montserrat,sans-serif",fontSize:"8px",letterSpacing:"0.38em",color:"#bbb",marginTop:10,textTransform:"uppercase"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT + FOOTER */}
      <div style={{background:"#fafafa",borderTop:"1px solid #e8e8e8"}}>

        {/* Contact block */}
        <div style={{maxWidth:560,margin:"0 auto",padding:"80px 32px 64px",textAlign:"center"}}>
          <p style={{fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.4em",color:"#999",textTransform:"uppercase",marginBottom:20}}>Contacto</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,6vw,46px)",fontWeight:300,color:"#111",lineHeight:1.25,marginBottom:28,letterSpacing:"0.01em"}}>
            Estamos aquí.<br/><em>Siempre.</em>
          </h2>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:300,color:"#777",lineHeight:1.9,marginBottom:14}}>
            Sabemos lo que es tener una duda a las 11 de la noche y no tener a nadie a quien preguntar. Por eso estamos disponibles las 24 horas, los 7 días de la semana.
          </p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:300,color:"#777",lineHeight:1.9,marginBottom:44}}>
            Escríbenos por WhatsApp — una persona real de nuestra familia te responderá. Sin bots. Sin esperas. Solo nosotros.
          </p>
          <a href={"https://wa.me/34612574172?text="+encodeURIComponent("Hola, me gustaría obtener más información sobre vuestros zapatos 👠")}
            target="_blank" rel="noopener"
            style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",background:"#111",color:"#fff",fontFamily:"Montserrat,sans-serif",fontSize:"9px",letterSpacing:"0.35em",textDecoration:"none",textTransform:"uppercase",fontWeight:400,border:"1px solid #111",transition:"background 0.2s,color 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#111";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#111";e.currentTarget.style.color="#fff";}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp · 24h
          </a>
        </div>

        {/* Divider */}
        <div style={{width:40,height:1,background:"#ddd",margin:"0 auto"}}/>

        {/* Footer strip */}
        <div style={{padding:"40px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:300,color:"#111",letterSpacing:"0.45em",textTransform:"uppercase"}}>Fady Calzados</div>
          <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",justifyContent:"center"}}>
            <Link to="/quienes-somos" style={{fontFamily:"Montserrat,sans-serif",fontSize:"8px",letterSpacing:"0.32em",color:"#999",textDecoration:"none",textTransform:"uppercase",transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#111"}
              onMouseLeave={e=>e.currentTarget.style.color="#999"}>
              Quiénes Somos
            </Link>
            <a href={"https://www.instagram.com/fady.calzados/"} target="_blank" rel="noopener" aria-label="Instagram"
              style={{color:"#bbb",display:"inline-flex",transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#111"}
              onMouseLeave={e=>e.currentTarget.style.color="#bbb"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href={"https://www.facebook.com/fadycalzado"} target="_blank" rel="noopener" aria-label="Facebook"
              style={{color:"#bbb",display:"inline-flex",transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#111"}
              onMouseLeave={e=>e.currentTarget.style.color="#bbb"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <div style={{fontFamily:"Montserrat,sans-serif",fontSize:"7px",color:"#ccc",letterSpacing:"0.2em",textTransform:"uppercase"}}>© 2025 Fady Calzados · Vitoria-Gasteiz</div>
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
