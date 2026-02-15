
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Globe, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  LucideIcon
} from 'lucide-react';
import { Medicine, Order, OrderStatus } from './types.ts';
import { GLOBAL_CATALOG, INITIAL_PHARMACY_INVENTORY, INITIAL_ORDERS } from './constants.tsx';
import Dashboard from './components/Dashboard.tsx';
import InventoryManager from './components/InventoryManager.tsx';
import OrderManager from './components/OrderManager.tsx';
import CatalogBrowser from './components/CatalogBrowser.tsx';

type Tab = 'dashboard' | 'inventory' | 'orders' | 'catalog';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [inventory, setInventory] = useState<Medicine[]>(INITIAL_PHARMACY_INVENTORY);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = useMemo(() => ({
    totalMedicines: inventory.length,
    lowStockItems: inventory.filter(m => m.stock < m.threshold).length,
    pendingOrders: orders.filter(o => o.status === 'ORDER_PLACED').length,
    revenueToday: orders
      .filter(o => o.t5 && o.t5.split('T')[0] === new Date().toISOString().split('T')[0])
      .reduce((acc, curr) => acc + curr.price, 0)
  }), [inventory, orders]);

  const handleAddToInventory = (medicine: Medicine) => {
    if (!inventory.find(m => m.id === medicine.id)) {
      setInventory(prev => [...prev, { ...medicine, stock: 10, available: true }]);
    }
    setActiveTab('inventory');
  };

  const updateStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(m => 
      m.id === id ? { ...m, stock: newStock, available: newStock > 0 } : m
    ));
  };

  const updateOrderStatus = (id: string, status: OrderStatus, reason?: string) => {
    const timestamp = new Date().toISOString();
    setOrders(prev => prev.map(o => {
      if (o.orderId === id) {
        const update: Partial<Order> = { status, rejectionReason: reason || null };
        // Map timestamps to technical stages
        if (status === 'ORDER_ACCEPTED') update.t1 = timestamp;
        if (status === 'ORDER_REJECTED') update.t1 = timestamp;
        if (status === 'ORDER_READY_FOR_PICKUP') update.t2 = timestamp;
        // t3 is typically automated by agent assignment, simulating here
        if (status === 'ORDER_READY_FOR_PICKUP') update.t3 = new Date(Date.now() + 600000).toISOString(); 
        if (status === 'ORDER_PICKED_UP') update.t4 = timestamp;
        if (status === 'ORDER_DELIVERED') update.t5 = timestamp;
        
        return { ...o, ...update };
      }
      return o;
    }));
  };

  const NavigationItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: LucideIcon, label: string }) => (
    <button
      onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-primary text-on-primary shadow-lg shadow-primary/25 font-semibold translate-x-1' 
          : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
      }`}
    >
      <Icon size={20} className={activeTab === tab ? 'animate-pulse' : ''} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-surface-container-low font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-surface-container border-r border-outline-variant/50 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center space-x-3 mb-12 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/20">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-on-surface">Pharmanex</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <NavigationItem tab="dashboard" icon={LayoutDashboard} label="Overview" />
            <NavigationItem tab="inventory" icon={Package} label="My Inventory" />
            <NavigationItem tab="orders" icon={ShoppingCart} label="Order Hub" />
            <NavigationItem tab="catalog" icon={Globe} label="Global Catalog" />
          </nav>

          <div className="mt-auto pt-6 border-t border-outline-variant/30 space-y-3">
            <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-highest transition-all">
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <div className="bg-surface-container-highest/50 rounded-3xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary-container" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">City Health Admin</p>
                <p className="text-[10px] text-on-surface-variant font-medium">Pharmacy Owner</p>
              </div>
              <button className="p-2 text-error hover:bg-error-container rounded-xl transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 h-18 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden p-3 -ml-2 mr-4 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="max-w-md w-full relative hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Global search..."
                className="w-full bg-surface-container border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 text-on-surface-variant hover:bg-surface-container rounded-2xl relative transition-all group">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              {stats.lowStockItems > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error border-2 border-surface rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard stats={stats} orders={orders} inventory={inventory} onTabChange={setActiveTab} />}
            {activeTab === 'inventory' && <InventoryManager inventory={inventory} onUpdateStock={updateStock} />}
            {activeTab === 'orders' && <OrderManager orders={orders} onUpdateStatus={updateOrderStatus} />}
            {activeTab === 'catalog' && <CatalogBrowser catalog={GLOBAL_CATALOG} onAdd={handleAddToInventory} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
