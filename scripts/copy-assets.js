import fs from 'fs/promises';
import path from 'path';

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const projectRoot = process.cwd();
  const src = path.resolve(projectRoot, 'attached_assets');
  const dest = path.resolve(projectRoot, 'dist', 'public', 'attached_assets');

  try {
    // Check if source exists
    await fs.access(src);
    console.log(`Copying assets from ${src} to ${dest}`);
    await copyDir(src, dest);
    console.log('Assets copied successfully');
  } catch (err) {
    console.warn('No attached_assets directory found or failed to copy assets:', err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
