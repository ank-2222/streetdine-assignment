import ErrorHandler from "../utils/errors.handler";
import employeeDb from "./db";

export default class employeeHelper extends employeeDb {
  public validateEmailAndDob = async (email: string, dob: string) => {   //validates email and dob
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isValidDob = dobRegex.test(dob);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Invalid Email format.",
        message_code: "INVALID_EMAIL_FORMAT",
      });
    }
    if (!isValidDob) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Invalid DOB format.",
        message_code: "INVALID_DOB_FORMAT",
      });
    }
  };
}
