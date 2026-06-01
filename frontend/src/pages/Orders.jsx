import { Eye, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { customerApi } from '../api/customerApi';
import { orderApi } from '../api/orderApi';
import { productApi } from '../api/productApi';
import OrderForm from '../components/orders/OrderForm';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import PageHeader from '../components/ui/PageHeader';
import { formatCurrency, formatDate } from '../utils/format';

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: orderApi.list });
  const customersQuery = useQuery({ queryKey: ['customers'], queryFn: customerApi.list });
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: () => productApi.list() });
  const orders = ordersQuery.data?.data || [];
  const customers = customersQuery.data?.data || [];
  const products = productsQuery.data?.data || [];

  const createMutation = useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setErrorMessage('');
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });
  const deleteMutation = useMutation({
    mutationFn: orderApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSelectedOrder(null);
    },
    onError: (mutationError) => setErrorMessage(mutationError.message),
  });

  return (
    <>
      <PageHeader title="Orders" description="Create orders and review line item totals." />
      <ErrorMessage message={errorMessage || ordersQuery.error?.message || customersQuery.error?.message || productsQuery.error?.message} />
      <OrderForm customers={customers} products={products} onSubmit={(values) => createMutation.mutate(values)} isSaving={createMutation.isPending} />
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="panel overflow-hidden">
          {orders.length === 0 ? <EmptyState title="No orders found." /> : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-surface text-left text-xs uppercase text-slate-600">
                  <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Created</th><th className="px-4 py-3"></th></tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3">{order.customer.full_name}</td>
                      <td className="px-4 py-3">{formatCurrency(order.total_amount)}</td>
                      <td className="px-4 py-3">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="btn-secondary mr-2 h-9 w-9 px-0" title="View order" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></button>
                        <button className="btn-danger h-9 w-9 px-0" title="Delete order" onClick={() => deleteMutation.mutate(order.id)}><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <aside className="panel p-4">
          {selectedOrder ? (
            <>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-slate-600">{selectedOrder.customer.full_name}</p>
                </div>
                <strong>{formatCurrency(selectedOrder.total_amount)}</strong>
              </div>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="rounded-md border border-line p-3 text-sm">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="mt-1 text-slate-600">{item.quantity} x {formatCurrency(item.unit_price)}</div>
                    <div className="mt-2 font-semibold">{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600">Select an order to view details.</p>
          )}
        </aside>
      </div>
    </>
  );
}
