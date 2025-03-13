
import { useState, useCallback } from 'react';
import { entropyToMnemonic, generateRandomMnemonic } from '@/lib/bip39Utils';

export interface EntropyHookReturn {
  entropy: string;
  setEntropy: (value: string) => void;
  entropyType: string;
  setEntropyType: (value: string) => void;
  wordCount: number;
  setWordCount: (value: number) => void;
  generateRandomMnemonic: () => string;
  generateFromEntropy: () => string;
}

export function useEntropyHandling(): EntropyHookReturn {
  const [entropy, setEntropy] = useState<string>('');
  const [entropyType, setEntropyType] = useState<string>('hex');
  const [wordCount, setWordCount] = useState<number>(12);

  // Generate a random mnemonic
  const generateRandomMnemonicFn = useCallback((): string => {
    const newMnemonic = generateRandomMnemonic(wordCount);
    return newMnemonic;
  }, [wordCount]);

  // Process entropy based on type and convert to mnemonic
  const generateFromEntropy = useCallback((): string => {
    return entropyToMnemonic(entropy, entropyType);
  }, [entropy, entropyType]);

  return {
    entropy,
    setEntropy,
    entropyType,
    setEntropyType,
    wordCount,
    setWordCount,
    generateRandomMnemonic: generateRandomMnemonicFn,
    generateFromEntropy
  };
}
