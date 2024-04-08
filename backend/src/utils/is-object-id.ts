import { Types } from "mongoose";

export function isObjectId(data: any): data is Types.ObjectId | string {
  return Boolean((Types.ObjectId.isValid(data) && !data["id"]) || (data?.id && (data instanceof Types.ObjectId)));
}