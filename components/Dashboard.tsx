
import React from 'react';
import { 
  Medicine, 
  Order, 
  DashboardStats 
} from '../types.ts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Package,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface Props {
  stats: DashboardStats;
  orders: Order[];
  inventory: Medicine[];
  onTabChange: (tab: any) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  trend: number;
  label: string;
}

const Dashboard: React.FC<Props> = ({ stats, orders, inventory, onTabChange }) => {
  const chartData = [
    { name: 'Mon', revenue: 1500 },
    { name: 'Tue', revenue: 2300 },
    { name: 'Wed', revenue: 1800 },
    { name: 'Thu', revenue: 2800 },
    { name: 'Fri', revenue: 4100 },
    { name: 'Sat', revenue: 3200 },
    { name: 'Sun', revenue: 1600 },
  ];

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass, trend, label }) => (
    <div className="bg-surface rounded-[32px] p-8 shadow-sm border border-outline-variant/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10 ${colorClass.split(' ')[0]}`} />
      
      <div className="flex justify-between items-start mb-6 relative">
        <div className={`p-4 rounded-2xl ${colorClass} shadow-lg shadow-current/10`}>
          <Icon size={28} />
        </div>
        <div className={`flex items-center text-xs font-black px-3 py-1.5 rounded-full ${trend > 0 ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      <div className="relative">
        <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline space-x-2 mt-2">
          <h3 className="text-3xl font-black text-on-surface tracking-tight">{value}</h3>
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Performance Deck</h2>
          <p className="text-on-surface-variant font-medium text-lg mt-1">Overview of your pharmacy's network health.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-2xl text-sm font-black hover:bg-outline-variant hover:text-white transition-all">
            Export Analytics
          </button>
          <button 
            onClick={() => onTabChange('catalog')}
            className="bg-primary text-on-primary px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Import Inventory
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Stock Inventory" 
          value={stats.totalMedicines} 
          icon={Package} 
          colorClass="bg-primary-container text-on-primary-container"
          trend={12}
          label="SKUs"
        />
        <StatCard 
          title="Stock Critical" 
          value={stats.lowStockItems} 
          icon={AlertTriangle} 
          colorClass="bg-error-container text-on-error-container"
          trend={-5}
          label="ALERTS"
        />
        <StatCard 
          title="Live Orders" 
          value={stats.pendingOrders} 
          icon={Clock} 
          colorClass="bg-secondary-container text-on-secondary-container"
          trend={8}
          label="QUEUE"
        />
        <StatCard 
          title="Net Revenue" 
          value={`₹${stats.revenueToday.toFixed(0)}`} 
          icon={TrendingUp} 
          colorClass="bg-tertiary-container text-on-tertiary-container"
          trend={24}
          label="TDY"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-surface rounded-[40px] p-10 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-on-surface">Revenue Pipeline</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Transaction volume across pharmacy hours.</p>
            </div>
            <select className="bg-surface-container-highest/50 border-none text-xs font-black rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none appearance-none pr-8">
              <option>Current Week</option>
              <option>Previous Week</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b57d0" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0b57d0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde3ea" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#747775', fontSize: 11, fontWeight: 700}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#747775', fontSize: 11, fontWeight: 700}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0b57d0" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Side List */}
        <div className="bg-surface rounded-[40px] p-10 shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-on-surface">Recent Activity</h3>
            <button 
              onClick={() => onTabChange('orders')}
              className="text-primary text-xs font-black hover:underline flex items-center"
            >
              HUB <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
          <div className="space-y-6 flex-1">
            {orders.slice(0, 5).map(order => (
              <div key={order.orderId} className="flex items-center justify-between p-1 group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface font-black text-xs transition-transform group-hover:scale-105">
                    {order.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">User {order.userId}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{new Date(order.t0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-on-surface">₹{order.price.toFixed(0)}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${
                    order.status === 'ORDER_PLACED' ? 'bg-primary/10 text-primary' :
                    order.status === 'ORDER_DELIVERED' ? 'bg-tertiary-container text-on-tertiary-container' :
                    'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {order.status.split('_').pop()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onTabChange('orders')}
            className="w-full mt-10 py-4 border-2 border-outline-variant/30 rounded-2xl text-xs font-black text-on-surface hover:bg-surface-container-highest hover:border-transparent transition-all"
          >
            Fulfillment Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
