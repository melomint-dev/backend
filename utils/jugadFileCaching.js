import { readdir, statSync, unlink } from 'fs';
import { join, resolve } from 'path';

const folderPath = resolve('./decrypted');
export const deleteOldestFiles = (maxFileCount) => {
  readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    // Sort files by their last modified time in ascending order (oldest first)
    files.sort((a, b) => {
      const fileAPath = join(folderPath, a);
      const fileBPath = join(folderPath, b);
      const statA = statSync(fileAPath);
      const statB = statSync(fileBPath);
      return statA.mtime - statB.mtime;
    });

    const filesToDeleteCount = files.length - maxFileCount;
    if (filesToDeleteCount <= 0) {
      console.log('No files to delete.');
      return;
    }

    for (let i = 0; i < filesToDeleteCount; i++) {
      const fileToDelete = join(folderPath, files[i]);
      unlink(fileToDelete, (err) => {
        if (err) {
          console.error('Error deleting file:', fileToDelete, err);
        } else {
          console.log('Deleted file:', fileToDelete);
        }
      });
    }
  });
}


