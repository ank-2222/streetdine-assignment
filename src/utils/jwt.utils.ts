import jwt from "jsonwebtoken";

export default class JWTUtils {
  PRIVATE_KEY: jwt.Secret;

  constructor() {
    this.PRIVATE_KEY = process.env.JWT_SECRET as jwt.Secret;
  }

  public generateTokens = async (     //generates jwt token
    userData: any
  ): Promise<{
    access_token: string;
  }> => {
    if (!this.PRIVATE_KEY) {
      throw new Error("No data in key file");
    }
    const [access_token] = await Promise.all([
      this.generateAccessToken(userData),
    ]);

    return {
      access_token,
    };
  };

  private generateAccessToken = async (userData: any) => {    //generates access token
    const access_token = jwt.sign(
      {
        token: "access_token",
        data: userData,
      },
      this.PRIVATE_KEY,
      {
        expiresIn: "15h",
      }
    );
    return access_token;
  };
}
