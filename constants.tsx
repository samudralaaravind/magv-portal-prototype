
import React from 'react';
import { Medicine, Order } from './types';
import { 
  Pill, 
  Activity, 
  Heart, 
  Wind, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

export const GLOBAL_CATALOG: Medicine[] = [
  {
    id: 'm1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    manufacturer: 'Pfizer Inc.',
    dosage: '500mg Capsule',
    sku: 'AMX-500-CP',
    price: 12.50,
    stock: 0,
    threshold: 10,
    available: false,
    image: 'https://picsum.photos/seed/amox/200/200'
  },
  {
    id: 'm2',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Diabetes',
    manufacturer: 'Bristol-Myers Squibb',
    dosage: '850mg Tablet',
    sku: 'MET-850-TB',
    price: 8.75,
    stock: 0,
    threshold: 20,
    available: false,
    image: 'https://picsum.photos/seed/met/200/200'
  }
];

export const INITIAL_PHARMACY_INVENTORY: Medicine[] = [
  { ...GLOBAL_CATALOG[0], stock: 45, available: true }
];

const now = new Date();
const today = now.toISOString();

export const INITIAL_ORDERS: Order[] = [
  {
    orderId: '193',
    userId: '393',
    username: 'Rahul Sharma',
    storeId: 'City-Health-1',
    deliveryPartnerId: null,
    price: 1250.00,
    originalPrice: 1400.00,
    discount: 150,
    status: 'ORDER_PLACED',
    platformCharge: 0,
    gst: 18.50,
    deliveryPartnerFee: 40,
    deliveryAddressId: 'Plot 42, Sector 5, Gurgaon',
    rejectionReason: null,
    t0: today,
    t1: null, t2: null, t3: null, t4: null, t5: null,
    items: [
      { orderItemId: 'oi1', orderId: '193', skuId: 'AMX-500', productId: 'p1', quantity: 2, price: 600, originalPrice: 700, discount: 100, name: 'Amoxicillin 500mg' }
    ]
  },
  {
    orderId: '194',
    userId: '394',
    username: 'Anjali Gupta',
    storeId: 'City-Health-1',
    deliveryPartnerId: 'agent_01',
    deliveryPartnerName: 'Vikram Singh',
    deliveryPartnerPhone: '+91 98765 43210',
    price: 850.50,
    originalPrice: 900.00,
    discount: 49.50,
    status: 'ORDER_READY_FOR_PICKUP',
    platformCharge: 0,
    gst: 12.00,
    deliveryPartnerFee: 30,
    deliveryAddressId: 'Flat 102, Sunrise Apts, Dwarka',
    rejectionReason: null,
    t0: new Date(now.getTime() - 7200000).toISOString(),
    t1: new Date(now.getTime() - 5400000).toISOString(),
    t2: new Date(now.getTime() - 3600000).toISOString(),
    t3: new Date(now.getTime() - 1800000).toISOString(),
    t4: null, t5: null,
    items: [
      { orderItemId: 'oi2', orderId: '194', skuId: 'MET-850', productId: 'p2', quantity: 1, price: 850, originalPrice: 900, discount: 50, name: 'Metformin 850mg' }
    ]
  },
  {
    orderId: '196',
    userId: '396',
    username: 'Karan Mehra',
    storeId: 'City-Health-1',
    deliveryPartnerId: 'agent_88',
    deliveryPartnerName: 'Ravi Kumar',
    deliveryPartnerPhone: '+91 88888 77777',
    price: 2200.00,
    originalPrice: 2200.00,
    discount: 0,
    status: 'ORDER_DELIVERED',
    platformCharge: 0,
    gst: 45.00,
    deliveryPartnerFee: 50,
    deliveryAddressId: 'House 71, Phase 3, Noida',
    rejectionReason: null,
    t0: new Date(now.getTime() - 86400000).toISOString(),
    t1: new Date(now.getTime() - 82800000).toISOString(),
    t2: new Date(now.getTime() - 79200000).toISOString(),
    t3: new Date(now.getTime() - 75600000).toISOString(),
    t4: new Date(now.getTime() - 72000000).toISOString(),
    t5: new Date(now.getTime() - 68400000).toISOString(),
    items: [
      { orderItemId: 'oi4', orderId: '196', skuId: 'LIP-20', productId: 'p4', quantity: 1, price: 2200, originalPrice: 2200, discount: 0, name: 'Lipitor 20mg' }
    ]
  },
  {
    orderId: '197',
    userId: '397',
    username: 'Priya Verma',
    storeId: 'City-Health-1',
    deliveryPartnerId: null,
    price: 300.00,
    originalPrice: 350.00,
    discount: 50,
    status: 'ORDER_REJECTED',
    platformCharge: 0,
    gst: 5.00,
    deliveryPartnerFee: 0,
    deliveryAddressId: 'Street 4, Karol Bagh, Delhi',
    rejectionReason: 'Stock unavailable for this specific dosage.',
    t0: new Date(now.getTime() - 1800000).toISOString(),
    t1: new Date(now.getTime() - 900000).toISOString(),
    t2: null, t3: null, t4: null, t5: null,
    items: [
      { orderItemId: 'oi5', orderId: '197', skuId: 'VIT-C', productId: 'p5', quantity: 2, price: 150, originalPrice: 175, discount: 25, name: 'Vitamin C 1000mg' }
    ]
  }
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Antibiotics: <Zap className="w-5 h-5 text-on-secondary-container" />,
  Diabetes: <Activity className="w-5 h-5 text-on-secondary-container" />,
  Cardiac: <Heart className="w-5 h-5 text-on-secondary-container" />,
  Respiratory: <Wind className="w-5 h-5 text-on-secondary-container" />,
  'Pain Relief': <Pill className="w-5 h-5 text-on-secondary-container" />,
  Vitamins: <ShieldAlert className="w-5 h-5 text-on-secondary-container" />,
};
