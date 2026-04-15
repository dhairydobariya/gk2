import { useState, useEffect, useRef } from 'react';
import { getProductsData } from '../utils/dataManager';
import logo from '../assets/logo.png';

const WA_NUMBER = '918460645021';

function buildMessage(fields) {
  const lines = ['Hello GK2 Switchgear,', '', 'I would like to request a quote:'];
  if (fields.name)    lines.push(`\n*Name:* ${fields.name}`);
  if (fields.company) lines.push(`*Company:* ${fields.company}`);
  if (fields.mobile)  lines.push(`*Mobile:* ${fields.mobile}`);
  if (fields.email)   lines.push(`*Email:* ${fields.email}`);
  if (fields.products?.length) {
    lines.push('\n*Products Required:*');
    let n = 1;
    fields.products.forEach(p => {
      if (p.selectedRatings?.length) {
        p.selectedRatings.forEach(r => { lines.push(`${n++}. ${p.name} — ${r.label} x ${r.qty}`); });
      } else {
        lines.push(`${n++}. ${p.name}`);
      }
    });
  }
  if (fields.remark) lines.push(`\n*Remarks:* ${fields.remark}`);
  lines.push('\nThank you.');
  return lines.join('\n');
}

function variantLabel(v) {
  let label = v.capacity;
  if (v.size && v.size !== '' && v.size !== '0' && v.size !== '1') label += ` (${v.size})`;
  if (v.poles && v.poles !== '-') label += ` - ${v.poles}`;
  return label;
}

function Field({ label, required, optional, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`;

function ProductRow({ row, index, onUpdate, onRemove, allProducts }) {
  const product = allProducts.find(p => p.id === row.productId);
  const variants = product?.variants || [];

  const toggleRating = (v) => {
    const label = variantLabel(v);
    const existing = row.selectedRatings || [];
    const idx = existing.findIndex(r => r.label === label);
    onUpdate(index, 'selectedRatings',
      idx >= 0 ? existing.filter((_, i) => i !== idx) : [...existing, { label, qty: 1 }]
    );
  };

  const updateRatingQty = (label, qty) => {
    onUpdate(index, 'selectedRatings',
      (row.selectedRatings || []).map(r => r.label === label ? { ...r, qty: Math.max(1, qty) } : r)
    );
  };

  const isSelected = (v) => (row.selectedRatings || []).some(r => r.label === variantLabel(v));

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product {index + 1}</span>
        {index > 0 && (
          <button type="button" onClick={() => onRemove(index)} aria-label="Remove"
            className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">Remove</button>
        )}
      </div>
      <select value={row.productId} onChange={e => onUpdate(index, 'productId', e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
        <option value="">Select a product</option>
        {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {variants.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Select Rating(s):</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, vi) => {
              const selected = isSelected(v);
              return (
                <button key={vi} type="button" onClick={() => toggleRating(v)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all duration-150 ${selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400'}`}>
                  {v.capacity}
                  {v.size && v.size !== '' && v.size !== '0' && v.size !== '1' && (
                    <span className="block text-[10px] font-normal opacity-80">{v.size}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {(row.selectedRatings || []).length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-gray-600">Quantity per rating:</p>
          {(row.selectedRatings || []).map(r => (
            <div key={r.label} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-2">
              <span className="text-xs font-semibold text-blue-700 flex-1">{r.label}</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-3">
                <button type="button" aria-label="Decrease" onClick={() => updateRatingQty(r.label, r.qty - 1)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm">-</button>
                <input type="number" min="1" value={r.qty}
                  onChange={e => updateRatingQty(r.label, parseInt(e.target.value) || 1)}
                  aria-label={`Qty for ${r.label}`}
                  className="w-12 text-center text-sm font-semibold border-x border-gray-200 py-1 focus:outline-none" />
                <button type="button" aria-label="Increase" onClick={() => updateRatingQty(r.label, r.qty + 1)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {variants.length === 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 shrink-0">Qty:</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button type="button" aria-label="Decrease" onClick={() => onUpdate(index, 'qty', Math.max(1, (row.qty || 1) - 1))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm">-</button>
            <input type="number" min="1" value={row.qty || 1}
              onChange={e => onUpdate(index, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="Quantity"
              className="w-14 text-center text-sm font-semibold border-x border-gray-200 py-1.5 focus:outline-none" />
            <button type="button" aria-label="Increase" onClick={() => onUpdate(index, 'qty', (row.qty || 1) + 1)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm">+</button>
          </div>
        </div>
      )}
    </div>
  );
}

function WaButton({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
      Send Enquiry via WhatsApp
    </button>
  );
}

export default function QuoteModal({ isOpen, onClose, initialProduct = null }) {
  const { products } = getProductsData();

  const emptyRow = () => ({
    productId: initialProduct?.id || '',
    selectedRatings: initialProduct?.variants?.length
      ? [{ label: variantLabel(initialProduct.variants[0]), qty: 1 }]
      : [],
    qty: 1,
  });

  const [form, setForm] = useState({ name: '', company: '', mobile: '', email: '', remark: '' });
  const [rows, setRows] = useState([emptyRow()]);
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);

  // Animation state — keep mounted during close animation
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small delay so CSS transition triggers after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setForm({ name: '', company: '', mobile: '', email: '', remark: '' });
      setRows([emptyRow()]);
      setErrors({});
    } else {
      setVisible(false);
      // Unmount after transition completes
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialProduct?.id]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const updateRow = (i, field, value) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      if (field === 'productId') next[i].selectedRatings = [];
      return next;
    });
  };

  const addRow = () => setRows(prev => [{ productId: '', selectedRatings: [], qty: 1 }, ...prev]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) errs.mobile = 'Enter valid 10-digit number';
    if (rows.every(r => !r.productId)) errs.products = 'Select at least one product';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const productLines = rows.filter(r => r.productId).map(r => ({
      name: products.find(p => p.id === r.productId)?.name || r.productId,
      selectedRatings: r.selectedRatings?.length ? r.selectedRatings : null,
      qty: r.qty,
    }));
    const msg = buildMessage({ ...form, products: productLines });
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  const stepLabel = (num, text) => (
    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">{num}</span>
      {text}
    </p>
  );

  const formBody = (
    <div className="space-y-5">
      <div>
        {stepLabel(1, 'Your Details')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" required error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Rahul Shah" className={inputCls(errors.name)} />
          </Field>
          <Field label="Company / Firm" optional>
            <input name="company" value={form.company} onChange={handleChange}
              placeholder="Your company name" className={inputCls(false)} />
          </Field>
          <Field label="Mobile Number" required error={errors.mobile}>
            <input name="mobile" value={form.mobile} onChange={handleChange}
              placeholder="10-digit mobile" maxLength={10} className={inputCls(errors.mobile)} />
          </Field>
          <Field label="Email Address" optional>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" className={inputCls(false)} />
          </Field>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          {stepLabel(2, 'Products Required')}
          <button type="button" onClick={addRow}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-2.5 py-1 rounded-lg transition-colors -mt-3">
            + Add Product
          </button>
        </div>
        {errors.products && <p className="text-red-500 text-xs mb-2">{errors.products}</p>}
        <div className="space-y-3">
          {rows.map((row, i) => (
            <ProductRow key={i} row={row} index={i} onUpdate={updateRow} onRemove={removeRow} allProducts={products} />
          ))}
        </div>
      </div>

      <div>
        {stepLabel(3, 'Any Remarks (optional)')}
        <textarea name="remark" value={form.remark} onChange={handleChange}
          rows={3} placeholder="Delivery location, urgency, special requirements..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
      </div>
    </div>
  );

  return (
    <div ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{
        backgroundColor: visible ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(4px)' : 'blur(0px)',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}>

      {/* MOBILE bottom sheet */}
      <div className="sm:hidden bg-white w-full rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
        }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-900 text-base">Request a Quote</h2>
            <p className="text-xs text-gray-400 mt-0.5">Reply on WhatsApp within 24 hrs</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{formBody}</div>
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <WaButton onClick={handleSubmit} />
          <p className="text-center text-xs text-gray-400 mt-2">Opens WhatsApp with your enquiry pre-filled</p>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh]"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
        }}>

        {/* Top header bar — clean brand strip */}
        <div className="bg-[#0f172a] px-7 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <img src={logo} alt="GK2 Switchgear" width="696" height="358"
              className="h-7 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <div className="w-px h-5 bg-white/20" />
            <span className="text-white text-sm font-semibold">Request a Quote</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {['IS/IEC Certified', 'Direct Manufacturer', 'Fast Response'].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  {t}
                </span>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-sm ml-2">
              ✕
            </button>
          </div>
        </div>

        {/* Sub-header */}
        <div className="px-7 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
          <p className="text-xs text-gray-500">Fill in your details below — we will reply on WhatsApp within 24 hours with pricing.</p>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-7 py-5">{formBody}</div>

        <div className="px-7 py-5 border-t border-gray-100 shrink-0 bg-white">
          <WaButton onClick={handleSubmit} />
          <p className="text-center text-xs text-gray-400 mt-2">Opens WhatsApp with your enquiry pre-filled</p>
        </div>
      </div>
    </div>
  );
}
