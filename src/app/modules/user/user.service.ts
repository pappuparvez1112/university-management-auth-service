import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { AcademicSemester } from '../academicSemester/academicSemesterModel';
import { IStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudent = async (
  student: IStudent,
  user: IUser,
): Promise<IUser | null> => {
  // //auto generated incremental id
  // const academicSemester = {
  //   code: '01',
  //   year: '2030',
  // };
  // const id = await generateStudentId(academicSemester);
  // user.id = id;

  //default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }

  //set role
  user.role = 'student';

  const academicSemester = await AcademicSemester.findById(
    student.academicSemester,
  );

  //generate student id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = await generateStudentId(academicSemester);
    user.id = id;
    student.id = id;
    // console.log(student, 'student');
    //array
    const newStudent = await Student.create([student], { session });
    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
    //set student ---> _id into user.student
    user.student = newStudent[0]._id;

    const newUser = await User.create([user], { session });
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    newUserAllData = newUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  //user --> student ---> academicSemester, academicDepartment , academicFaculty

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    });
  }
  return newUserAllData;

  // const createdUser = await User.create(user);
  // if (!createUser) {
  //   throw new ApiError(400, 'Failed to create user!');
  // }
  // return createdUser;
};

export const UserService = {
  createStudent,
};
