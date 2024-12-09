import cron from 'node-cron';
import { cleanupExpiredListings, sendExpirationNotifications, optimizeDatabase } from '../utils/automation';

// Run cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await cleanupExpiredListings();
    console.log('Expired listings cleanup completed');
  } catch (error) {
    console.error('Error during listings cleanup:', error);
  }
});

// Check for expiring listings and send notifications every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const notifications = await sendExpirationNotifications();
    console.log(`Sent ${notifications.length} expiration notifications`);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
});

// Run database optimization weekly on Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    await optimizeDatabase();
    console.log('Database optimization completed');
  } catch (error) {
    console.error('Error during database optimization:', error);
  }
});