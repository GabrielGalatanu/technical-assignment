import jwt from "jsonwebtoken";
const authSecretKey = process.env.authSecretKey;

const decodeJwtToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, authSecretKey, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export { decodeJwtToken };
