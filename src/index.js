import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), { alias: { k: 'key', e: 'encode', d: "decode" } });
const [event, path] = argv._;
const key = argv.key;
