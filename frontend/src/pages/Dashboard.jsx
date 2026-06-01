import { AlertTriangle, Package, ShoppingCart, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.get });
  const dashboard = data?.data;

  return (
    <>
      <PageHeader title="Dashboard" description="Current inventory, customer, and order activity." />
      <ErrorMessage message={error?.message} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={isLoading ? '...' : dashboard?.total_products} icon={Package} />
        <StatCard label="Total Customers" value={isLoading ? '...' : dashboard?.total_customers} icon={Users} />
        <StatCard label="Total Orders" value={isLoading ? '...' : dashboard?.total_orders} icon={ShoppingCart} />
        <StatCard label="Low Stock Products" value={isLoading ? '...' : dashboard?.low_stock_products} icon={AlertTriangle} />
      </div>
    </>
  );
}
