import moduleAlias from 'module-alias';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

moduleAlias.addAliases({
    '@': path.resolve(__dirname, './src'),
    'src': path.resolve(__dirname, './src')
});

import './app.mjs';
