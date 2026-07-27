import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SHOPIFY_DOMAIN = "gfg8hj-yd.myshopify.com";
const SHOPIFY_TOKEN  = "6defb920c830f6d263705aa0bcb6a074";
const VIDEO_COLLECTION = "700405678422";

async function fetchVideos() {
  const query = `{
    collection(id:"gid://shopify/Collection/${VIDEO_COLLECTION}"){
      products(first:50){
        edges{
          node{
            id title handle
            priceRange{ minVariantPrice{ amount } }
            media(first:10){
              edges{
                node{
                  mediaContentType
                  ... on Video {
                    sources{ url }
                    previewImage{ url }
                  }
                }
              }
            }
            images(first:1){ edges{ node{ url } } }
          }
        }
      }
    }
  }`;
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  return (data?.collection?.products?.edges || []).map(({ node }) => {
    const price = parseFloat(node.priceRange?.minVariantPrice?.amount || 0).toFixed(2).replace(".", ",");
    const videos = (node.media?.edges || [])
      .filter(e => e.node.mediaContentType === "VIDEO")
      .map(e => {
        const srcs = e.node.sources || [];
        const mp4 = srcs.filter(s => s.url?.includes(".mp4"));
        const url = mp4[mp4.length - 1]?.url || srcs[srcs.length - 1]?.url;
        return { url, preview: e.node.previewImage?.url };
      })
      .filter(v => v.url);
    const photo = node.images?.edges?.[0]?.node?.url;
    return { id: node.id, name: node.title, handle: node.handle, price, videos, photo };
  }).filter(p => p.videos.length > 0);
}

function VideoCard({ product, onClick }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const first = product.videos[0];
  const total = product.videos.length;

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) videoRef.current.play().catch(() => {});
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [hovered]);

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", cursor: "pointer", overflow: "hidden", background: "#0d0d0d", borderRadius: 2, width: "100%", height: "100%" }}>
      <video ref={videoRef} muted loop playsInline preload="metadata"
        poster={first.preview || product.photo || undefined}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.23,1,0.32,1)", transform: hovered ? "scale(1.04)" : "scale(1)" }}>
        <source src={first.url} type="video/mp4" />
      </video>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 55%)", pointerEvents: "none" }} />

      {/* Play icon */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 0 : 1, transition: "opacity 0.3s", pointerEvents: "none" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "17px solid rgba(255,255,255,0.9)", marginLeft: 5 }} />
        </div>
      </div>

      {/* Multiple videos badge */}
      {total > 1 && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "#c9a84c", borderRadius: 20, padding: "3px 9px", fontFamily: "Montserrat,sans-serif", fontSize: 8, color: "#111", fontWeight: 700, letterSpacing: "0.08em" }}>
          {total} VÍDEOS
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px 16px" }}>
        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontStyle: "italic", color: "#fff", fontWeight: 300, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, color: "#c9a84c", letterSpacing: "0.1em", marginTop: 3 }}>{product.price}€</div>
      </div>
    </div>
  );
}

function FullscreenPlayer({ product, onClose }) {
  const [vidIdx, setVidIdx] = useState(0);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const touchStartY = useRef(null);
  const videos = product.videos;
  const total = videos.length;

  useEffect(() => {
    if (videoRef.current) { videoRef.current.load(); videoRef.current.play().catch(() => {}); }
  }, [vidIdx]);

  // Push history entry so browser back closes the player
  useEffect(() => {
    history.pushState({ player: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setVidIdx(i => Math.min(i + 1, total - 1));
      if (e.key === "ArrowLeft") setVidIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}
      onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
      onTouchEnd={e => {
        if (touchStartY.current === null) return;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (dy > 80) onClose();
        touchStartY.current = null;
      }}>
      <video ref={videoRef} loop playsInline muted={muted}
        style={{ maxWidth: "100vw", maxHeight: "100vh", objectFit: "contain", display: "block" }}
        onClick={e => e.stopPropagation()}>
        <source src={videos[vidIdx].url} type="video/mp4" />
      </video>

      {/* Back button — top left */}
      <button onClick={onClose}
        style={{ position: "fixed", top: 20, left: 16, zIndex: 9100, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "10px 18px", color: "#fff", fontFamily: "Montserrat,sans-serif", fontSize: 10, letterSpacing: "0.22em", cursor: "pointer" }}>
        ← VOLVER
      </button>

      {/* Mute toggle — top right */}
      <button onClick={e => { e.stopPropagation(); setMuted(m => { if (videoRef.current) videoRef.current.muted = !m; return !m; }); }}
        style={{ position: "fixed", top: 20, right: 16, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "10px 16px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "Montserrat,sans-serif", letterSpacing: "0.12em" }}>
        {muted ? "🔇" : "🔊"}
      </button>

      {vidIdx > 0 && <button onClick={e => { e.stopPropagation(); setVidIdx(i => i - 1); }} style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>}
      {vidIdx < total - 1 && <button onClick={e => { e.stopPropagation(); setVidIdx(i => i + 1); }} style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>}

      {/* Dot indicators */}
      {total > 1 && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {videos.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setVidIdx(i); }}
              style={{ width: i === vidIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === vidIdx ? "#c9a84c" : "rgba(255,255,255,0.35)", transition: "all 0.3s", cursor: "pointer" }} />
          ))}
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px 20px 44px", background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ pointerEvents: "none" }}>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontStyle: "italic", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>{product.name}</div>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, color: "#c9a84c", letterSpacing: "0.15em", marginTop: 4 }}>{product.price}€</div>
          {total > 1 && <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 5, letterSpacing: "0.2em" }}>VÍDEO {vidIdx + 1} DE {total}</div>}
        </div>

        {/* WhatsApp CTA */}
        <a href={`https://wa.me/34681889165?text=${encodeURIComponent(`Hola! Vi el vídeo de "${product.name}" y me interesa 👠 ¿Me podéis dar más información?`)}`}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, textDecoration: "none" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(37,211,102,0.55)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
          </div>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 8, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>PEDIR</div>
        </a>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null); // { product, video, vidIdx, vidTotal, flatIdx }
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    fetchVideos().then(ps => { setProducts(ps); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalVideos = products.reduce((s, p) => s + p.videos.length, 0);
  const heroProduct = products[0];
  const heroVideo = heroProduct?.videos?.[0];

  // Hero parallax
  useEffect(() => {
    const h = () => {
      if (heroRef.current) heroRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "Montserrat,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0a0a0a;overflow-x:hidden;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lineGrow{from{width:0}to{width:60px}}
        .vp-fade{animation:fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) both;}
        .vcard{aspect-ratio:9/16;}
        @media(max-width:600px){.vgrid{grid-template-columns:1fr 1fr !important;}.vcard{aspect-ratio:9/16;}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%)" }}>
        <Link to="/" style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 18, fontWeight: 300, letterSpacing: "0.55em", color: "#fff", textDecoration: "none" }}>
          FADY<span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 6, letterSpacing: "0.8em", display: "block", marginTop: 2, color: "rgba(255,255,255,0.45)" }}>CALZADOS</span>
        </Link>
        <Link to="/" style={{ fontFamily: "Montserrat,sans-serif", fontSize: 8, letterSpacing: "0.35em", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
          ← TIENDA
        </Link>
      </nav>

      {/* HERO — full screen featured video */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#000" }}>
        <div ref={heroRef} style={{ position: "absolute", inset: "-10%", willChange: "transform" }}>
          {heroVideo ? (
            <video ref={heroVideoRef} autoPlay muted loop playsInline preload="auto"
              onCanPlay={() => setHeroLoaded(true)}
              poster={heroVideo.preview || heroProduct?.photo}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: heroLoaded ? 1 : 0, transition: "opacity 1.2s ease" }}>
              <source src={heroVideo.url} type="video/mp4" />
            </video>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#111,#1a1a1a)" }} />
          )}
        </div>

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.75) 100%)" }} />

        {/* Hero text */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 36px 72px" }}>
          <div className="vp-fade" style={{ animationDelay: "0.2s", fontFamily: "Montserrat,sans-serif", fontSize: 9, letterSpacing: "0.55em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 16 }}>
            Colección en Vídeo · SS25
          </div>
          <div className="vp-fade" style={{ animationDelay: "0.35s", fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(44px,9vw,88px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.01em", marginBottom: 24 }}>
            Fady<br /><em>Calzados</em>
          </div>
          <div className="vp-fade" style={{ animationDelay: "0.5s", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: "#c9a84c" }} />
            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.55)" }}>
              {totalVideos} VÍDEOS · DESLIZA PARA VER
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, right: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,transparent,rgba(255,255,255,0.4))" }} />
          <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>SCROLL</div>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div style={{ padding: "80px 36px 48px", textAlign: "center" }}>
        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 8, letterSpacing: "0.6em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 16 }}>La Colección</div>
        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(32px,6vw,56px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
          Cada zapato,<br /><em>una historia</em>
        </div>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom,#c9a84c,transparent)", margin: "0 auto" }} />
      </div>

      {/* VIDEO GRID */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3, padding: "0 3px 3px" }} className="vgrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vcard" style={{ background: "linear-gradient(90deg,#111 25%,#1a1a1a 50%,#111 75%)", backgroundSize: "400px 100%", animation: "shimmer 1.5s infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3, padding: "0 3px 3px" }} className="vgrid">
          {products.map((product) => (
            <div key={product.id} className="vcard">
              <VideoCard product={product} onClick={() => setPlayer(product)} />
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: "80px 24px", textAlign: "center", borderTop: "1px solid #1a1a1a", marginTop: 40 }}>
        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(22px,5vw,38px)", fontWeight: 300, color: "#fff", marginBottom: 8 }}>
          ¿Te ha gustado alguno?
        </div>
        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>
          PIDE POR WHATSAPP · ENVÍO A TODA ESPAÑA
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/34681889165?text=Hola%21%20Vi%20un%20vídeo%20de%20vuestros%20zapatos%20y%20me%20interesa%20%F0%9F%91%A0"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: "#25D366", color: "#fff", fontFamily: "Montserrat,sans-serif", fontSize: 9, letterSpacing: "0.32em", textDecoration: "none", borderRadius: 2 }}>
            💬 PEDIR POR WHATSAPP
          </a>
          <Link to="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: "transparent", color: "#fff", border: "1px solid #333", fontFamily: "Montserrat,sans-serif", fontSize: 9, letterSpacing: "0.32em", textDecoration: "none", borderRadius: 2 }}>
            VER TIENDA →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "24px", textAlign: "center", borderTop: "1px solid #111" }}>
        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 7, letterSpacing: "0.4em", color: "rgba(255,255,255,0.1)" }}>© FADY CALZADOS · VITORIA-GASTEIZ · SS25</div>
      </div>

      {/* Fullscreen player */}
      {player && <FullscreenPlayer product={player} onClose={() => setPlayer(null)} />}
    </div>
  );
}
