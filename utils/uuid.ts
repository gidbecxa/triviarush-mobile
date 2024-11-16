export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36); // Convert to base-36 for compactness

  const randomNum = Math.random().toString(36).substring(2, 10); // Removing the "0."

  const entropyPart = 'TR'; // for TriviaRush

  // A simple hash function to mix the characters
  const hash = (str: string): string => {
    let hashValue = 0;
    for (let i = 0; i < str.length; i++) {
      hashValue = (hashValue << 5) - hashValue + str.charCodeAt(i);
      hashValue |= 0; // Convert to 32-bit integer
    }
    return hashValue.toString(36);
  };

  const uniqueId = `${timestamp}-${randomNum}-${hash(timestamp + randomNum)}`;

  return entropyPart + "-" + btoa(uniqueId);
};