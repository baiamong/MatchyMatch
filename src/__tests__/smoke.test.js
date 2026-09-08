describe('Smoke Tests', () => {
  test('basic smoke test - should pass', () => {
    expect(true).toBeTruthy();
  });

  test('intentional failure to demonstrate test failure', () => {
    // Intentional failure:
    expect(true).toBe(false);
  });
});
