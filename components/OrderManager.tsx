
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types.ts';
import { 
  ShoppingBag, 
  ChevronRight, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  X,
  ClipboardList,
  Search,
  Filter,
  ArrowUpDown,
  Phone,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus, reason?: string) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  ORDER_PLACED: { label: 'Active', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  ORDER_ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
  ORDER_READY_FOR_PICKUP: { label: 'Ready', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle },
  ORDER_PICKED_UP: { label: 'Picked Up', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  ORDER_DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  ORDER_REJECTED: { label: 'Rejected', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
};

const OrderManager: React.FC<Props> = ({ orders, onUpdateStatus }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = searchId === '' || o.orderId.includes(searchId);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(o.status);
      
      const orderDate = new Date(o.t0);
      const matchesStart = !dateRange.start || orderDate >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || orderDate <= new Date(dateRange.end);
      
      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    }).sort((a, b) => new Date(b.t0).getTime() - new Date(a.t0).getTime());
  }, [orders, searchId, selectedStatuses, dateRange]);

  const toggleStatus = (status: OrderStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return null;
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = STATUS_CONFIG[order.status].icon;
    const timelineSteps = [
      { label: 'Placed', time: order.t0, color: 'bg-amber-500' },
      { label: 'Confirmed', time: order.t1, color: 'bg-blue-500' },
      { label: 'Ready', time: order.t2, color: 'bg-indigo-500' },
      { label: 'Picked', time: order.t4, color: 'bg-purple-500' },
      { label: 'Delivered', time: order.t5, color: 'bg-emerald-500' }
    ];

    return (
      <div className="bg-white rounded-[24px] border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        {/* Card Header: IDs and Global Status */}
        <div className="px-5 py-3 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-black text-primary uppercase">ORD-{order.orderId}</span>
            <div className="h-4 w-px bg-outline-variant/30" />
            <div className="flex items-center space-x-1.5 text-on-surface-variant">
              <User size={14} />
              <span className="text-xs font-bold">{order.username || order.userId}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 text-on-surface-variant">
              <Calendar size={14} />
              <span className="text-xs font-medium">{new Date(order.t0).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center space-x-1.5 border shadow-sm ${STATUS_CONFIG[order.status].color}`}>
            <StatusIcon size={12} />
            <span>{STATUS_CONFIG[order.status].label}</span>
          </div>
        </div>

        {/* Card Body: Items (Left), Timeline (Middle), Price (Right) */}
        <div className="p-5 flex flex-col lg:flex-row lg:items-stretch gap-6">
          
          {/* Section 1: Items (Left) */}
          <div className="flex-1 lg:max-w-[30%] border-r border-outline-variant/20 pr-4">
            <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">Order Items</p>
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map(item => (
                <div key={item.orderItemId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="bg-surface-container-high text-primary font-black px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                    <p className="font-bold text-on-surface truncate">{item.name}</p>
                  </div>
                  <span className="font-black text-on-surface-variant shrink-0">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Timeline (Middle) - Compact Horizontal */}
          <div className="flex-1 px-4 flex flex-col justify-center">
             <div className="relative flex justify-between items-center w-full px-2">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-10 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (timelineSteps.filter(s => s.time).length - 1) * 25)}%` }}
                />

                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative z-20 flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center transition-all duration-500 
                      ${step.time ? step.color : 'bg-surface-container-highest'}`}>
                      {step.time ? <CheckCircle size={14} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30" />}
                    </div>
                    <div className="absolute -bottom-8 whitespace-nowrap text-center">
                      <p className={`text-[9px] font-black uppercase tracking-tight ${step.time ? 'text-on-surface' : 'text-outline/40'}`}>{step.label}</p>
                      {step.time && <p className="text-[8px] font-bold text-on-surface-variant leading-none">{formatTime(step.time)}</p>}
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Secondary Info: Agent or Rejection */}
             <div className="mt-12">
                {order.status === 'ORDER_REJECTED' ? (
                  <div className="flex items-center space-x-2 bg-rose-50 p-2 rounded-xl border border-rose-100">
                    <AlertCircle size={14} className="text-rose-500" />
                    <p className="text-[10px] font-medium text-rose-700 truncate">Reason: {order.rejectionReason}</p>
                  </div>
                ) : order.deliveryPartnerId ? (
                  <div className="flex items-center justify-between bg-primary/5 p-2 rounded-xl border border-primary/10">
                    <div className="flex items-center space-x-2">
                      <Truck size={14} className="text-primary" />
                      <p className="text-[10px] font-bold text-on-surface truncate">{order.deliveryPartnerName} • {order.deliveryPartnerId}</p>
                    </div>
                    <button className="text-[10px] font-black text-primary flex items-center"><Phone size={10} className="mr-1"/> Call</button>
                  </div>
                ) : (
                  <div className="h-6" /> // Placeholder to maintain height
                )}
             </div>
          </div>

          {/* Section 3: Price & Actions (Right) */}
          <div className="flex-1 lg:max-w-[25%] border-l border-outline-variant/20 pl-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-on-surface-variant font-medium">Subtotal</span>
                <span className="line-through text-outline">₹{order.originalPrice?.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-rose-600 font-bold">Discount</span>
                <span className="text-rose-600 font-bold">-₹{order.discount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-on-surface">Payable</span>
                <span className="text-lg font-black text-primary">₹{order.price.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {order.status === 'ORDER_PLACED' ? (
                <>
                  <button 
                    onClick={() => onUpdateStatus(order.orderId, 'ORDER_ACCEPTED')}
                    className="flex-1 bg-primary text-on-primary py-2 rounded-xl text-[10px] font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => setRejectingOrderId(order.orderId)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 border border-rose-200"
                  >
                    <XCircle size={16} />
                  </button>
                </>
              ) : order.status === 'ORDER_ACCEPTED' ? (
                <button 
                  onClick={() => onUpdateStatus(order.orderId, 'ORDER_READY_FOR_PICKUP')}
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black shadow-md"
                >
                  Mark Ready
                </button>
              ) : (
                <button className="w-full bg-surface-container-highest text-on-surface-variant py-2 rounded-xl text-[10px] font-black flex items-center justify-center space-x-1 cursor-default">
                  <CheckCircle2 size={12} />
                  <span>Verified</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-on-surface">Logistics Hub</h1>
            <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">LIVE FEED</div>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Compact overview of all store activities.</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-outline-variant/30 flex space-x-6">
          <div>
            <p className="text-[10px] font-black text-outline uppercase mb-0.5 tracking-widest">Orders</p>
            <p className="text-xl font-black text-on-surface">{filteredOrders.length}</p>
          </div>
          <div className="w-px bg-outline-variant/20" />
          <div>
            <p className="text-[10px] font-black text-outline uppercase mb-0.5 tracking-widest">Revenue</p>
            <p className="text-xl font-black text-primary">₹{filteredOrders.reduce((acc, o) => acc + o.price, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Command Bar - Slimmed */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border border-outline-variant/40 rounded-[24px] p-4 shadow-lg shadow-surface-dim/10 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Order ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-on-surface placeholder:text-outline/60 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2 text-[11px] font-bold text-on-surface outline-none"
            />
            <span className="text-[10px] font-black text-outline">TO</span>
            <input 
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-3 py-2 text-[11px] font-bold text-on-surface outline-none"
            />
          </div>
          <button 
            onClick={() => { setSearchId(''); setSelectedStatuses([]); setDateRange({ start: '', end: '' }); }}
            className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-xl text-[10px] font-black hover:bg-outline-variant hover:text-white transition-all"
          >
            RESET
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/10">
          {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(status => {
            const isSelected = selectedStatuses.includes(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                  isSelected 
                    ? 'bg-primary border-primary text-on-primary shadow-sm' 
                    : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/40'
                }`}
              >
                {STATUS_CONFIG[status].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.orderId} order={order} />
          ))
        ) : (
          <div className="py-20 text-center bg-surface-container-low/30 rounded-[32px] border-2 border-dashed border-outline-variant/20">
            <ShoppingBag size={40} className="text-outline/20 mx-auto mb-4" />
            <p className="text-on-surface font-black">No matches found</p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-outline-variant/30">
            <h3 className="text-xl font-black text-on-surface mb-2">Decline Order</h3>
            <p className="text-xs text-on-surface-variant mb-6 font-medium">Please provide a reason for the customer.</p>
            <textarea 
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full h-32 bg-surface-container-low rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20 border-none mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectingOrderId(null)} className="flex-1 py-3 text-xs font-black text-on-surface-variant hover:bg-surface-container rounded-xl">Cancel</button>
              <button 
                onClick={() => { if(rejectionReasonInput.trim()){ onUpdateStatus(rejectingOrderId, 'ORDER_REJECTED', rejectionReasonInput); setRejectingOrderId(null); } }}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
  <CheckCircle size={size} className={className} />
);

export default OrderManager;
