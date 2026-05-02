import { useState, useEffect } from 'react'

const SHOPIFY_DOMAIN = 'checkout.stylotacones.com'
const SHOPIFY_CHECKOUT = 'gfg8hj-yd.myshopify.com'
const SHOPIFY_TOKEN = '6defb920c830f6d263705aa0bcb6a074'
const shopifyUrl = (handle) => `https://${SHOPIFY_DOMAIN}/products/${handle}`

// Fetch variant IDs by handle from Shopify
const fetchVariantMap = async () => {
  const query = `{products(first:60,query:"tag:stylo-tacones"){edges{node{handle variants(first:20){edges{node{id title}}}}}}}`
  try {
    const res = await fetch(`https://${SHOPIFY_CHECKOUT}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN },
      body: JSON.stringify({ query })
    })
    const json = await res.json()
    const map = {}
    json?.data?.products?.edges?.forEach(({ node }) => {
      map[node.handle] = node.variants.edges.map(v => ({
        size: v.node.title,
        id: v.node.id.replace('gid://shopify/ProductVariant/', '')
      }))
    })
    return map
  } catch { return {} }
}

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y3ZjdmNyIvPjwvc3ZnPg=='

const PRODUCTS = [
  { id:1,  handle:'sandalia-joya-champagne-jf5978',               title:'Sandalia Joya Champagne',           price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:2,  handle:'sandalia-leopardo-negra-2n16',                 title:'Sandalia Leopardo Negra',           price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:3,  handle:'alpargata-calada-negra-yx23',                  title:'Alpargata Calada Negra',            price:'14.99', cat:'ALPARGATAS', tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:4,  handle:'sandalia-plataforma-negro-fucsia-lei40',       title:'Sandalia Plataforma Negro Fucsia',  price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:5,  handle:'sandalia-tiras-blanca-ws5127',                 title:'Sandalia Tiras Blanca',             price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:6,  handle:'sandalia-cuna-brillantes-negra-ns5140',        title:'Sandalia Cuña Brillantes Negra',    price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:7,  handle:'sandalia-multitira-negra-z6899',               title:'Sandalia Multitira Negra',          price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:8,  handle:'mule-liso-blanco-p4105',                      title:'Mule Liso Blanco',                  price:'14.99', cat:'MULES',      tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:9,  handle:'sandalia-tacon-plateada-l7338',                title:'Sandalia Tacón Plateada',           price:'14.99', cat:'TACONES',    tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40'] },
  { id:10, handle:'alpargata-cuna-brillantes-negra-m7549',        title:'Alpargata Cuña Brillantes Negra',   price:'14.99', cat:'ALPARGATAS', tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:11, handle:'zapatilla-deportiva-beige-bf5045',             title:'Zapatilla Deportiva Beige',         price:'14.99', cat:'ZAPATILLAS', tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:12, handle:'mule-trenzado-dorado-negro-z8452',             title:'Mule Trenzado Dorado Negro',        price:'14.99', cat:'MULES',      tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:13, handle:'sandalia-cristales-blanca-ba007',              title:'Sandalia Cristales Blanca',         price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['35','36','37','38','39','40','41'] },
  { id:14, handle:'mule-corcho-beige-z0776',                      title:'Mule Cuña Corcho Beige',            price:'14.99', cat:'MULES',      tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40'] },
  { id:15, handle:'sandalia-hebilla-camel-ws5181',                title:'Sandalia Hebilla Camel',            price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:16, handle:'sandalia-deportiva-roja-jf5961',               title:'Sandalia Deportiva Roja',           price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:17, handle:'sandalia-plana-beige-ll5379',                  title:'Sandalia Plana Beige Dorada',       price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:18, handle:'sandalia-cadenas-champagne-ws5138',            title:'Sandalia Cadenas Champagne',        price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:19, handle:'sandalia-plateada-charm-3727',                 title:'Sandalia Plateada con Charm',       price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:20, handle:'sandalia-tachuelas-blanca-p9806',              title:'Sandalia Tachuelas Blanca',         price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:21, handle:'mule-hebilla-brillantes-beige-xf5550',         title:'Mule Hebilla Brillantes Beige',     price:'14.99', cat:'MULES',      tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:22, handle:'mule-charm-dorado-negro-xf5567',               title:'Mule Charm Dorado Negro',           price:'14.99', cat:'MULES',      tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:23, handle:'sandalia-doble-tira-negra-cf5626',             title:'Sandalia Doble Tira Negra',         price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:24, handle:'mule-laso-beige-yz24',                         title:'Mule Lazo Beige',                   price:'14.99', cat:'MULES',      tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:25, handle:'alpargata-multicolor-cuna-z5f',                title:'Alpargata Multicolor Cuña',         price:'14.99', cat:'ALPARGATAS', tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40'] },
  { id:26, handle:'mule-strass-negro-cuna-ab15a',                 title:'Mule Strass Negro Cuña',            price:'14.99', cat:'MULES',      tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40'] },
  { id:27, handle:'tacon-kitten-multicolor-881',                  title:'Tacón Kitten Multicolor',           price:'14.99', cat:'TACONES',    tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:28, handle:'sandalia-tiras-negra-jf8261',                  title:'Sandalia Tiras Negra',              price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:29, handle:'tacon-kitten-plateado-joya-z2e',               title:'Tacón Kitten Plateado Joya',        price:'14.99', cat:'TACONES',    tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:30, handle:'alpargata-tiras-doradas-af8351',               title:'Alpargata Tiras Doradas',           price:'14.99', cat:'ALPARGATAS', tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:31, handle:'sandalia-boho-plateada-jf5975',                title:'Sandalia Boho Plateada',            price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:32, handle:'sandalia-flores-brillantes-blanca-p3318',      title:'Sandalia Flores Brillantes Blanca', price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:33, handle:'zapatilla-deportiva-negra-jf5962',             title:'Zapatilla Deportiva Negra',         price:'14.99', cat:'ZAPATILLAS', tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:34, handle:'sandalia-v-dorado-negra-ws5180',               title:'Sandalia V Dorado Negra',           price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:35, handle:'mule-plataforma-doble-hebilla-blanca-fzl0033', title:'Mule Plataforma Doble Hebilla',     price:'14.99', cat:'MULES',      tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:36, handle:'sandalia-deportiva-camel-ws5126',              title:'Sandalia Deportiva Camel',          price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:37, handle:'alpargata-tiras-multicolor-wl0800',            title:'Alpargata Tiras Multicolor',        price:'14.99', cat:'ALPARGATAS', tag:'NUEVO', img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:38, handle:'sandalia-boho-negra-jf2156',                   title:'Sandalia Boho Negra con Gemas',     price:'14.99', cat:'SANDALIAS',  tag:'NUEVO', img:'https://cdn.shopify.com/s/files/1/1022/4546/6454/files/WhatsAppImage2026-05-01at17.05.31.jpg?v=1777656195', sizes:['36','37','38','39','40','41'] },
  { id:39, handle:'sandalia-etnica-piedras-blanca-jf4704',        title:'Sandalia Étnica Piedras Blanca',    price:'14.99', cat:'SANDALIAS',  tag:'',      img:'https://cdn.shopify.com/s/files/1/1022/4546/6454/files/WhatsAppImage2026-05-01at16.53.32_8.jpg?v=1777656061', sizes:['36','37','38','39','40','41'] },
  { id:40, handle:'sandalia-conchas-beige-3743',                  title:'Sandalia Conchas Beige',            price:'14.99', cat:'SANDALIAS',  tag:'',      img:PLACEHOLDER, sizes:['36','37','38','39','40','41'] },
  { id:41, handle:'mule-etnico-negro-brillantes-jf4701',          title:'Mule Étnico Negro con Brillantes',  price:'14.99', cat:'MULES',      tag:'NUEVO', img:'https://cdn.shopify.com/s/files/1/1022/4546/6454/files/WhatsAppImage2026-05-01at16.53.35.jpg?v=1777655851', sizes:['36','37','38','39','40','41'] },
]

const CATS = ['TODOS','SANDALIAS','MULES','ALPARGATAS','TACONES','ZAPATILLAS']

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ onCart, cartCount }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff',
      borderBottom: scrolled ? '1px solid #eee' : '1px solid transparent',
      transition: 'border-color .3s',
    }}>
      <div style={{ maxWidth: 1800, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>
        {/* Left */}
        <div style={{ display: 'flex', gap: 32, fontSize: 11, letterSpacing: 2, color: '#000' }}>
          <span style={{ cursor: 'pointer', opacity: 0.5 }}>COLECCIÓN</span>
          <span style={{ cursor: 'pointer', opacity: 0.5 }}>INFO</span>
        </div>

        {/* Logo — centered */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, letterSpacing: 10, lineHeight: 1 }}>
            STYLO
          </div>
          <div style={{ fontSize: 8, letterSpacing: 6, color: '#999', marginTop: 3 }}>TACONES</div>
        </div>

        {/* Right — cart */}
        <button onClick={onCart} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: 2 }}>
          <span>CESTA ({cartCount})</span>
        </button>
      </div>
    </nav>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ cursor: 'pointer', marginBottom: 20 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(product)}
    >
      <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f7f7f7', position: 'relative' }}>
        <img
          src={product.img}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .4s ease, transform .5s ease', opacity: hov ? 0.85 : 1, transform: hov ? 'scale(1.03)' : 'scale(1)' }}
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        {product.tag && (
          <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 9, letterSpacing: 2, background: '#fff', padding: '4px 12px', color: '#000' }}>
            {product.tag}
          </div>
        )}
      </div>
      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5, color: '#000' }}>{product.title}</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: '#555' }}>{product.price} EUR</div>
      </div>
    </div>
  )
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, wishlist, onWishlist }) {
  const [selSize, setSelSize] = useState(null)
  const [err, setErr] = useState(false)

  const handleBuy = () => {
    if (!selSize) { setErr(true); setTimeout(() => setErr(false), 2000); return }
    window.location.href = shopifyUrl(product.handle)
  }

  if (!product) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', maxWidth: 860, width: '100%', maxHeight: '92vh', overflow: 'auto', display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div style={{ background: '#f7f7f7', minHeight: 420, position: 'relative' }}>
          <img src={product.img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 420, display: 'block' }} onError={e => { e.target.src = PLACEHOLDER }} />
          {product.tag && <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 9, letterSpacing: 2, background: '#fff', padding: '4px 12px' }}>{product.tag}</div>}
        </div>

        {/* Info */}
        <div style={{ padding: '48px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: '#999', marginBottom: 10 }}>{product.cat}</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, letterSpacing: 1, lineHeight: 1.2, margin: '0 0 12px' }}>{product.title}</h2>
              <div style={{ fontSize: 16, fontWeight: 300 }}>{product.price} EUR</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}><IconX /></button>
          </div>

          {/* Sizes */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#999', marginBottom: 12 }}>TALLA (EU)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelSize(s)} style={{
                  border: selSize === s ? '1px solid #000' : '1px solid #ddd',
                  background: selSize === s ? '#000' : '#fff',
                  color: selSize === s ? '#fff' : '#000',
                  padding: '9px 14px', cursor: 'pointer', fontSize: 12, letterSpacing: 1, fontFamily: 'inherit', transition: 'all .2s',
                }}>{s}</button>
              ))}
            </div>
            {err && <div style={{ fontSize: 10, color: '#c00', marginTop: 8, letterSpacing: 1 }}>↑ Por favor selecciona una talla</div>}
          </div>

          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.9, margin: 0 }}>
            Calzado de moda femenina. Diseño exclusivo. Tallas EU {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}.
          </p>

          {/* CTA */}
          <button
            onClick={handleBuy}
            style={{ background: '#000', color: '#fff', border: 'none', padding: '16px', fontSize: 11, letterSpacing: 3, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .2s' }}
            onMouseEnter={e => e.target.style.opacity = '.75'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            COMPRAR AHORA
          </button>

          <div style={{ display: 'flex', gap: 20, fontSize: 10, color: '#bbb', letterSpacing: 1 }}>
            <span>🚚 Envío gratis +€30</span>
            <span>↩ 30 días</span>
            <span>💳 Contra reembolso</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onRemove }) {
  const total = cart.reduce((s, x) => s + parseFloat(x.price) * x.qty, 0)
  const count = cart.reduce((s, x) => s + x.qty, 0)
  const freeAt = 30
  const isFreeShipping = total >= freeAt || count >= 2

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(420px,100vw)', background: '#fff', display: 'flex', flexDirection: 'column', animation: 'slideR .35s cubic-bezier(.4,0,.2,1)' }}>
        {/* Header */}
        <div style={{ padding: '28px 32px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400 }}>Tu Cesta</div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: 2, marginTop: 4 }}>{count} {count === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}><IconX /></button>
        </div>

        {/* Free shipping nudge bar */}
        {count === 1 && !isFreeShipping && (
          <div style={{ padding: '14px 32px', background: '#fffbf0', borderBottom: '1px solid #f0e8d0' }}>
            <div style={{ fontSize: 11, color: '#8a6a00', letterSpacing: 1, marginBottom: 10 }}>
              👟 ¡Solo te falta <strong>1 par más</strong> para tener envío gratis!
            </div>
            <div style={{ height: 2, background: '#f0e0aa' }}>
              <div style={{ height: '100%', width: '50%', background: '#c8a000', transition: 'width .4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: '#b8a060', letterSpacing: 1 }}>
              <span>1 PAR</span><span>2 PARES = ENVÍO GRATIS ✓</span>
            </div>
          </div>
        )}
        {count === 0 && total < freeAt && total > 0 && (
          <div style={{ padding: '12px 32px', background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: 1, marginBottom: 8 }}>Añade €{(freeAt - total).toFixed(2)} o 1 par más para envío gratis</div>
            <div style={{ height: 2, background: '#eee' }}>
              <div style={{ height: '100%', width: `${(total / freeAt) * 100}%`, background: '#000', transition: 'width .4s' }} />
            </div>
          </div>
        )}
        {isFreeShipping && total > 0 && (
          <div style={{ padding: '12px 32px', background: '#f0faf4', borderBottom: '1px solid #d0eedd', fontSize: 10, color: '#2d8a4e', letterSpacing: 1 }}>
            ✓ ¡Tienes envío gratis!
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#ccc' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 12 }}>Vacía</div>
              <div style={{ fontSize: 10, letterSpacing: 3 }}>TU CESTA ESTÁ VACÍA</div>
            </div>
          ) : cart.map((item, i) => (
            <div key={`${item.id}-${item.size}-${i}`} style={{ display: 'flex', gap: 16, padding: '24px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
              <img src={item.img} alt={item.title} style={{ width: 72, height: 90, objectFit: 'cover', background: '#f7f7f7' }} onError={e => { e.target.src = PLACEHOLDER }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: 1.5, marginBottom: 5, textTransform: 'uppercase' }}>{item.title}</div>
                <div style={{ fontSize: 10, color: '#999', letterSpacing: 2, marginBottom: 6 }}>EU {item.size} · Cant: {item.qty}</div>
                <div style={{ fontSize: 13, fontWeight: 300 }}>{(parseFloat(item.price) * item.qty).toFixed(2)} EUR</div>
              </div>
              <button onClick={() => onRemove(item.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3 }}><IconX /></button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '24px 32px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#999', letterSpacing: 1 }}>SUBTOTAL</span>
              <span style={{ fontSize: 13 }}>{total.toFixed(2)} EUR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: '#999', letterSpacing: 1 }}>ENVÍO</span>
              <span style={{ fontSize: 11, color: isFreeShipping ? '#2d8a4e' : '#000' }}>{isFreeShipping ? 'GRATIS' : '€4.95'}</span>
            </div>
            <button
            onClick={() => {
              goToCheckout()
            }}
              style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '18px', fontSize: 11, letterSpacing: 3, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}
            >
              FINALIZAR COMPRA — {(total + (isFreeShipping ? 0 : 4.95)).toFixed(2)} EUR
            </button>
            <button onClick={onClose} style={{ width: '100%', background: 'none', color: '#000', border: '1px solid #eee', padding: '16px', fontSize: 11, letterSpacing: 3, cursor: 'pointer', fontFamily: 'inherit' }}>
              SEGUIR COMPRANDO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [filter, setFilter] = useState('TODOS')
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [notif, setNotif] = useState(null)
  const [variantMap, setVariantMap] = useState({})

  useEffect(() => {
    fetchVariantMap().then(map => setVariantMap(map))
  }, [])

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(null), 2500) }

  const addToCart = (product, size) => {
    const variantId = (variantMap[product.handle] || []).find(v => v.size === size)?.id || null
    setCart(c => {
      const ex = c.find(x => x.id === product.id && x.size === size)
      if (ex) return c.map(x => x.id === product.id && x.size === size ? { ...x, qty: x.qty + 1 } : x)
      return [...c, { ...product, qty: 1, size, variantId }]
    })
    notify(`${product.title} añadido`)
  }

  const goToCheckout = () => {
    if (cart.length === 0) return
    const allHaveVariants = cart.every(i => i.variantId)
    if (allHaveVariants) {
      const items = cart.map(i => `${i.variantId}:${i.qty}`).join(',')
      window.location.href = `https://${SHOPIFY_CHECKOUT}/cart/${items}`
    } else {
      window.location.href = `https://${SHOPIFY_CHECKOUT}/products/${cart[0].handle}`
    }
  }

  const removeFromCart = (id, size) => setCart(c => c.filter(x => !(x.id === id && x.size === size)))
  const toggleWishlist = id => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  const cartCount = cart.reduce((s, x) => s + x.qty, 0)

  const displayed = PRODUCTS.filter(p => filter === 'TODOS' || p.cat === filter)

  return (
    <div style={{ background: '#fff', minHeight: '100vh', color: '#000', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Jost:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideR { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        body { overflow-x: hidden; }
      `}</style>

      {/* Notification */}
      {notif && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#000', color: '#fff', padding: '12px 24px', fontSize: 11, letterSpacing: 2, zIndex: 1000, animation: 'fadeUp .3s ease' }}>
          {notif}
        </div>
      )}

      {/* Promo bar */}
      <div style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: 10, letterSpacing: 2.5 }}>
        ENVÍO GRATIS en pedidos +€30 &nbsp;·&nbsp; O AL COMPRAR CUALQUIER 2 PARES &nbsp;·&nbsp; ¡COMBINA ESTILOS!
      </div>

      <Navbar onCart={() => setCartOpen(true)} cartCount={cartCount} />

      {/* Editorial Header */}
      <header style={{ padding: window.innerWidth < 640 ? '40px 20px 30px' : '80px 40px 40px', maxWidth: 1600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 8vw, 120px)', fontWeight: 400, margin: 0, lineHeight: 0.9, letterSpacing: -1 }}>
          Primavera / <br /> Verano 26
        </h1>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 32, marginTop: 48, borderBottom: '1px solid #000', paddingBottom: 16, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, letterSpacing: 2, fontFamily: 'inherit',
                fontWeight: filter === c ? 700 : 400,
                opacity: filter === c ? 1 : 0.4,
                transition: 'opacity .2s, font-weight .2s',
                paddingBottom: filter === c ? 14 : 0,
                borderBottom: filter === c ? '2px solid #000' : 'none',
                marginBottom: filter === c ? -17 : 0,
              }}
            >
              {c}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#999', letterSpacing: 1, alignSelf: 'center' }}>
            {displayed.length} modelos
          </span>
        </div>
      </header>

      {/* Editorial Grid */}
      <main style={{ padding: '60px 20px 120px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? 'repeat(2, 1fr)' : 'repeat(12, 1fr)', gap: '24px' }}>
          {displayed.map((p, i) => (
            <div
              key={p.id}
              style={{
                gridColumn: window.innerWidth < 640 ? 'span 1' : (i % 3 === 0 ? 'span 7' : 'span 5'),
                marginTop: window.innerWidth < 640 ? '0' : (i % 2 !== 0 ? '80px' : '0'),
              }}
            >
              <ProductCard product={p} onSelect={setSelected} />
            </div>
          ))}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={{ padding: '60px 40px 40px', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, letterSpacing: 6 }}>STYLO TACONES</div>
          <div style={{ display: 'flex', gap: 40, fontSize: 10, letterSpacing: 2, color: '#999' }}>
            <span style={{ cursor: 'pointer' }}>INSTAGRAM</span>
            <span style={{ cursor: 'pointer' }}>TIKTOK</span>
            <span style={{ cursor: 'pointer' }}>CONTACTO</span>
            <span style={{ cursor: 'pointer' }}>DEVOLUCIONES</span>
          </div>
          <div style={{ fontSize: 10, color: '#ccc', letterSpacing: 1 }}>© 2026 STYLO TACONES · SPAIN</div>
        </div>
      </footer>

      {/* Cart */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />}

      {/* Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          wishlist={wishlist}
          onWishlist={toggleWishlist}
        />
      )}
    </div>
  )
}
