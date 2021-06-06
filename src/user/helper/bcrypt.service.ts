import * as bcrypt from 'bcrypt';

export async function Compare(plainText: string, hash: string) {
  return await bcrypt.compare(plainText, hash);
}

export async function Hash(plainText: string) {
  return bcrypt.hash(plainText, 10);
}
