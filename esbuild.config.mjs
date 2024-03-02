import * as esbuild from 'esbuild'

const prod = (process.argv[2] === "production");

const buildLogger = {
	name: 'build-logger',
	setup(build) {
		build.onEnd(result => console.log(`build completed with ${result.errors.length} errors`))
	},
}

const ctx = await esbuild.context({
	bundle: true,
	entryPoints: {
    popup: 'src/popup.ts',
    background: 'src/background.ts',
    content: 'src/content.ts',
		page: 'src/page.ts'
  },
  bundle: true,
  outdir: 'extension',
  minify: false,
	plugins: [ buildLogger ]
})

if (prod) {
	await ctx.rebuild();
	process.exit(0);
} else {
	await ctx.watch();
}