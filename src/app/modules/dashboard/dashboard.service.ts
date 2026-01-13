import pagination, { IOption } from '../../helper/pagenation';
import Contact from '../contact/contact.model';
import Gkstats from '../gkstats/gkstats.model';
import Payment from '../payment/payment.model';
import Team from '../team/team.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';

const dashboardOverview = async (userId: string) => {
  const totalPlayers = await User.countDocuments({ role: userRole.player });
  const totalContact = await Contact.countDocuments();
  const totalGk = await User.countDocuments({ role: userRole.gk });
  const totalRevenew = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
  ]);

  return {
    totalRevenew: totalRevenew[0]?.totalRevenue || 0,
    totalPlayers,
    totalContact,
    totalGk,
  };
};

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
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const result = months.map((month, index) => {
    const found = data.find((d) => d._id.month === index + 1);
    return {
      month,
      revenue: found ? found.revenue : 0,
    };
  });

  return result;
};

// const totalRevenue = async (params: any, options: IOption) => {
//     const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//     const { searchTerm, year, paymentType, ...filterData } = params;

//     const paymentMatchConditions: any = {
//         status: 'completed',
//     };

//     if (paymentType) {
//         paymentMatchConditions.paymentType = paymentType;
//     }
//     if (year) {
//         const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
//         const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
//         paymentMatchConditions.createdAt = {
//             $gte: startDate,
//             $lte: endDate,
//         };
//     }

//     const pipeline: any[] = [
//         { $match: paymentMatchConditions },

//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'user',
//                 foreignField: '_id',
//                 as: 'userDetails',
//             },
//         },
//         totalRevenue: 1,
//         totalPayments: 1,
//       },
//     },

//     {
//       $sort:
//         sortBy && sortOrder
//           ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
//           : { totalRevenue: -1 },
//     },

//     {
//       $facet: {
//         metadata: [{ $count: 'total' }],
//         data: [{ $skip: skip }, { $limit: limit }],
//         summary: [
//           {
//             $group: {
//               _id: null,
//               totalRevenue: { $sum: '$totalRevenue' },
//               totalPayments: { $sum: '$totalPayments' },
//             },
//         },
//         { $unwind: { path: '$teamDetails', preserveNullAndEmptyArrays: true } },

//         {
//             $lookup: {
//                 from: 'subscriptions',
//                 localField: 'subscription',
//                 foreignField: '_id',
//                 as: 'subscriptionDetails',
//             },
//         },
//         { $unwind: { path: '$subscriptionDetails', preserveNullAndEmptyArrays: true } },
//     ];

//     const userFilterConditions: any = {};

//     if (searchTerm) {
//         userFilterConditions.$or = [
//             { 'userDetails.firstName': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.lastName': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.email': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.category': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.league': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.currentClub': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.teamName': { $regex: searchTerm, $options: 'i' } },
//             { 'userDetails.teamLocation': { $regex: searchTerm, $options: 'i' } },
//             { 'teamDetails.teamName': { $regex: searchTerm, $options: 'i' } },
//             { 'teamDetails.coachName': { $regex: searchTerm, $options: 'i' } },
//         ];
//     }

//     if (Object.keys(filterData).length) {
//         Object.entries(filterData).forEach(([field, value]) => {
//             if (field === 'position') {
//                 userFilterConditions[`userDetails.${field}`] = { $in: [value] };
//             } else {
//                 userFilterConditions[`userDetails.${field}`] = value;
//             }
//         });
//     }

//     if (Object.keys(userFilterConditions).length) {
//         pipeline.push({ $match: userFilterConditions });
//     }

//     // Project the final structure
//     pipeline.push({
//         $project: {
//             _id: 0,
//             paymentId: '$_id',
//             amount: '$amount',
//             currency: '$currency',
//             status: '$status',
//             paymentType: '$paymentType',
//             stripeSessionId: '$stripeSessionId',
//             stripePaymentIntentId: '$stripePaymentIntentId',
//             createdAt: '$createdAt',
//             updatedAt: '$updatedAt',
//             user: {
//                 id: '$userDetails._id',
//                 name: {
//                     $concat: [
//                         { $ifNull: ['$userDetails.firstName', ''] },
//                         ' ',
//                         { $ifNull: ['$userDetails.lastName', ''] }
//                     ]
//                 },
//                 firstName: '$userDetails.firstName',
//                 lastName: '$userDetails.lastName',
//                 email: '$userDetails.email',
//                 role: '$userDetails.role',
//                 phone: '$userDetails.phone',
//                 profileImage: '$userDetails.profileImage',
//                 currentClub: '$userDetails.currentClub',
//                 league: '$userDetails.league',
//                 category: '$userDetails.category',
//                 position: '$userDetails.position',
//                 jerseyNumber: '$userDetails.jerseyNumber',
//                 teamName: '$userDetails.teamName',
//                 teamLocation: '$userDetails.teamLocation',
//             },
//             team: {
//                 $cond: {
//                     if: { $ne: ['$teamDetails._id', null] },
//                     then: {
//                         id: '$teamDetails._id',
//                         teamName: '$teamDetails.teamName',
//                         coachName: '$teamDetails.coachName',
//                         coachEmail: '$teamDetails.coachEmail',
//                         players: '$teamDetails.players',
//                         subscriptionExpiry: '$teamDetails.subscriptionExpiry',
//                         createdAt: '$teamDetails.createdAt',
//                     },
//                     else: null
//                 }
//             },
//             subscription: {
//                 $cond: {
//                     if: { $ne: ['$subscriptionDetails._id', null] },
//                     then: {
//                         id: '$subscriptionDetails._id',
//                         name: '$subscriptionDetails.name',
//                         price: '$subscriptionDetails.price',
//                         duration: '$subscriptionDetails.duration',
//                     },
//                     else: null
//                 }
//             },
//         },
//     });

//     // Handle sorting
//     const sortOptions: any = {};
//     if (sortBy && sortOrder) {
//         const sortFieldMap: any = {
//             'amount': 'amount',
//             'createdAt': 'createdAt',
//             'firstName': 'user.firstName',
//             'lastName': 'user.lastName',
//             'email': 'user.email',
//             'currentClub': 'user.currentClub',
//             'category': 'user.category',
//             'league': 'user.league',
//             'paymentType': 'paymentType',
//         };
//         const mappedSortField = sortFieldMap[sortBy] || 'createdAt';
//         sortOptions[mappedSortField] = sortOrder === 'asc' ? 1 : -1;
//     } else {
//         sortOptions.createdAt = -1;
//     }

//     pipeline.push({ $sort: sortOptions });

//     // Use $facet for pagination and totals
//     pipeline.push({
//         $facet: {
//             metadata: [{ $count: 'total' }],
//             data: [{ $skip: skip }, { $limit: limit }],
//             summary: [
//                 {
//                     $group: {
//                         _id: null,
//                         totalRevenue: { $sum: '$amount' },
//                         totalPayments: { $sum: 1 },
//                     },
//                 },
//             ],
//         },
//     });

//     {
//       $sort:
//         sortBy && sortOrder
//           ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
//           : { totalRevenue: -1 },
//     },

//     const total = result[0]?.metadata[0]?.total || 0;
//     const totalRevenue = result[0]?.summary[0]?.totalRevenue || 0;
//     const totalPayments = result[0]?.summary[0]?.totalPayments || 0;
//     const payments = result[0]?.data || [];

//     return {
//         totalRevenue,
//         totalPayments,
//         data: payments,
//         meta: {
//             total,
//             page,
//             limit,
//         },
//     };
// };

const totalRevenue = async (params: any, options: IOption) => {
    const { page, limit, skip, sortBy, sortOrder } = pagination(options);
    const { searchTerm, year, paymentType, ...filterData } = params;

    const paymentMatchConditions: any = {
        status: 'completed',
    };

    if (paymentType) {
        paymentMatchConditions.paymentType = paymentType;
    }
    if (year) {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        paymentMatchConditions.createdAt = {
            $gte: startDate,
            $lte: endDate,
        };
    }

    const pipeline: any[] = [
        { $match: paymentMatchConditions },

        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'teams',
                localField: 'team',
                foreignField: '_id',
                as: 'teamDetails',
            },
        },
        { $unwind: { path: '$teamDetails', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'subscriptions',
                localField: 'subscription',
                foreignField: '_id',
                as: 'subscriptionDetails',
            },
        },
        { $unwind: { path: '$subscriptionDetails', preserveNullAndEmptyArrays: true } },
    ];

    const userFilterConditions: any = {};

    if (searchTerm) {
        userFilterConditions.$or = [
            { 'userDetails.firstName': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.lastName': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.email': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.category': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.league': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.currentClub': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.teamName': { $regex: searchTerm, $options: 'i' } },
            { 'userDetails.teamLocation': { $regex: searchTerm, $options: 'i' } },
            { 'teamDetails.teamName': { $regex: searchTerm, $options: 'i' } },
            { 'teamDetails.coachName': { $regex: searchTerm, $options: 'i' } },
        ];
    }

    if (Object.keys(filterData).length) {
        Object.entries(filterData).forEach(([field, value]) => {
            if (field === 'position') {
                userFilterConditions[`userDetails.${field}`] = { $in: [value] };
            } else {
                userFilterConditions[`userDetails.${field}`] = value;
            }
        });
    }

    if (Object.keys(userFilterConditions).length) {
        pipeline.push({ $match: userFilterConditions });
    }

    // Project the final structure
    pipeline.push({
        $project: {
            _id: 0,
            paymentId: '$_id',
            amount: '$amount',
            currency: '$currency',
            status: '$status',
            paymentType: '$paymentType',
            stripeSessionId: '$stripeSessionId',
            stripePaymentIntentId: '$stripePaymentIntentId',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            user: {
                id: '$userDetails._id',
                name: {
                    $concat: [
                        { $ifNull: ['$userDetails.firstName', ''] },
                        ' ',
                        { $ifNull: ['$userDetails.lastName', ''] }
                    ]
                },
                firstName: '$userDetails.firstName',
                lastName: '$userDetails.lastName',
                email: '$userDetails.email',
                role: '$userDetails.role',
                phone: '$userDetails.phone',
                profileImage: '$userDetails.profileImage',
                currentClub: '$userDetails.currentClub',
                league: '$userDetails.league',
                category: '$userDetails.category',
                position: '$userDetails.position',
                jerseyNumber: '$userDetails.jerseyNumber',
                teamName: '$userDetails.teamName',
                teamLocation: '$userDetails.teamLocation',
            },
            team: {
                $cond: {
                    if: { $ne: ['$teamDetails._id', null] },
                    then: {
                        id: '$teamDetails._id',
                        teamName: '$teamDetails.teamName',
                        coachName: '$teamDetails.coachName',
                        coachEmail: '$teamDetails.coachEmail',
                        players: '$teamDetails.players',
                        subscriptionExpiry: '$teamDetails.subscriptionExpiry',
                        createdAt: '$teamDetails.createdAt',
                    },
                    else: null
                }
            },
            subscription: {
                $cond: {
                    if: { $ne: ['$subscriptionDetails._id', null] },
                    then: {
                        id: '$subscriptionDetails._id',
                        name: '$subscriptionDetails.name',
                        price: '$subscriptionDetails.price',
                        duration: '$subscriptionDetails.duration',
                    },
                    else: null
                }
            },
        },
    });

    // Handle sorting
    const sortOptions: any = {};
    if (sortBy && sortOrder) {
        const sortFieldMap: any = {
            'amount': 'amount',
            'createdAt': 'createdAt',
            'firstName': 'user.firstName',
            'lastName': 'user.lastName',
            'email': 'user.email',
            'currentClub': 'user.currentClub',
            'category': 'user.category',
            'league': 'user.league',
            'paymentType': 'paymentType',
        };
        const mappedSortField = sortFieldMap[sortBy] || 'createdAt';
        sortOptions[mappedSortField] = sortOrder === 'asc' ? 1 : -1;
    } else {
        sortOptions.createdAt = -1;
    }

    pipeline.push({ $sort: sortOptions });

    // Use $facet for pagination and totals
    pipeline.push({
        $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limit }],
            summary: [
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$amount' },
                        totalPayments: { $sum: 1 },
                    },
                },
            ],
        },
    });

    // Execute aggregation
    const result = await Payment.aggregate(pipeline);

    const total = result[0]?.metadata[0]?.total || 0;
    const totalRevenue = result[0]?.summary[0]?.totalRevenue || 0;
    const totalPayments = result[0]?.summary[0]?.totalPayments || 0;
    const payments = result[0]?.data || [];

    return {
        totalRevenue,
        totalPayments,
        data: payments,
        meta: {
            total,
            page,
            limit,
        },
    };
};
const singleplayerView = async (playerId: string) => {
  const player = await User.findById(playerId).select(
    'firstName lastName category teamName league teamLocation email createdAt',
  );
  if (!player) {
    throw new Error('Player not found');
  }

  return player;
};
const singleTeamView = async (teamId: string) => {
  const team = await Team.findById(teamId).select(
    'teamName coachName coachEmail players createdAt',
  );
  if (!team) {
    throw new Error('Team not found');
  }
  return team;
};

const deletePlayerAccount = async (playerId: string) => {
  const player = await User.findByIdAndDelete(playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  return player;
};

const deleteTeamAccount = async (teamId: string) => {
  const team = await Team.findByIdAndDelete(teamId);
  if (!team) {
    throw new Error('Team not found');
  }

  return team;
};

export const dashboardService = {
  dashboardOverview,
  getMonthlyReveneueChart,
  singleplayerView,
  singleTeamView,
  deletePlayerAccount,
  deleteTeamAccount,
  totalRevenue
};
