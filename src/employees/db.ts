import db from "../config/pg.config";
import {  IEmployeeResObj } from "./interface";

export default class employeeDb {
  protected isEmployeeExist = async (employee_id: string): Promise<boolean> => {
    const query = `SELECT EXISTS(
		SELECT id FROM employees WHERE employee_id = $1 LIMIT 1);`;
    const res = await db.query(query, [employee_id]);

    if (res instanceof Error) {
      throw res;
    }

    return res.rows[0] as unknown as boolean;
  };
  protected addEmployee = async (reqObj: any): Promise<IEmployeeResObj> => {
    const query = db.format(`INSERT INTO employees ? RETURNING *`, reqObj);
    const res = await db.query(query);
    if (res instanceof Error) {
      throw res;
    } else {
      return res.rows[0] as unknown as IEmployeeResObj;
    }
  };
  protected getEmployeeById = async (
    employee_id: string
  ): Promise<IEmployeeResObj> => {
    const query = `SELECT * FROM employees WHERE employee_id = $1 LIMIT 1`;
    const res = await db.query(query, [employee_id]);
    if (res instanceof Error) {
      throw res;
    } else {
      return res.rows[0] as unknown as IEmployeeResObj;
    }
  };
  protected getAllEmployee = async (
    page: number,
    limit: number
  ): Promise<IEmployeeResObj[]> => {
    const offset = (page - 1) * limit;
    const query = {
      text: `SELECT * FROM employees OFFSET $1 LIMIT $2`,
      values: [offset, limit],
    };

    const res = await db.query(query);

    if (res instanceof Error) {
      throw res;
    } else {
      return res.rows as any;
    }
  };
  protected deleteEmployee = async (employee_id: string): Promise<any> => {
    const query = `delete from employees where employee_id = $1`;
    const res = await db.query(query, [employee_id]);
    if (res instanceof Error) {
      throw res;
    }
  };
  protected updateEmployee = async (
    reqObj: any,
    employee_id: string
  ): Promise<any> => {
    const updateFields = Object.keys(reqObj)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(reqObj);
    const query = {
      text: `UPDATE employees SET ${updateFields} WHERE employee_id = '${employee_id}' RETURNING *`,
      values: values,
    };

    const res = await db.query(query);
    if (res instanceof Error) {
      throw res;
    }
    return res.rows[0] as any;
  };
}
