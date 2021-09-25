import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import strip from '@rollup/plugin-strip';

export default {
	input: 'src/main.js',
	output: {
		file: 'public/main.js',
		format: 'es', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		strip(),
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		terser(), // minify, but only in production
        copy({
            targets: [
              // { src: 'src/index.html', dest: 'public' },
              { src: 'src/*.css', dest: 'public' },
              { src: 'src/images', dest: 'public' }
            ]
          }),
	]
};