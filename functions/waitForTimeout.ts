export const waitForTimeout = async (milliseconds: number) =>
  await new Promise((r) => setTimeout(r, milliseconds));
