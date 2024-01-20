import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/res.error";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errors.handler";

export default class IUserAuthValidation {  //validates user authentication
  private jwtVerifyPromisified = (token: string, secret: string) => {        //verifies jwt token
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          throw new ErrorHandler({                             //throws error if token is invalid
            status_code: 400,
            message: "You are not authorized to access this resource!",
            message_code: "NOT_AUTHORIZED",
          });
        } else {
          resolve(payload);
        }
      });
    });
  };

  public protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;

      if (
        req.headers.authorization &&       //checks if token is in header
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];     //splits token
      } else if (req.cookies.token) {
        token = req.cookies.token;
      } else {
        throw new ErrorHandler({         //
          status_code: 400,
          message: "You are not authorized to access this resource!",
          message_code: "NOT_AUTHORIZED",
        });
      }

      let JWT_SECRET = process.env.JWT_SECRET;

      if (!JWT_SECRET)
        throw new ErrorHandler({
          status_code: 400,
          message: "No data in key file",
          message_code: "SOMETHING_WENT_WRONG",
        });

      const payload = await this.jwtVerifyPromisified(token, JWT_SECRET);   //verifies token

      if (!payload) {
        throw new ErrorHandler({
          status_code: 400,
          message: "You are not authorized to access this resource!",
          message_code: "NOT_AUTHORIZED",
        });
      }

      const jsonPayload = JSON.parse(JSON.stringify(payload));

      req.body.current_user = jsonPayload.data;

      next();
    } catch (error) {
      errorHandler(res, error);
    }
  };
}
