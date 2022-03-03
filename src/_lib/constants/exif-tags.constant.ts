export enum TagFormat {
  UnsignedByte = 0x01,
  ASCIIString = 0x02,
  UnsignedShort = 0x03,
  UnsignedLong = 0x04,
  UnsignedRational = 0x05,
  SignedByte = 0x06,
  Undefined = 0x07,
  SignedShort = 0x08,
  SignedLong = 0x09,
  SignedRational = 0x0a,
  SingleFloat = 0x0b,
  DoubleFloat = 0x0c,
}

export const COMPONENT_SIZE_BY_FORMAT: Record<number, number> = {
  0x01: 1, // Unsigned Byte
  0x02: 1, // ASCII String
  0x03: 2, // Unsigned Short
  0x04: 4, // Unsigned Long
  0x05: 8, // Unsigned Rational
  0x06: 1, // Signed Byte
  0x07: 1, // Undefined
  0x08: 2, // Signed Short
  0x09: 4, // Signed Long
  0x0a: 8, // Signed Rational
  0x0b: 4, // Single Float
  0x0c: 8, // Double Float
};
