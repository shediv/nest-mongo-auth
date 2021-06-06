import * as mongoose from 'mongoose';

export function mongooseId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export function parseToId(result: any) {
  const res = JSON.stringify(result).replace(/_id/g, 'id');
  return JSON.parse(res);
}
