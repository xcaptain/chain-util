import { testSideCar } from '../src/sidecar';
import { Keyring } from '@polkadot/api';

test('can query credit', async () => {
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice
    const credit = await testSideCar.getUserCreditData(address);

    expect(credit.credit).toBe(100);
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