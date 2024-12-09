import React, { useState } from 'react';
import { SearchFilters } from '../components/SearchFilters';
import { PropertyCard } from '../components/PropertyCard';
import { MapView } from '../components/Map';
import { AddPropertyModal } from '../components/AddPropertyModal';
import { PropertyDetails } from '../components/PropertyDetails';
import { Property, FilterState } from '../types';
import { filterProperties } from '../utils/filters';
import { reviews } from '../data/reviews';
import { addMonths } from '../utils/dates';
import { useAuth } from '../contexts/AuthContext';

export function Listings() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    neighborhood: '',
    type: '',
    priceRange: '',
    roomType: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredProperties = filterProperties(properties, filters);

  const handleAddProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'expiresAt' | 'isActive'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date(),
      expiresAt: addMonths(new Date(), 1),
      isActive: true
    };
    setProperties([newProperty, ...properties]);
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prevProperties => 
      prevProperties.filter(property => property.id !== propertyId)
    );
  };

  const handleRenewProperty = (propertyId: string) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, expiresAt: addMonths(new Date(), 1) }
          : property
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Property Listings</h1>
            <p className="text-gray-600">
              Find your perfect property from our curated selection
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            List Your Property
          </button>
        </div>
      </div>

      <SearchFilters filters={filters} onFilterChange={setFilters} />

      <div className="mb-6 flex justify-end space-x-4">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'map'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Map View
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onViewDetails={() => setSelectedProperty(property)}
              onRenew={currentUser?.email === property.contact.email ? handleRenewProperty : undefined}
            />
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No properties found matching your criteria.
            </div>
          )}
        </div>
      ) : (
        <div className="h-[600px]">
          <MapView
            properties={filteredProperties}
            onPropertySelect={(id) => {
              const property = properties.find(p => p.id === id);
              if (property) setSelectedProperty(property);
            }}
          />
        </div>
      )}

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          reviews={reviews}
          onClose={() => setSelectedProperty(null)}
          onDelete={
            currentUser?.email === selectedProperty.contact.email 
              ? handleDeleteProperty 
              : undefined
          }
        />
      )}

      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProperty}
      />
    </div>
  );
}