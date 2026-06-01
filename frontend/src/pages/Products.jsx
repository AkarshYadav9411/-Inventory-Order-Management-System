import { Edit, Search, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { productApi } from '../api/productApi';
import ProductForm from '../components/products/ProductForm';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import PageHeader from '../components/ui/PageHeader';
import { formatCurrency } from '../utils/format';

export default function Products() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['products', search], queryFn: () => productApi.list(search) });
  const products = data?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values) => editing ? productApi.update(editing.id, values) : productApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditing(null);
      setFormOpen(false);
      setErrorMessage('');
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });
  const deleteMutation = useMutation({
    mutationFn: productApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage SKU catalog and stock levels."
        actions={<button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>Add Product</button>}
      />
      <ErrorMessage message={errorMessage || error?.message} />
      {formOpen || editing ? (
        <ProductForm
          defaultValues={editing}
          isSaving={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutate(values)}
          onCancel={() => { setEditing(null); setFormOpen(false); }}
        />
      ) : null}
      <div className="panel mb-4 p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search by name or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>
      <div className="panel overflow-hidden">
        {products.length === 0 && !isLoading ? <EmptyState title="No products found." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-surface text-left text-xs uppercase text-slate-600">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3">{product.quantity_in_stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn-secondary mr-2 h-9 w-9 px-0" title="Edit product" onClick={() => { setEditing(product); setFormOpen(false); }}><Edit className="h-4 w-4" /></button>
                      <button className="btn-danger h-9 w-9 px-0" title="Delete product" onClick={() => deleteMutation.mutate(product.id)}><Trash2 className="h-4 w-4" /></button>
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
