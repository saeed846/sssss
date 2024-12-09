import React, { createContext, useContext, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Property } from '../types';
import { useAuth } from './AuthContext';
import { addMonths } from '../utils/dates';
import { useRealtime } from '../hooks/useRealtime';
import { propertyCache } from '../utils/cache';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'expiresAt' | 'isActive'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  renewProperty: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PropertyContext = createContext<PropertyContextType | null>(null);

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const { properties, loading } = useRealtime();
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  async function addProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'expiresAt' | 'isActive'>) {
    try {
      const newProperty = {
        ...propertyData,
        createdAt: new Date(),
        expiresAt: addMonths(new Date(), 1),
        isActive: true
      };
      await addDoc(collection(db, 'properties'), newProperty);
    } catch (err) {
      setError('Failed to add property');
      console.error('Error adding property:', err);
      throw err;
    }
  }

  async function deleteProperty(id: string) {
    try {
      await deleteDoc(doc(db, 'properties', id));
      propertyCache.clear();
    } catch (err) {
      setError('Failed to delete property');
      console.error('Error deleting property:', err);
      throw err;
    }
  }

  async function renewProperty(id: string) {
    try {
      const propertyRef = doc(db, 'properties', id);
      const newExpiryDate = addMonths(new Date(), 1);
      await updateDoc(propertyRef, { expiresAt: newExpiryDate });
    } catch (err) {
      setError('Failed to renew property');
      console.error('Error renewing property:', err);
      throw err;
    }
  }

  const value = {
    properties,
    addProperty,
    deleteProperty,
    renewProperty,
    loading,
    error
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}