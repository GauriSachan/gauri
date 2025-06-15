import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

// ⬇️ For __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runCode = (language, code) => {
  return new Promise(async (resolve, reject) => {
    const jobId = uuid();
    const jobDir = path.join(__dirname, '..', 'temp', jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    let filename, image, compileCmd = '', runCmd = '';

    switch (language) {
      case 'python':
        filename = 'main.py';
        image = 'python-runner';
        runCmd = `python3 ${filename}`;
        break;
      case 'c':
        filename = 'main.c';
        image = 'c-runner';
        compileCmd = `gcc ${filename} -o main.out`;
        runCmd = `./main.out`;
        break;
      case 'cpp':
        filename = 'main.cpp';
        image = 'cpp-runner';
        compileCmd = `g++ ${filename} -o main.out`;
        runCmd = `./main.out`;
        break;
      case 'java':
        filename = 'Main.java';
        image = 'java-runner';
        compileCmd = `javac ${filename}`;
        runCmd = `java Main`;
        break;
      default:
        return reject('Unsupported language');
    }

    const filepath = path.join(jobDir, filename);
    fs.writeFileSync(filepath, code);

    let dockerCmd = `docker run --rm -v "${jobDir}:/code" -w /code ${image} sh -c "`;
    if (compileCmd) dockerCmd += `${compileCmd} && `;
    dockerCmd += `${runCmd}"`;

    try {
      const { stdout, stderr } = await execPromise(dockerCmd, { timeout: 10000 });
      fs.rmSync(jobDir, { recursive: true, force: true });

      if (stderr) {
        return reject(stderr);
      }

      resolve(stdout);
    } catch (err) {
      fs.rmSync(jobDir, { recursive: true, force: true });
      reject(err.stderr || err.message || 'Execution error');
    }
  });
};

export default runCode;
