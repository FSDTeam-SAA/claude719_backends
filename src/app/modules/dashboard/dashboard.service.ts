import Contact from "../contact/contact.model";
import Gkstats from "../gkstats/gkstats.model";
import Payment from "../payment/payment.model";
import { userRole } from "../user/user.constant";
import User from "../user/user.model"

const dashboardOverview = async(userId: string) => {

    const totalPlayers = await User.countDocuments( {role:userRole.player} );
    const totalContact = await Contact.countDocuments();
    const totalGk = await Gkstats.countDocuments();
    const totalRevenew = await Payment.countDocuments( {status:'completed'});

    return { totalRevenew, totalPlayers, totalContact, totalGk };


}


const getMonthlyReveneueChart = async (year: number) => {
  const data = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        revenue: { $sum: '$amount' },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  const result = months.map((month, index) => {
    const found = data.find(d => d._id.month === index + 1);
    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  return result;
};

export const dashboardService = {
    dashboardOverview,
    getMonthlyReveneueChart
} 