import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^\+?[0-9\s().-]{7,30}$/, 'Valid phone is required'),
});

export default function CustomerForm({ onSubmit, isSaving }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '', phone: '' },
  });

  const submit = (values) => onSubmit(values, { onSuccess: () => reset() });

  return (
    <form className="panel mb-6 grid gap-4 p-4 md:grid-cols-3" onSubmit={handleSubmit(submit)}>
      {[
        ['full_name', 'Full Name'],
        ['email', 'Email'],
        ['phone', 'Phone'],
      ].map(([field, label]) => (
        <label key={field} className="text-sm font-medium text-ink">
          {label}
          <input className="input mt-1" {...register(field)} />
          {errors[field] ? <span className="mt-1 block text-xs text-red-600">{errors[field].message}</span> : null}
        </label>
      ))}
      <div className="flex items-end md:col-span-3">
        <button className="btn-primary" disabled={isSaving} type="submit">{isSaving ? 'Saving' : 'Add Customer'}</button>
      </div>
    </form>
  );
}
