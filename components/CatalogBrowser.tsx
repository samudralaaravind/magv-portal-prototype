
import React, { useState } from 'react';
import { Medicine } from '../types.ts';
import { Search, Globe, Plus, Info, CheckCircle2 } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants.tsx';

interface Props {
  catalog: Medicine[];
  onAdd: (m: Medicine) => void;
}

const CatalogBrowser: React.FC<Props> = ({ catalog, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (m: Medicine) => {
    onAdd(m);
    setAddedIds(prev => new Set(prev).add(m.id));
  };

  const filteredCatalog = catalog.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary-container text-on-secondary-container rounded-xl">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Global Medicine Catalog</h2>
            <p className="text-on-surface-variant">Import approved medicines directly into your store's inventory.</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Search manufacturers, drugs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-2xl text-sm w-full md:w-80 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalog.map((item) => (
          <div key={item.id} className="bg-surface rounded-3xl border border-outline-variant overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 relative overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm flex items-center space-x-1">
                  {CATEGORY_ICONS[item.category]}
                  <span>{item.category}</span>
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{item.name}</h3>
                  <p className="text-xs text-on-surface-variant">{item.manufacturer}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">${item.price.toFixed(2)}</p>
                  <p className="text-[10px] text-on-surface-variant">MSRP</p>
                </div>
              </div>

              <div className="bg-surface-container rounded-2xl p-4 my-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Generic Name:</span>
                  <span className="font-semibold text-on-surface text-right">{item.genericName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Dosage:</span>
                  <span className="font-semibold text-on-surface">{item.dosage}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-surface-container-high text-on-surface py-2.5 rounded-xl font-bold text-xs hover:bg-outline-variant hover:text-white transition-all">
                  <Info size={16} />
                  <span>Full Details</span>
                </button>
                {addedIds.has(item.id) ? (
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-tertiary-container text-on-tertiary-container py-2.5 rounded-xl font-bold text-xs cursor-default">
                    <CheckCircle2 size={16} />
                    <span>In Pharmacy</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAdd(item)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-primary text-on-primary py-2.5 rounded-xl font-bold text-xs hover:bg-secondary shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus size={16} />
                    <span>Import Medicine</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogBrowser;
