import { Pool, QueryResult } from "pg";
import appConfig from "../config";

const pool = new Pool(appConfig.sql);

export const query = async (
  text: string,
  params: any[],
): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};
