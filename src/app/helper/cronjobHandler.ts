import cron from 'node-cron';
import User from '../modules/user/user.model';
import Subscription from '../modules/subscription/subscription.model';

cron.schedule('0 0 */1 * * *', async () => {
  console.log('⏰ Running subscription expiry cron job');

  try {
    const now = new Date();

    const expiredUsers = await User.find({
      isSubscription: true,
      subscriptionExpiry: { $ne: null, $lte: now },
    }).select('_id');

    if (!expiredUsers.length) {
      console.log('✅ No expired subscriptions found');
      return;
    }

    const userIds = expiredUsers.map(user => user._id);

    // Remove users from all subscriptions
    await Subscription.updateMany(
      { totalSubscripeUser: { $in: userIds } },
      { $pull: { totalSubscripeUser: { $in: userIds } } }
    );

    // Update users in bulk
    await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isSubscription: false,
          subscriptionExpiry: null,
        },
      }
    );

    console.log(`✔ Expired subscriptions updated: ${userIds.length}`);
  } catch (error) {
    console.error('❌ Subscription expiry cron failed:', error);
  }
});
