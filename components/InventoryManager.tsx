
import React, { useState } from 'react';
import { Medicine } from '../types.ts';
import { Search, Filter, Plus, Edit2, ChevronRight, AlertCircle } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants.tsx';

interface Props {
  inventory: Medicine[];
  onUpdateStock: (id: string, newStock: number) => void;
}

const InventoryManager: React.FC<Props> = ({ inventory, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const filteredInventory = inventory.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (m: Medicine) => {
    setEditingId(m.id);
    setEditValue(m.stock);
  };

  const saveEdit = (id: string) => {
    onUpdateStock(id, editValue);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Pharmacy Inventory</h2>
          <p className="text-on-surface-variant">Manage your stock levels and availability.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 bg-surface-container-high px-4 py-2 rounded-full text-sm font-semibold hover:bg-outline-variant hover:text-surface transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Medicine</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">SKU / Dosage</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Stock Level</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant italic">{item.genericName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-on-surface">
                      {CATEGORY_ICONS[item.category]}
                      <span>{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="font-mono text-on-surface-variant">{item.sku}</p>
                      <p className="text-on-surface">{item.dosage}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-surface-container border border-primary rounded text-sm outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={() => saveEdit(item.id)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${item.stock < item.threshold ? 'text-error' : 'text-on-surface'}`}>
                          {item.stock}
                        </span>
                        {item.stock < item.threshold && (
                          <AlertCircle size={14} className="text-error" />
                        )}
                        <button 
                          onClick={() => startEdit(item)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-primary transition-opacity"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.available 
                        ? 'bg-tertiary-container text-on-tertiary-container' 
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-outline hover:text-primary p-2 rounded-full hover:bg-surface-container-high transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant italic">
                    No medicines found in your inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
