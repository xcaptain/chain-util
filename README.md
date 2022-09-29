# chain utils

## build

```bash
npm i
```

## test

1. start a dev chain server

```bash
./deeper-chain --dev
```

2. start a dev api sidecar server

```bash
docker run --rm -it --read-only -e SAS_SUBSTRATE_URL=ws://172.17.0.1:9955 -p 8080:8080 docker.io/parity/substrate-api-sidecar:v13.1.0
```

3. run jest test cases

```bash
npm test
```

## architecture

This package uses `txwrapper-deeper` to submit extrinsics offline, `txwrapper-deeper` helps you encode payload and generate signature of this payload, it's very tedious if you do it manually. Note `txwrapper-deeper` is wrapper for deeper-chain, if you want to submit to other chain, create your own `txwrapper-{YOUR CHAIN}`.  You can follow instructions at [https://github.com/paritytech/txwrapper-core](https://github.com/paritytech/txwrapper-core).

If you want to know how to generate signed transaction payload manually, check [https://github.com/paritytech/polkadot-interaction-examples-rs/blob/main/src/bin/05_transfer_balance.rs](https://github.com/paritytech/polkadot-interaction-examples-rs/blob/main/src/bin/05_transfer_balance.rs)