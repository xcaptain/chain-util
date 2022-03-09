import { testSideCar } from '../src/sidecar';

test('can query credit', async () => {
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice
    const credit = await testSideCar.getUserCreditData(address);

    expect(credit.credit).toBe(100);
});

test('can query balance', async () => {
    const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice
    const balance = await testSideCar.getAccountBalanceInfo(address);

    expect(balance.free).toBe(BigInt('10000000000000000000000000'));
})