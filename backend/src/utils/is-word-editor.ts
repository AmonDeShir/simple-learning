import { Types } from "mongoose";
import { WordConstructor, WordEditor } from "../types/word.type";
import { isObjectId } from "./is-object-id";

export function isWordEditor(data: Types.ObjectId | string | WordConstructor | WordEditor): data is WordEditor {
  return !isObjectId(data) && isObjectId(data["id"]);
}