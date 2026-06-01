import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { customerApi } from '../api/customerApi';
import CustomerForm from '../components/customers/CustomerForm';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import PageHeader from '../components/ui/PageHeader';

export default function Customers() {
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const { data, error } = useQuery({ queryKey: ['customers'], queryFn: customerApi.list });
  const customers = data?.data || [];

  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setErrorMessage('');
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });
  const deleteMutation = useMutation({
    mutationFn: customerApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });

  return (
    <>
      <PageHeader title="Customers" description="Maintain customer contact records." />
      <ErrorMessage message={errorMessage || error?.message} />
      <CustomerForm
        onSubmit={(values, context) => createMutation.mutate(values, { onSuccess: context.onSuccess })}
        isSaving={createMutation.isPending}
      />
      <div className="panel overflow-hidden">
        {customers.length === 0 ? <EmptyState title="No customers found." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-surface text-left text-xs uppercase text-slate-600">
                <tr><th className="px-4 py-3">Full Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3 font-medium">{customer.full_name}</td>
                    <td className="px-4 py-3">{customer.email}</td>
                    <td className="px-4 py-3">{customer.phone}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn-danger h-9 w-9 px-0" title="Delete customer" onClick={() => deleteMutation.mutate(customer.id)}><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
