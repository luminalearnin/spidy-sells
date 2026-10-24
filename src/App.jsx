import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Clock3, Crosshair, MapPin, Menu, Minus, MoveRight, Navigation, PackageCheck, Plus, ShoppingBag, Sparkles, Truck, UserRound, X } from 'lucide-react';

const ASSET = '/manus-storage/async-images/yxV2yI1aELIhMqDoqpldDe/';
const products = [
  { id: 'classic', name: 'Classic Tiramisu', note: 'Espresso · Mascarpone · Cocoa', price: 130, category: 'signature', status: 'Available today', image: `${ASSET}image-2.webp`, tone: 'warm' },
  { id: 'pistachio', name: 'Pistachio Cloud', note: 'Sicilian pistachio · Vanilla cream', price: 160, category: 'signature', status: 'Only 8 left', image: `${ASSET}image-3.webp`, tone: 'pistachio' },
  { id: 'cocoa', name: 'Midnight Cocoa', note: '72% dark chocolate · Cold brew', price: 150, category: 'limited', status: 'Batch at 5:30 PM', image: `${ASSET}image-2.webp`, tone: 'dark' },
  { id: 'box', name: 'The Park Circus Box', note: 'A six-piece tasting flight', price: 780, category: 'boxes', status: 'Pre-order only', image: `${ASSET}image-3.webp`, tone: 'ivory' },
];
const slots = ['4:00 PM', '4:45 PM', '5:30 PM', '6:15 PM', '7:00 PM', '7:30 PM'];

function money(value) { return `₹${value.toLocaleString('en-IN')}`; }
function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const next = new Date(); next.setHours(19, 30, 0, 0);
  if (next.getTime() < now) next.setDate(next.getDate() + 1);
  const diff = Math.max(0, next.getTime() - now);
  return { hours: String(Math.floor(diff / 3600000)).padStart(2, '0'), minutes: String(Math.floor((diff / 60000) % 60)).padStart(2, '0'), seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0') };
}

function Drawer({ title, eyebrow, onClose, children, className = '' }) {
  return <div className="overlay" onMouseDown={onClose}><aside className={`drawer ${className}`} onMouseDown={e => e.stopPropagation()}><div className="drawer-head"><div><span className="micro-label">{eyebrow}</span><h3>{title}</h3></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</aside></div>;
}

function App() {
  const countdown = useCountdown();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('curated');
  const [fulfillment, setFulfillment] = useState('delivery');
  const [slot, setSlot] = useState('5:30 PM');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');

  const visibleProducts = useMemo(() => {
    let list = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, sort]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function flash(message) { setNotice(message); window.setTimeout(() => setNotice(''), 2600); }
  function addToCart(product) {
    setCart(current => { const found = current.find(item => item.id === product.id); return found ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }]; });
    flash(`${product.name} added to your batch`);
  }
  function updateQty(id, delta) { setCart(current => current.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(item => item.qty)); }
  function removeItem(id) { setCart(current => current.filter(item => item.id !== id)); }
  function buyNow(product) { addToCart(product); setCheckoutOpen(true); }
  function confirmOrder(channel) {
    const order = `Hi Spidy Sells, I'd like to pre-order ${cart.map(i => `${i.qty}x ${i.name}`).join(', ')} for ${slot} (${fulfillment}).`;
    if (channel === 'whatsapp') window.open(`https://wa.me/919830000000?text=${encodeURIComponent(order)}`, '_blank', 'noopener,noreferrer');
    if (channel === 'upi') window.location.href = `upi://pay?pa=spidysells@upi&pn=Spidy%20Sells&am=${subtotal}&cu=INR`;
    flash(channel === 'whatsapp' ? 'Opening WhatsApp order confirmation' : 'Opening your UPI app');
  }
  function requestOtp(e) { e.preventDefault(); if (!email) return; setOtpSent(true); flash('OTP sent — check your inbox'); }

  return <div className="site-shell">
    {notice && <div className="toast"><Check size={16} /> {notice}</div>}
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Spidy Sells home"><span>spidy</span><b>sells</b><i>®</i></a>
      <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`}>
        <a href="#shop">Menu</a><a href="#story">Our story</a><a href="#preorder">Delivery</a>
      </nav>
      <div className="header-actions"><button className="text-button account-button" onClick={() => setAuthOpen(true)}><UserRound size={15} /> <span>Sign in</span></button><button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /><span>Bag</span><em>{cartCount}</em></button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><Menu size={20} /></button></div>
    </header>

    <main id="top">
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,10,10,.86) 0%, rgba(10,10,10,.42) 55%, rgba(10,10,10,.18) 100%), url(${ASSET}image-1.webp)` }}>
        <div className="hero-noise" />
        <div className="hero-content"><p className="eyebrow light"><Sparkles size={13} /> Park Circus, Kolkata · Batch 042</p><h1>A little<br /><em>obsession</em><br />in a jar.</h1><p className="hero-copy">Hand-layered tiramisu, made in small daily batches. Born on the streets of Park Circus. Delivered before the craving fades.</p><div className="hero-ctas"><a className="button button-light" href="#shop">Shop the batch <ArrowDownRight size={16} /></a><a className="hero-link" href="#story">Read our story <MoveRight size={16} /></a></div></div>
        <div className="batch-card"><div className="batch-card-top"><span>Today’s batch closes in</span><Clock3 size={15} /></div><div className="countdown"><span>{countdown.hours}<small>hrs</small></span><b>:</b><span>{countdown.minutes}<small>min</small></span><b>:</b><span>{countdown.seconds}<small>sec</small></span></div><div className="batch-progress"><i /></div><div className="batch-card-bottom"><span>82% claimed</span><a href="#preorder">Reserve yours <ArrowUpRight size={14} /></a></div></div>
        <div className="hero-index">01 <span>/</span> 04</div><a className="scroll-cue" href="#shop"><span>Scroll to explore</span><ArrowDownRight size={16} /></a>
      </section>

      <section className="intro-strip"><p>Not a cloud kitchen.<br /><strong>Not quite a bakery.</strong></p><div className="intro-rule" /><p className="strip-detail">We are the in-between.<br /><span>Slow craft. Fast cravings.</span></p><div className="strip-stamp">SS<br /><small>EST. 2021</small></div></section>

      <section className="section shop-section" id="shop"><div className="section-heading"><div><p className="eyebrow">The daily menu</p><h2>Made today.<br /><em>Gone today.</em></h2></div><p className="section-note">Every jar is layered by hand and released in small batches. No freezers. No shortcuts. Just the good stuff.</p></div><div className="shop-toolbar"><div className="category-tabs">{[['all','All'],['signature','Signatures'],['limited','Limited'],['boxes','Boxes']].map(([id,label]) => <button className={activeCategory === id ? 'active' : ''} onClick={() => setActiveCategory(id)} key={id}>{label}</button>)}</div><label className="sort-select"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="curated">Curated</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={14} /></label></div><div className="product-grid">{visibleProducts.map((product, index) => <article className={`product-card ${index === 0 ? 'featured' : ''}`} key={product.id}><div className={`product-media ${product.tone}`} style={{ backgroundImage: `url(${product.image})` }}><span className="product-status"><i /> {product.status}</span><button className="quick-add" onClick={() => addToCart(product)}><Plus size={18} /></button><span className="product-number">0{index + 1}</span></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.note}</p></div><div className="product-buy"><strong>{money(product.price)}</strong><button onClick={() => buyNow(product)}>Buy now <ArrowUpRight size={14} /></button></div></div></article>)}</div></section>

      <section className="story-section section" id="story"><div className="story-visual"><div className="story-frame"><div className="story-circle">SS</div><span>Somewhere<br />in Park Circus</span></div><div className="story-caption">A neighborhood ritual,<br /><em>re-layered.</em></div></div><div className="story-copy"><p className="eyebrow">Our story · 01</p><h2>From a pushcart<br />to your <em>desk.</em></h2><p>In 2021, Spidy started with one borrowed whisk, a tiny Park Circus pushcart and a very specific idea of what tiramisu could be.</p><p>We still make every jar in small batches — layering espresso-soaked fingers, cloud-soft mascarpone and a final snowfall of cocoa. The only thing that changed is how far the jars travel.</p><a className="underlined-link" href="#preorder">Meet the makers <MoveRight size={15} /></a><div className="story-meta"><span>01 <small>/</small> 04</span><span>Park Circus, Kolkata</span></div></div></section>

      <section className="preorder-section" id="preorder"><div className="section preorder-inner"><div className="section-heading preorder-heading"><div><p className="eyebrow light">Your neighborhood drop</p><h2>Pick a time.<br /><em>We’ll do the rest.</em></h2></div><p className="section-note light-note">Every order leaves our Park Circus kitchen within the hour. Choose a slot and we’ll keep your batch aside.</p></div><div className="preorder-grid"><div className="fulfillment-card"><div className="toggle-row"><button className={fulfillment === 'delivery' ? 'active' : ''} onClick={() => setFulfillment('delivery')}><Truck size={16} /> Delivery</button><button className={fulfillment === 'pickup' ? 'active' : ''} onClick={() => setFulfillment('pickup')}><PackageCheck size={16} /> Pickup</button></div><div className="slot-label"><span>Choose a {fulfillment} slot</span><span>Today · 24 Aug</span></div><div className="slot-grid">{slots.map(item => <button className={slot === item ? 'active' : ''} onClick={() => setSlot(item)} key={item}>{item}</button>)}</div><div className="fulfillment-note"><Check size={15} /><span>We’ll send a WhatsApp update when your batch is out for {fulfillment}.</span></div><button className="button button-ivory full" onClick={() => { if (!cart.length) addToCart(products[0]); setCheckoutOpen(true); }}>Continue to checkout <MoveRight size={16} /></button></div><div className="map-card"><div className="map-label"><MapPin size={15} /> Park Circus, Kolkata</div><div className="map-grid" /><div className="map-pin"><span><Crosshair size={17} /></span><b>You’re here</b></div><div className="map-roads"><i /><i /><i /></div><div className="map-footer"><span><Navigation size={14} /> 2.4 km radius</span><span>Live fulfillment map</span></div></div></div></div></section>

      <section className="manifesto section"><div className="manifesto-mark">SS</div><p>“A tiramisu for people<br />who <em>don’t do</em> ordinary.”</p><div className="manifesto-sign">— The Spidy Sells promise</div></section>
    </main>

    <footer className="site-footer"><div><a className="wordmark footer-wordmark" href="#top"><span>spidy</span><b>sells</b><i>®</i></a><p>Small-batch tiramisu.<br />Big Park Circus energy.</p></div><div className="footer-links"><div><span>Explore</span><a href="#shop">Menu</a><a href="#story">Our story</a><a href="#preorder">Delivery</a></div><div><span>Say hi</span><a href="mailto:hello@spidysells.in">Email us</a><a href="https://instagram.com" target="_blank" rel="noreferrer">◎ Instagram</a></div></div><div className="footer-bottom"><span>© 2024 Spidy Sells</span><span>Made in Kolkata, with unreasonable amounts of mascarpone.</span></div></footer>

    {cartOpen && <Drawer title="Your batch" eyebrow={`${cartCount} item${cartCount === 1 ? '' : 's'}`} onClose={() => setCartOpen(false)}>{cart.length ? <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><div className="cart-thumb" style={{ backgroundImage: `url(${item.image})` }} /><div className="cart-item-copy"><strong>{item.name}</strong><span>{money(item.price)}</span><div className="qty-control"><button onClick={() => updateQty(item.id, -1)}><Minus size={13} /></button><b>{item.qty}</b><button onClick={() => updateQty(item.id, 1)}><Plus size={13} /></button><button className="remove-link" onClick={() => removeItem(item.id)}>Remove</button></div></div></div>)}</div><div className="drawer-spacer" /><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><small>Taxes and delivery calculated at checkout.</small><button className="button button-dark full" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Checkout <ArrowUpRight size={15} /></button><button className="drawer-link" onClick={() => { setCartOpen(false); document.getElementById('preorder').scrollIntoView({ behavior: 'smooth' }); }}>Choose delivery slot <MoveRight size={14} /></button></div></> : <div className="empty-state"><ShoppingBag size={24} /><h4>Your batch is empty</h4><p>Start with a jar of the Classic. You’ll understand.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }}>Explore the menu</button></div>}</Drawer>}
    {authOpen && <Drawer title={otpSent ? 'Check your inbox' : 'Keep me posted'} eyebrow="Account / order tracking" onClose={() => { setAuthOpen(false); setOtpSent(false); }}>{otpSent ? <div className="auth-success"><div className="success-icon"><Check /></div><h4>OTP on its way.</h4><p>We sent a one-time code to <strong>{email}</strong>. Enter it in the next step to see your active and past batches.</p><button className="button button-dark full" onClick={() => { setAuthOpen(false); setOtpSent(false); }}>Done <ArrowUpRight size={15} /></button></div> : <form className="auth-form" onSubmit={requestOtp}><p>Sign in to track your order, reserve early batches and make your next craving one tap away.</p><label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label><button className="button button-dark full" type="submit">Send me an OTP <MoveRight size={15} /></button><small>By continuing, you agree to our very short and friendly terms.</small></form>}</Drawer>}
    {checkoutOpen && <Drawer title="Almost yours" eyebrow={`${fulfillment} · ${slot}`} onClose={() => setCheckoutOpen(false)} className="checkout-drawer"><div className="checkout-summary"><div className="checkout-status"><span><i /> Batch reserved</span><span>{cartCount} items</span></div>{cart.map(item => <div className="checkout-line" key={item.id}><span>{item.qty} × {item.name}</span><strong>{money(item.price * item.qty)}</strong></div>)}<div className="checkout-total"><span>Total</span><strong>{money(subtotal)}</strong></div></div><div className="checkout-actions"><p>Choose how you’d like to confirm. UPI is instant; WhatsApp gets a human on it.</p><button className="button button-dark full" onClick={() => confirmOrder('upi')}>Pay by UPI <ArrowUpRight size={15} /></button><button className="button button-outline-dark full" onClick={() => confirmOrder('whatsapp')}>Confirm on WhatsApp <MoveRight size={15} /></button></div><div className="checkout-trust"><Check size={14} /> No account needed · Secure handoff · Local delivery</div></Drawer>}
  </div>;
}

export default App;
