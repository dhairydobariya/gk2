import { useState, useEffect, useRef } from 'react';
import { getProductsData } from '../utils/dataManager';

const WA_NUMBER = '918460645021';

// Build WhatsApp message — skip empty fields
function buildMessage(fields) {
  const lines = ['Hello GK2 Switchgear,', '', 'I would like to request a quote for the following:'];
  if (fields.name)   lines.push(`\n*Name:* ${fields.name}`);
  if (fields.mobile) lines.push(`*Mobile:* ${fields.mobile}`);
  if (fields.email)  lines.push(`*Email:* ${fields.email}`);

  if (fields.products?.length) {
    lines.push('\n*Products Required:*');
    let lineNum = 1;
    fields.products.forEach(p => {
      if (p.selectedRatings?.length) {
        p.selectedRatings.forEach(r => {
          lines.push(`${lineNum++}. ${p.name} — ${r.label} × ${r.qty}`);
        });
      } else {
        lines.push(`${lineNum++}. ${p.name}`);
      }
    });
  }

  if (fields.remark) lines.push(`\n*Remarks:* ${fields.remark}`);
  lines.push('\nThank you.');
  return lines.join('\n');
}

// Format variant label
function variantLabel(v) {
  let label = v.capacity;
  if (v.size && v.size !== '' && v.size !== '0' && v.size !== '1') label += ` (${v.size})`;
  if (v.poles && v.poles !== '—') label += ` · ${v.poles}`;
  return label;
}

// ── PRODUCT ROW ───────────────────────────────────────────────────────────────
function ProductRow({ row, index, onUpdate, onRemove, allProducts }) {
  const product = allProducts.find(p => p.id === row.productId);
  const variants = product?.variants || [];

  // Toggle a rating on/off
  const toggleRating = (v) => {
    const label = variantLabel(v);
    const existing = row.selectedRatings || [];
    const idx = existing.findIndex(r => r.label === label);
    if (idx >= 0) {
      onUpdate(index, 'selectedRatings', existing.filter((_, i) => i !== idx));
    } else {
      onUpdate(index, 'selectedRatings', [...existing, { label, qty: 1 }]);
    }
  };

  const updateRatingQty = (label, qty) => {
    const updated = (row.selectedRatings || []).map(r =>
      r.label === label ? { ...r, qty: Math.max(1, qty) } : r
    );
    onUpdate(index, 'selectedRatings', updated);
  };

  const isSelected = (v) => (row.selectedRatings || []).some(r => r.label === variantLabel(v));

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product {index + 1}</span>
        {index > 0 && (
          <button type="button" onClick={() => onRemove(index)} aria-label="Remove product"
            className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">
            Remove
          </button>
        )}
      </div>

      {/* Product dropdown */}
      <select
        value={row.productId}
        onChange={e => onUpdate(index, 'productId', e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <option value="">Select a product</option>
        {allProducts.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Rating toggle buttons — multi-select */}
      {variants.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Select Rating(s):</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, vi) => {
              const label = variantLabel(v);
              const selected = isSelected(v);
              return (
                <button
                  key={vi}
                  type="button"
                  onClick={() => toggleRating(v)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all duration-150 ${
                    selected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
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

      {/* Qty per selected rating */}
      {(row.selectedRatings || []).length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-gray-600">Quantity per rating:</p>
          {(row.selectedRatings || []).map((r) => (
            <div key={r.label} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-2">
              <span className="text-xs font-semibold text-blue-700 flex-1">{r.label}</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-3">
                <button type="button" aria-label="Decrease"
                  onClick={() => updateRatingQty(r.label, r.qty - 1)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm transition-colors">−</button>
                <input
                  type="number" min="1" value={r.qty}
                  onChange={e => updateRatingQty(r.label, parseInt(e.target.value) || 1)}
                  aria-label={`Quantity for ${r.label}`}
                  className="w-12 text-center text-sm font-semibold border-x border-gray-200 py-1 focus:outline-none"
                />
                <button type="button" aria-label="Increase"
                  onClick={() => updateRatingQty(r.label, r.qty + 1)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm transition-colors">+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No variants — single qty */}
      {variants.length === 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 shrink-0">Qty:</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button type="button" aria-label="Decrease"
              onClick={() => onUpdate(index, 'qty', Math.max(1, (row.qty || 1) - 1))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm transition-colors">−</button>
            <input type="number" min="1" value={row.qty || 1}
              onChange={e => onUpdate(index, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="Quantity"
              className="w-14 text-center text-sm font-semibold border-x border-gray-200 py-1.5 focus:outline-none"
            />
            <button type="button" aria-label="Increase"
              onClick={() => onUpdate(index, 'qty', (row.qty || 1) + 1)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 text-sm transition-colors">+</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN MODAL ────────────────────────────────────────────────────────────────
export default function QuoteModal({ isOpen, onClose, initialProduct = null }) {
  const { products } = getProductsData();

  const emptyRow = () => ({
    productId: initialProduct?.id || '',
    selectedRatings: initialProduct?.variants?.length
      ? [{ label: variantLabel(initialProduct.variants[0]), qty: 1 }]
      : [],
    qty: 1,
  });

  const [form, setForm] = useState({ name: '', mobile: '', email: '', remark: '' });
  const [rows, setRows] = useState([emptyRow()]);
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', mobile: '', email: '', remark: '' });
      setRows([emptyRow()]);
      setErrors({});
    }
  }, [isOpen, initialProduct?.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const updateRow = (i, field, value) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      // Reset selections when product changes
      if (field === 'productId') next[i].selectedRatings = [];
      return next;
    });
  };

  const addRow = () => setRows(prev => [...prev, { productId: '', selectedRatings: [], qty: 1 }]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (rows.every(r => !r.productId)) errs.products = 'Please select at least one product';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const productLines = rows
      .filter(r => r.productId)
      .map(r => {
        const p = products.find(pr => pr.id === r.productId);
        return {
          name: p?.name || r.productId,
          selectedRatings: r.selectedRatings?.length ? r.selectedRatings : null,
          qty: r.qty,
        };
      });

    const msg = buildMessage({ ...form, products: productLines });
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-900 text-lg">Request a Quote</h2>
            <p className="text-xs text-gray-400 mt-0.5">We'll reply on WhatsApp within 24 hours</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors text-lg">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name" value={form.name} onChange={handleFormChange}
                placeholder="Your name"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile" value={form.mobile} onChange={handleFormChange}
                placeholder="10-digit mobile"
                maxLength={10}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.mobile ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              name="email" type="email" value={form.email} onChange={handleFormChange}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700">
                Products Required <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={addRow}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
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

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="remark" value={form.remark} onChange={handleFormChange}
              rows={3} placeholder="Any additional details, delivery location, urgency, etc."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
            </svg>
            Send via WhatsApp
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">Opens WhatsApp with your enquiry pre-filled</p>
        </div>
      </div>
    </div>
  );
}
