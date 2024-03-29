import { Request, Response } from "express";
import { errorHandler } from "../utils/res.error";
import { IResponse } from "../utils/interface";
import { RequestMethods } from "../utils/enums";
import employeeService from "./services";
import { IAuthResponse, IEmployeeReqObj } from "./interface";

export default class employeeController extends employeeService {
  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      const method = req.method;
      const routeName = req.route.path.split("/")[1];    //gets route name from url

      let response: IResponse = {
        success: false,
      };
      let statusCode = 200;

      if (routeName === "employees") {   //checks if route name is employees
        if (method === RequestMethods.POST) {      //checks if method is post
          const data = await this.signupController(req.body);
          response = data.user;
          res.cookie("token", data.token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: false,
            secure: true,
            sameSite: "none",
          });
          statusCode = 201;
        }
        if (method === RequestMethods.DELETE) {     //checks if method is delete
          const { employeeId } = req.params;

          response = await this.deleteEmployeeController(employeeId);
          statusCode = 201;
        }
        if (method === RequestMethods.PUT) {         //checks if method is put
          const { employeeId } = req.params;
          const reqObj = req.body;
          response = await this.updateEmployeeController(reqObj, employeeId);
          statusCode = 201;
        }
        if (method === RequestMethods.GET) {          //checks if method is get
          const { employeeId } = req.params;

          response = await this.getEmployeeController(employeeId);
          statusCode = 201;
        }
      } else if (routeName === "allemployees") {        //checks if route name is allemployees
        if (method === RequestMethods.GET) {
          const page = parseInt(req.query.page as string, 10) || 1;
          const limit = parseInt(req.query.limit as string, 10) || 10;
          const data = await this.getAllEmployeesController(page, limit);
          response = data;
          statusCode = 201;
        }
      }
      res.status(statusCode).send(response);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  private signupController = async (
    reqObj: IEmployeeReqObj
  ): Promise<IAuthResponse> => {
    const data = await this.addEmployeeService(reqObj);       //calls addEmployeeService
    const user: IResponse = {
      success: true,
      message: "Employee added successfully",
      message_code: "EMPLOYEE_ADDED",
      data: data.user,
    };
    const token = data.token;            //gets token from addEmployeeService
    return { user, token };
  };
  private deleteEmployeeController = async (
    employee_id: string
  ): Promise<IResponse> => {
    await this.deleteEmployeeService(employee_id);       //calls deleteEmployeeService
    const response: IResponse = {
      success: true,
      message: "Employee Deleted successfully",
      message_code: "EMPLOYEE_DELETED",
    };
    return response;
  };
  private updateEmployeeController = async (
    reqObj: any,
    employee_id: string
  ): Promise<IResponse> => {
    await this.updateEmployeeService(reqObj, employee_id);   // calls updateEmployeeService
    const response: IResponse = {
      success: true,
      message: "Employee Updated successfully",
      message_code: "EMPLOYEE_UPDATED",
    };
    return response;
  };

  private getEmployeeController = async (
    employee_id: string
  ): Promise<IResponse> => {
    const data = await this.getEmployeeDetailService(employee_id);  //calls getEmployeeDetailService
    const response: IResponse = {
      success: true,
      message: "Employee Fetched successfully",
      message_code: "EMPLOYEE_FETCHED",
      data: data,
    };
    return response;
  };
  private getAllEmployeesController = async (
    page: number,
    limit: number
  ): Promise<IResponse> => {
    const data = await this.getAllEmployeeDetailService(page, limit);   //calls getAllEmployeeDetailService
    const response: IResponse = {
      success: true,
      message: "All Employee Fetched successfully",
      message_code: "ALL_EMPLOYEE_FETCHED",
      data: data,
    };
    return response;
  };
}
