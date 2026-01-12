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
  const totalGk = await Gkstats.countDocuments();
  const totalRevenew = await Payment.countDocuments({ status: 'completed' });

  return { totalRevenew, totalPlayers, totalContact, totalGk };
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

const getAllPlayersRevenue = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, year, ...filterData } = params;

  // Build user match conditions
  const userMatchConditions: any = { 'user.role': 'player' };
  const userSearchableFields = [
    'user.firstName',
    'user.lastName',
    'user.category',
    'user.teamName',
    'user.league',
  ];

  // Handle search term with $and to combine with role
  if (searchTerm) {
    const searchConditions = userSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
    userMatchConditions.$or = searchConditions;
  }

  // Add filter data (prefix with 'user.')
  if (Object.keys(filterData).length) {
    Object.entries(filterData).forEach(([field, value]) => {
      userMatchConditions[`user.${field}`] = value;
    });
  }

  // Build payment match conditions
  const paymentMatchConditions: any = {
    status: 'completed',
    paymentType: 'Individual',
  };

  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    paymentMatchConditions.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await Payment.aggregate([
    { $match: paymentMatchConditions },

    {
      $group: {
        _id: '$user',
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },

    { $match: userMatchConditions },

    {
      $project: {
        _id: 0,
        player: {
          id: '$user._id',
          name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          email: '$user.email',
          teamName: '$user.teamName',
          category: '$user.category',
          league: '$user.league',
          teamLocation: '$user.teamLocation',
        },
        totalRevenue: 1,
        totalPayments: 1,
      },
    },

    {
      $sort: sortBy && sortOrder
        ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        : { totalRevenue: -1 },
    },

    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }],
        summary: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalRevenue' },
              totalPayments: { $sum: '$totalPayments' },
            },
          },
        ],
      },
    },
  ]);

  const total = result[0]?.metadata[0]?.total || 0;
  const totalRevenue = result[0]?.summary[0]?.totalRevenue || 0;
  const totalPayments = result[0]?.summary[0]?.totalPayments || 0;
  const players = result[0]?.data || [];

  return {
    totalRevenue,
    totalPayments,
    players,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getAllTeamReveneue = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, year, ...filterData } = params;

  // Build team match conditions
  const teamMatchConditions: any = {};
  const teamSearchableFields = [
    'team.teamName',
    'team.coachName',
    'team.coachEmail',
  ];

  if (searchTerm) {
    teamMatchConditions.$or = teamSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  // Add filter data (prefix with 'team.')
  if (Object.keys(filterData).length) {
    Object.entries(filterData).forEach(([field, value]) => {
      teamMatchConditions[`team.${field}`] = value;
    });
  }

  // Build payment match conditions
  const paymentMatchConditions: any = {
    status: 'completed',
    paymentType: 'TeamGame',
  };

  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    paymentMatchConditions.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await Payment.aggregate([
    { $match: paymentMatchConditions },

    {
      $group: {
        _id: '$team',
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        playersPaid: { $push: '$user' },
      },
    },

    {
      $lookup: {
        from: 'teams',
        localField: '_id',
        foreignField: '_id',
        as: 'team',
      },
    },
    { $unwind: '$team' },

    // Apply team filtering
    ...(Object.keys(teamMatchConditions).length > 0
      ? [{ $match: teamMatchConditions }]
      : []),

    {
      $project: {
        _id: 0,
        team: {
          id: '$team._id',
          teamName: '$team.teamName',
          coachName: '$team.coachName',
          coachEmail: '$team.coachEmail',
          allPlayers: '$team.players',
        },
        totalRevenue: 1,
        totalPayments: 1,
        playersPaid: 1,
      },
    },

    {
      $sort: sortBy && sortOrder
        ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
        : { totalRevenue: -1 },
    },

    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }],
        summary: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalRevenue' },
              totalPayments: { $sum: '$totalPayments' },
            },
          },
        ],
      },
    },
  ]);

  const total = result[0]?.metadata[0]?.total || 0;
  const totalRevenue = result[0]?.summary[0]?.totalRevenue || 0;
  const totalPayments = result[0]?.summary[0]?.totalPayments || 0;
  const teams = result[0]?.data || [];

  return {
    totalRevenue,
    totalPayments,
    teams,
    meta: {
      total,
      page,
      limit,
    },
  };
};
const singleplayerView = async (playerId: string) => {
    const player = await User.findById(playerId).select('firstName lastName category teamName league teamLocation email createdAt');
    if (!player) {
        throw new Error('Player not found');
    }

    return player;
};
const singleTeamView = async (teamId: string) => {
    const team = await Team.findById(teamId).select('teamName coachName coachEmail players createdAt');
    if (!team) {
        throw new Error('Team not found');
    }
    return team;
}

const deletePlayerAccount = async (playerId: string) => {
    const player = await User.findByIdAndDelete(playerId);
    if (!player) {
        throw new Error('Player not found');
    }
    return player;
    
}

const deleteTeamAccount = async (teamId: string) => {
    
  const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
        throw new Error('Team not found');
    }

    return team;
}

export const dashboardService = {
    dashboardOverview,
    getMonthlyReveneueChart,
    getAllPlayersRevenue,
    getAllTeamReveneue,
    singleplayerView,
    singleTeamView,
    deletePlayerAccount,
    deleteTeamAccount
};
