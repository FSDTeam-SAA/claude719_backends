import AppError from '../../error/appError';
import sendMailer from '../../helper/sendMailer';
import User from '../user/user.model';
import { ITeam } from './team.interface';
import Team from './team.model';

const createteam = async (payload: ITeam) => {
  const user = await User.findOne({ email: payload.coachEmail });
  if (user) throw new AppError(409, 'User already exists');

  const result = await Team.create(payload);
  if (!result) throw new AppError(500, 'Something went wrong');

  const genaretPassword = Math.random().toString(36).slice(-8);

  const userde = await User.create({
    firstName: payload.coachName,
    lastName: payload.coachEmail,
    email: payload.coachEmail,
    role: 'coach',
    password: genaretPassword,
    team: result._id,
  });

  await sendMailer(
    userde.email,
    'account create successfull',
    `Your password: ${genaretPassword}\n Email: ${userde.email}`,
  );

  return result;
};

export const teamServices = {
  createteam,
};
