
export type OrderStatus = 
  | 'ORDER_PLACED' 
  | 'ORDER_ACCEPTED' 
  | 'ORDER_REJECTED' 
  | 'ORDER_READY_FOR_PICKUP' 
  | 'ORDER_PICKED_UP' 
  | 'ORDER_DELIVERED';

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  skuId: string;
  productId: string;
  quantity: number;
  price: number; // Final price
  originalPrice?: number; // Added for UI strikethrough
  discount: number; // Item level discount %
  name?: string; // Helper for UI display
}

export interface Order {
  orderId: string;
  userId: string;
  username?: string; // Added for UI
  storeId: string;
  deliveryPartnerId: string | null;
  deliveryPartnerName?: string; // Added for UI
  deliveryPartnerPhone?: string; // Added for UI
  price: number; // Final total price
  originalPrice?: number; // Total before discount
  discount: number; // Overall order discount %
  status: OrderStatus;
  platformCharge: number;
  gst: number;
  deliveryPartnerFee: number;
  deliveryAddressId: string;
  rejectionReason: string | null;
  
  // Timestamps
  t0: string; // Placed
  t1: string | null; // Accepted / Rejected
  t2: string | null; // Ready for pickup
  t3: string | null; // Agent assigned
  t4: string | null; // Picked up
  t5: string | null; // Delivered
  
  items: OrderItem[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotics' | 'Pain Relief' | 'Diabetes' | 'Cardiac' | 'Vitamins' | 'Respiratory';
  manufacturer: string;
  dosage: string;
  sku: string;
  price: number;
  stock: number;
  threshold: number;
  available: boolean;
  image: string;
}

export interface DashboardStats {
  totalMedicines: number;
  lowStockItems: number;
  pendingOrders: number;
  revenueToday: number;
}
