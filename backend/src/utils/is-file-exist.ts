import { access } from 'fs/promises';

export async function isFileExist(filename: string) {
  try {
    await access(filename);
  } 
  catch (err) {
    if ((err as any).code === 'ENOENT') {
      return false;
    }

    throw err;
  }

  return true;
}