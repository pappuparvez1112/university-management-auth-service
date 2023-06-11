import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage } from '../interfaces/error';

const handleZodError = (error: ZodError) => {
  //   console.log(
  //     error.issues.map(issue => issue.path),
  //     'zod error'
  //   );
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    errorMessages: errors,
  };
};
export default handleZodError;
