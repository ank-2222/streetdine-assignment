import ErrorHandler from "../utils/errors.handler";
import JWTUtils from "../utils/jwt.utils";
import employeeHelper from "./helper";
import { IEmployeeReqObj, IEmployeeResObj } from "./interface";
import { v4 } from "uuid";

export default class employeeService extends employeeHelper {
  jwtHelper: JWTUtils;
  constructor() {
    super();
    this.jwtHelper = new JWTUtils();
  }

  protected addEmployeeService = async (
    reqObj: IEmployeeReqObj
  ): Promise<any> => {
    const data = {
      id: v4(),
      ...reqObj,
      created_at: new Date(),
    };
    const token = await this.jwtHelper.generateTokens(data);
    await this.validateEmailAndDob(reqObj.email, reqObj.dob);

    const isEmployeeExist: any = await this.isEmployeeExist(reqObj.employee_id);
    if (isEmployeeExist.exists) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Employee already exist",
        message_code: "EMPLOYEE_ALREADY_EXIST",
      });
    }

    const insertResponse = await this.addEmployee(data);

    if (!insertResponse) {
      throw new ErrorHandler({
        status_code: 500,
        message: "Something went wrong",
        message_code: "SOMETHING_WENT_WRONG_WHILE_ADDING_EMPLOYEE",
      });
    }
    const response = {
      user: insertResponse,
      token: token.access_token,
    };
    return response;
  };

  protected deleteEmployeeService = async (
    employee_id: string
  ): Promise<any> => {
    const isEmployeeExist: any = await this.isEmployeeExist(employee_id);
    if (!isEmployeeExist.exists) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Employee Does not exist",
        message_code: "EMPLOYEE_NOT_FOUND",
      });
    }
    await this.deleteEmployee(employee_id);
    return;
  };
  protected updateEmployeeService = async (
    reqObj: any,
    employee_id: string
  ): Promise<any> => {
    const isEmployeeExist: any = await this.isEmployeeExist(employee_id);
    if (!isEmployeeExist.exists) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Employee Does not exist",
        message_code: "EMPLOYEE_NOT_FOUND",
      });
    }
    await this.updateEmployee(reqObj, employee_id);
    return;
  };
  protected getEmployeeDetailService = async (
    employee_id: string
  ): Promise<any> => {
    const isEmployeeExist: any = await this.isEmployeeExist(employee_id);
    if (!isEmployeeExist.exists) {
      throw new ErrorHandler({
        status_code: 400,
        message: "Employee Does not exist",
        message_code: "EMPLOYEE_NOT_FOUND",
      });
    }
    const data = await this.getEmployeeById(employee_id);
    return data;
  };
  protected getAllEmployeeDetailService = async (
    page: number,
    limit: number
  ): Promise<any> => {
    const data = await this.getAllEmployee(page, limit);
    return data;
  };
}
