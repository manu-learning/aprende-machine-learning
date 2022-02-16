module.exports = function(eleventyConfig) {
    // agregamos los objetivos que queremos observar (watch)
    eleventyConfig.addWatchTarget("./src");
    eleventyConfig.addPassthroughCopy('./src');

    // agregamos opciones para browsersync (refresca el browser)
    eleventyConfig.setBrowserSyncConfig({
        notify: true
    });

    eleventyConfig.addPassthroughCopy({
        'assets/': 'assets/'
        // './node_modules/alpinejs/dist/cdn.js': './src/js/alpine.js',
        // './node_modules/axios/dist/axios.js': './src/js/axios.js'
    });

    // Return your Object options:
    // retornamos la opción `dir` para cambiar la ruta relativa src/fichero por ./fichero
    return {
        dir: {
            input: "src",
            output: "public"
        }
  }
};
