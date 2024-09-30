import { encrypt, decrypt } from "./encrypt-string";

function main() {
  testCiphertext();
  testEmptyKey();
  roundTripTests();
}

function testCiphertext() {
  const key = ' !"';
  const plaintext = "AAAAAAA";
  const expected = "ABCABCA";
  const actual = encrypt(plaintext, key);
  console.log("  Plaintext :", plaintext);
  console.log("  Ciphertext:", actual);
  console.log("  Key:       ", key);
  if (expected !== actual) {
    console.log("FAIL ciphertext case ----------");
  }
  console.log();
}

function testEmptyKey() {
  const noKey = "";
  const plaintext = "Hello world";
  const expected = "Hello world";
  const actual = encrypt(plaintext, noKey);
  console.log("  Plaintext :", plaintext);
  console.log("  Ciphertext:", actual);
  console.log("  Key:       ", noKey);
  if (expected !== actual) {
    console.log("FAIL empty key case ----------");
  }
  console.log();
}

// Round trip tests
function roundTripTests() {
  const key = "my-secret";
  const messages = [
    "Hello world this is a test can you hear me now",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ];
  for (const each of messages) {
    const ciphertext = encrypt(each, key);
    const decrypted = decrypt(ciphertext, key);
    const pass = decrypted === each;
    console.log("  Plaintext: ", each);
    console.log("  Ciphertext:", ciphertext);
    console.log("  Key:       ", key);
    if (!pass) {
      console.log("FAIL round trip test ----------");
    }
    console.log();
  }
}

main();
