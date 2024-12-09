import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Property } from '../types';
import { propertyCache } from '../utils/cache';

export function useRealtime() {
  const [properties, setProperties] = useState<Property[]>(() => {
    const cached = propertyCache.get();
    return cached || [];
  });
  const [loading, setLoading] = useState(!propertyCache.get());

  useEffect(() => {
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, where('isActive', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedProperties = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        expiresAt: new Date(doc.data().expiresAt.seconds * 1000)
      })) as Property[];

      setProperties(updatedProperties);
      propertyCache.set(updatedProperties);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to properties:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { properties, loading };
}