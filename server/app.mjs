import moduleAlias from "module-alias";
moduleAlias.addAlias('@src', (fromPath, request, alias) => {
    // fromPath - Full path of the file from which `require` was called
    // request - The path (first argument) that was passed into `require`
    // alias - The same alias that was passed as first argument to `addAlias` (`@src` in this case)
        console.log(1);
    // Return any custom target path for the `@src` alias depending on arguments
    if (fromPath.startsWith(__dirname + '/others')) return __dirname + '/others'
    return __dirname + '/src'
})

import config from '@src/config.mjs'

console.log(1);
