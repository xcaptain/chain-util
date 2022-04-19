import { testSideCar } from './src';
import { Keyring } from '@polkadot/api';
import {cryptoWaitReady} from '@polkadot/util-crypto';

async function main() {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');

    const addr1 = new Uint8Array(20);
    addr1[0] = 1;
    const hash = await testSideCar.devicePairMultiAccounts(alice, addr1, new Uint8Array(65));
    console.log('hash', hash);
}
main()