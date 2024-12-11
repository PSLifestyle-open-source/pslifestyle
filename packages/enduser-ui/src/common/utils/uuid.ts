const createUUID = (): string => {
  const u32array = new Uint32Array(4); // 128 bits
  window.crypto.getRandomValues(u32array);
  const toHex = (i32: number) => Number(i32).toString(16).padStart(8, "0");

  return Array.from(u32array).map(toHex).join("-");
};

export default createUUID;
