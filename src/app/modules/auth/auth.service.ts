import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;
  //static method

  //check User exist

  //creating instance method of user
  // const user = new User();

  // const isUserExist = await User.findOne(
  //   { id },
  //   { id: 1, password: 1, needsPasswordChange: 1 },
  // );

  //access to our instance method
  // const isUserExist = await user.isUserExist(id);

  //**** access to our static method */
  const isUserExist = await User.isUserExist(id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //match password

  // const isPasswordMatched = await bcrypt.compare(
  //   password,
  //   isUserExist?.password,
  // );
  // const PasswordMatched = await user.isPasswordMatched(
  //   password,
  //   isUserExist?.password,
  // );
  // if (
  //   isUserExist.password &&
  //   !user.isPasswordMatched(password, isUserExist?.password)
  // ) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  // }

  const PasswordMatched = await User.isPasswordMatched(
    password,
    isUserExist.password,
  );

  if (!PasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { id: UserId, role, needsPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { UserId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    { UserId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.expires_in as string,
  );

  // console.log({
  //   accessToken,
  //   refreshToken,
  //   needsPasswordChange,
  // });

  // const refreshToken = jwt.sign({
  //   id: isUserExist.id,
  //   role: isUserExist.role,
  // },config.jwt.refresh_secret as Secret,{
  //   expiresIn:config.jwt.refresh_expires_in
  // });

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  console.log(token);
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { UserId } = verifiedToken;
  console.log(UserId, 'userId', verifiedToken);

  // user delete hoice kintu  refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(UserId);
  console.log(isUserExist);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
