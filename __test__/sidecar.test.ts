import { testSideCar } from '../src';
import { Keyring } from '@polkadot/api';
import {cryptoWaitReady} from '@polkadot/util-crypto';

beforeAll(async () => {
    await cryptoWaitReady();
});

test('can query credit', async () => {
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice
    const credit = await testSideCar.getUserCredit(address);

    expect(credit).toBe(100);
});

test('can query balance', async () => {
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice
    const balance = await testSideCar.getAccountBalanceInfo(address);

    expect(balance.free).toBeGreaterThan(BigInt('1000000000000000000000000')); // 考虑测试中其他消耗
});

test('can send imonline', async () => {
    const keyring = new Keyring({ type: 'sr25519' });
    const deviceKeyPair = keyring.addFromUri('//Alice');

    const hash = await testSideCar.imOnline(deviceKeyPair);
    expect(hash.length).toBe(66);
});

test('can register server', async () => {
    const keyring = new Keyring({ type: 'sr25519' });
    const deviceKeyPair = keyring.addFromUri('//Alice');

    const hash = await testSideCar.registerServer(deviceKeyPair, 10);
    expect(hash.length).toBe(66);
    expect(hash.startsWith('0x')).toBe(true);
});

test('can transfer', async () => {
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    const hash = await testSideCar.transfer(alice, bob.address, '1000000000000000000000000');
    expect(hash.length).toBe(66);
});

test('evm device pair', async () => {
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');

    const hash = await testSideCar.devicePairMultiAccounts(alice, new Uint8Array(20), new Uint8Array(65));
    expect(hash.length).toBe(66);
});