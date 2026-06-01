import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/format';

export default function OrderForm({ customers, products, onSubmit, isSaving }) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

  const productMap = useMemo(() => new Map(products.map((product) => [String(product.id), product])), [products]);
  const total = items.reduce((sum, item) => {
    const product = productMap.get(String(item.product_id));
    return sum + Number(product?.price || 0) * Number(item.quantity || 0);
  }, 0);

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      customer_id: Number(customerId),
      items: items.map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) })),
    });
  };

  const canSubmit = customerId && items.every((item) => item.product_id && Number(item.quantity) > 0);

  return (
    <form className="panel mb-6 p-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="text-sm font-medium text-ink">
          Customer
          <select className="input mt-1" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.full_name}</option>
            ))}
          </select>
        </label>
        <div className="rounded-md border border-line bg-surface px-4 py-3 text-sm">
          <span className="text-slate-600">Total</span>
          <strong className="ml-2 text-ink">{formatCurrency(total)}</strong>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => {
          const product = productMap.get(String(item.product_id));
          return (
            <div key={index} className="grid gap-3 rounded-md border border-line p-3 md:grid-cols-[1fr_140px_120px_44px] md:items-end">
              <label className="text-sm font-medium text-ink">
                Product
                <select className="input mt-1" value={item.product_id} onChange={(event) => updateItem(index, { product_id: event.target.value })}>
                  <option value="">Select product</option>
                  {products.map((productOption) => (
                    <option key={productOption.id} value={productOption.id}>
                      {productOption.name} ({productOption.sku}) - {productOption.quantity_in_stock} in stock
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                Quantity
                <input className="input mt-1" min="1" type="number" value={item.quantity} onChange={(event) => updateItem(index, { quantity: event.target.value })} />
              </label>
              <div className="text-sm">
                <span className="block text-slate-600">Subtotal</span>
                <strong>{formatCurrency(Number(product?.price || 0) * Number(item.quantity || 0))}</strong>
              </div>
              <button className="btn-secondary h-10 w-11 px-0" type="button" onClick={() => removeItem(index)} disabled={items.length === 1} title="Remove item">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-secondary" type="button" onClick={() => setItems((current) => [...current, { product_id: '', quantity: 1 }])}>
          <Plus className="h-4 w-4" />
          Add Item
        </button>
        <button className="btn-primary" disabled={!canSubmit || isSaving} type="submit">{isSaving ? 'Creating' : 'Create Order'}</button>
      </div>
    </form>
  );
}
