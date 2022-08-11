import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index', 'src/encode', 'src/decode', 'src/utils',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
