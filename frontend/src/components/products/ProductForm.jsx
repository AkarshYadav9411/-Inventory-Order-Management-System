import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity_in_stock: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
});

export default function ProductForm({ defaultValues, onSubmit, isSaving, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { name: '', sku: '', price: '', quantity_in_stock: 0 },
  });

  return (
    <form className="panel mb-6 grid gap-4 p-4 md:grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      {[
        ['name', 'Name'],
        ['sku', 'SKU'],
        ['price', 'Price'],
        ['quantity_in_stock', 'Quantity'],
      ].map(([field, label]) => (
        <label key={field} className="text-sm font-medium text-ink">
          {label}
          <input className="input mt-1" type={field === 'price' || field === 'quantity_in_stock' ? 'number' : 'text'} step="0.01" {...register(field)} />
          {errors[field] ? <span className="mt-1 block text-xs text-red-600">{errors[field].message}</span> : null}
        </label>
      ))}
      <div className="flex items-end gap-2 md:col-span-4">
        <button className="btn-primary" disabled={isSaving} type="submit">{isSaving ? 'Saving' : 'Save'}</button>
        {onCancel ? <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button> : null}
      </div>
    </form>
  );
}
