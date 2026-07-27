import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "#fcfcfc", minHeight: "100vh", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: #fcfcfc; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .about-animate { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .about-animate-2 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .about-animate-3 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .about-animate-4 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, height: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 16px" }}>
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, letterSpacing: "0.55em", textDecoration: "none", color: "#111", textAlign: "center", lineHeight: 1 }}>
          FADY
          <span style={{ display: "block", fontFamily: "Montserrat, sans-serif", fontSize: "5.5px", letterSpacing: "0.75em", fontWeight: 300, marginTop: 4, color: "#999", textTransform: "uppercase" }}>CALZADOS</span>
        </Link>
      </nav>

      {/* HERO */}
      <div style={{ background: "#111", padding: "80px 24px 64px", textAlign: "center" }}>
        <p className="about-animate" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>
          Quiénes Somos
        </p>
        <h1 className="about-animate-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 300, color: "#fff", lineHeight: 1.25, marginBottom: 24, letterSpacing: "0.03em" }}>
          Tres hermanos.<br />Una pasión.<br /><em>Desde 2010.</em>
        </h1>
        <p className="about-animate-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          &ldquo;Nacimos entre zapatos. Crecimos entre zapatos. Y hoy, vivimos para llevar los mejores zapatos a tus pies.&rdquo;
        </p>
      </div>

      {/* STATS */}
      <div style={{ background: "#1a1a1a", padding: "40px 24px", display: "flex", justifyContent: "center", gap: "clamp(28px, 8vw, 72px)", flexWrap: "wrap" }}>
        {[
          { val: "+30K", label: "Seguidoras" },
          { val: "2010", label: "Desde" },
          { val: "3", label: "Hermanos" },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: "#c9a84c", lineHeight: 1 }}>{val}</div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* STORY */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "72px 28px" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, lineHeight: 1.8, color: "#333", marginBottom: 32 }}>
          Somos una familia de <strong style={{ color: "#111", fontWeight: 400 }}>Vitoria-Gasteiz</strong> que lleva toda la vida entre zapatos. En 2010 dimos el salto y creamos Fady Calzados con una misión clara: llevar calzado de calidad a precios que cualquier mujer pueda permitirse.
        </p>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, lineHeight: 1.8, color: "#333", marginBottom: 32 }}>
          No fue fácil. Hubo noches largas, pedidos que no llegaban, clientes que había que conquistar uno a uno. Pero cada par de zapatos que colocamos en manos de una mujer que sonreía al verlos&hellip; eso lo hizo todo posible.
        </p>

        {/* Highlight block */}
        <div style={{ borderLeft: "2px solid #c9a84c", padding: "20px 24px", background: "#faf8f5", margin: "40px 0" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, lineHeight: 1.8, color: "#555" }}>
            Hoy, más de <strong style={{ color: "#111", fontWeight: 600 }}>30.000 mujeres</strong> nos siguen en Instagram y Facebook. No somos una gran empresa. Somos una familia que ama lo que hace, que responde cada mensaje con cariño, y que pone el alma en cada par de zapatos que sale por nuestra puerta.
          </p>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, lineHeight: 1.8, color: "#333", marginBottom: 32 }}>
          Seguimos siendo los mismos tres hermanos de siempre. Solo que ahora tenemos <strong style={{ color: "#111", fontWeight: 400 }}>30.000 hermanas más</strong>.
        </p>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, lineHeight: 1.8, color: "#333", marginBottom: 56 }}>
          Gracias por confiar en nosotros. Gracias por estar aquí.
        </p>

        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, letterSpacing: "0.35em", color: "#aaa", textAlign: "center" }}>
          — LA FAMILIA FADY CALZADOS
        </p>
      </div>

      {/* CONTACT */}
      <div style={{ background: "#111", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: "0.4em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 20 }}>
          Contacto
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 7vw, 44px)", fontWeight: 300, color: "#fff", lineHeight: 1.3, marginBottom: 24 }}>
          Estamos aquí.<br /><em>Siempre.</em>
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto 20px", lineHeight: 1.8 }}>
          Sabemos lo que es tener una duda a las 11 de la noche y no tener a nadie a quien preguntar. Por eso nosotros estamos disponibles las 24 horas, los 7 días de la semana.
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.8 }}>
          Escríbenos por WhatsApp — una persona real, de nuestra familia, te responderá. Sin bots. Sin esperas. Solo nosotros.
        </p>

        {/* WA Button */}
        <a
          href="https://wa.me/34681889165?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20vuestros%20zapatos%20%F0%9F%91%A0"
          target="_blank"
          rel="noopener"
          style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "18px 40px", background: "#25D366", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: "0.3em", textDecoration: "none", textTransform: "uppercase", fontWeight: 500, borderRadius: 2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882l6.162-1.448A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.523-5.176-1.432l-.371-.22-3.849.904.942-3.747-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Escribirnos por WhatsApp
        </a>

        {/* Trust line */}
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", marginTop: 28, textTransform: "uppercase" }}>
          Disponible 24h · 7 días a la semana · Respuesta inmediata
        </p>
      </div>

      {/* CTA */}
      <div style={{ background: "#1a1a1a", padding: "56px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#fff", marginBottom: 8 }}>
          Nuestra colección
        </p>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>
          HECHA CON AMOR · DESDE VITORIA-GASTEIZ
        </p>
        <Link to="/" style={{ display: "inline-block", padding: "14px 36px", background: "#c9a84c", color: "#111", fontFamily: "Montserrat, sans-serif", fontSize: 9, letterSpacing: "0.35em", textDecoration: "none", textTransform: "uppercase", fontWeight: 500 }}>
          VER ZAPATOS
        </Link>
      </div>
    </div>
  );
}
