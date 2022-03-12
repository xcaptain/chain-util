module.exports = async () => {
  return {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-node',
    testTimeout: 60000,
    moduleNameMapper: {
      '^@polkadot/api$': '@polkadot/api/index.cjs',
      '^@polkadot/api-derive$': '@polkadot/api-derive/index.cjs',
      '^@polkadot/api-derive/packageInfo$': '@polkadot/api-derive/packageInfo.cjs',

      '^@polkadot/api-augment$': '@polkadot/api-augment/index.cjs',
      '^@polkadot/api-augment/(.*)': '@polkadot/api-augment/$1.cjs',

      '^@polkadot/api-base$': '@polkadot/api-base/index.cjs',
      '^@polkadot/api-base/packageInfo$': '@polkadot/api-base/packageInfo.cjs',

      '^@polkadot/rpc-core$': '@polkadot/rpc-core/index.cjs',
      '^@polkadot/rpc-core/packageInfo$': '@polkadot/rpc-core/packageInfo.cjs',

      '^@polkadot/rpc-provider$': '@polkadot/rpc-provider/index.cjs',
      '^@polkadot/rpc-provider/packageInfo$': '@polkadot/rpc-provider/packageInfo.cjs',

      '^@polkadot/types$': '@polkadot/types/index.cjs',
      '^@polkadot/types/packageInfo$': '@polkadot/types/packageInfo.cjs',
      '^@polkadot/types/create$': '@polkadot/types/create/index.cjs',
      '^@polkadot/types/create/(.*)': '@polkadot/types/create/$1.cjs',
      '^@polkadot/types/primitive$': '@polkadot/types/primitive/index.cjs',
      '^@polkadot/types/augment$': '@polkadot/types/augment/index.cjs',
      '^@polkadot/types/metadata$': '@polkadot/types/metadata/index.cjs',
      '^@polkadot/types/metadata/decorate$': '@polkadot/types/metadata/decorate/index.cjs',
      '^@polkadot/types/types$': '@polkadot/types/types/index.cjs',
      '^@polkadot/types/(.*)/(.*)': '@polkadot/types/$1/$2.cjs',

      '^@polkadot/types-augment$': '@polkadot/types-augment/index.cjs',
      '^@polkadot/types-augment/(.*)': '@polkadot/types-augment/$1.cjs',

      '^@polkadot/types-codec$': '@polkadot/types-codec/index.cjs',
      '^@polkadot/types-codec/packageInfo$': '@polkadot/types-codec/packageInfo.cjs',
      '^@polkadot/types-codec/abstract/AbstractInt$': '@polkadot/types-codec/abstract/AbstractInt.cjs',

      '^@polkadot/networks/packageInfo$': '@polkadot/networks/packageInfo.cjs',
      '^@polkadot/networks/interfaces$': '@polkadot/networks/interfaces.cjs',
      '^@polkadot/networks$': '@polkadot/networks/index.cjs',

      '^@polkadot/metadata/(.*)/(.*)': '@polkadot/metadata/$1/$2.cjs',
      '^@polkadot/metadata/decorate$': '@polkadot/metadata/decorate/index.cjs',
      '^@polkadot/metadata/(.*)': '@polkadot/metadata/$1.cjs',
      '^@polkadot/metadata$': '@polkadot/metadata/index.cjs',

      '^@polkadot/rpc-augment$': '@polkadot/rpc-augment/index.cjs',

      '^@polkadot/types-unknown/(.*)': '@polkadot/types-unknown/$1.cjs',
      '^@polkadot/types-known/packageInfo$': '@polkadot/types-known/packageInfo.cjs',
      '^@polkadot/types-known$': '@polkadot/types-known/index.cjs',

      '^@polkadot/util-crypto/packageInfo$': '@polkadot/util-crypto/packageInfo.cjs',
      '^@polkadot/util$': '@polkadot/util/index.cjs',
      '^@polkadot/util-crypto$': '@polkadot/util-crypto/index.cjs',
      '^@polkadot/wasm-crypto$': '@polkadot/wasm-crypto/index.cjs',
      '^@polkadot/wasm-crypto-asmjs/(.*)': '@polkadot/wasm-crypto-asmjs/$1.cjs',
      '^@polkadot/wasm-crypto-asmjs$': '@polkadot/wasm-crypto-asmjs/empty.cjs',
      '^@polkadot/wasm-crypto-wasm/(.*)': '@polkadot/wasm-crypto-wasm/$1.cjs',
      '^@polkadot/wasm-crypto-wasm$': '@polkadot/wasm-crypto-wasm/data.cjs',

      '^@polkadot/x-fetch$': '@polkadot/x-fetch/node.cjs',
      '^@polkadot/x-ws$': '@polkadot/x-ws/node.cjs',
      '^@polkadot/keyring$': '@polkadot/keyring/index.cjs',
      '^@polkadot/x-global$': '@polkadot/x-global/index.cjs',
      '^@polkadot/x-randomvalues$': '@polkadot/x-randomvalues/node.cjs',
      '^@polkadot/x-textdecoder$': '@polkadot/x-textdecoder/node.cjs',
      '^@polkadot/x-textencoder$': '@polkadot/x-textencoder/node.cjs',
      '^@polkadot/x-bigint/(.*)': '@polkadot/x-bigint/$1.cjs',
      '^@polkadot/x-bigint$': '@polkadot/x-bigint/index.cjs',
      '^@polkadot/x-noble-secp256k1$': '@polkadot/x-noble-secp256k1/index.cjs',
      '^@polkadot/x-noble-hashes/(.*)': '@polkadot/x-noble-hashes/$1.cjs',
      '^@polkadot/x-noble-hashes$': '@polkadot/x-noble-hashes/index.cjs',
    },
  };
};