import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Property } from '../types';
import { isExpired } from './dates';

export async function cleanupExpiredListings() {
  const propertiesRef = collection(db, 'properties');
  const q = query(propertiesRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);

  const batch = [];
  snapshot.forEach((doc) => {
    const property = doc.data() as Property;
    if (isExpired(property.expiresAt)) {
      batch.push(updateDoc(doc.ref, { isActive: false }));
    }
  });

  await Promise.all(batch);
}

export async function sendExpirationNotifications() {
  const propertiesRef = collection(db, 'properties');
  const q = query(propertiesRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);

  const notifications = [];
  snapshot.forEach((doc) => {
    const property = doc.data() as Property;
    const daysUntilExpiry = Math.ceil(
      (property.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry <= 7) {
      notifications.push({
        userId: property.contact.email,
        propertyId: doc.id,
        daysUntilExpiry,
        title: property.title
      });
    }
  });

  return notifications;
}

export async function optimizeDatabase() {
  // Implement database optimization logic
  // This could include:
  // - Removing old inactive listings
  // - Compressing images
  // - Cleaning up unused data
}