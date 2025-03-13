
import { useState, useEffect, useCallback } from 'react';
import { useEntropyHandling } from './useEntropyHandling';
import { useAddressDerivation, DerivedAddress } from './useAddressDerivation';
import { validateMnemonic, mnemonicToSeed } from '@/lib/bip39Utils';

export interface Bip39HookReturn {
  mnemonic: string;
  setMnemonic: (value: string) => void;
  entropy: string;
  setEntropy: (value: string) => void;
  entropyType: string;
  setEntropyType: (value: string) => void;
  wordCount: number;
  setWordCount: (value: number) => void;
  passphrase: string;
  setPassphrase: (value: string) => void;
  derivationPath: string;
  setDerivationPath: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  derivedAddresses: DerivedAddress[];
  derivedPrivateKey: string;
  derivedPublicKey: string;
  generateRandomMnemonic: () => void;
  isValidMnemonic: boolean;
  generateFromEntropy: () => void;
}

export function useBip39(): Bip39HookReturn {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [isValidMnemonic, setIsValidMnemonic] = useState<boolean>(false);

  const { 
    entropy, 
    setEntropy, 
    entropyType, 
    setEntropyType, 
    wordCount, 
    setWordCount, 
    generateRandomMnemonic: genRandomMnemonic, 
    generateFromEntropy: genFromEntropy 
  } = useEntropyHandling();

  const {
    derivationPath,
    setDerivationPath,
    network,
    setNetwork,
    deriveAddresses,
    derivedAddresses,
    derivedPrivateKey,
    derivedPublicKey
  } = useAddressDerivation();

  // Validate mnemonic when it changes
  useEffect(() => {
    if (mnemonic.trim()) {
      setIsValidMnemonic(validateMnemonic(mnemonic));
    } else {
      setIsValidMnemonic(false);
    }
  }, [mnemonic]);

  // Generate addresses when mnemonic, passphrase, or derivation path changes
  useEffect(() => {
    if (isValidMnemonic && mnemonic) {
      const seed = mnemonicToSeed(mnemonic, passphrase);
      deriveAddresses(seed);
    }
  }, [mnemonic, passphrase, derivationPath, isValidMnemonic, network, deriveAddresses]);

  // Helper to generate a random mnemonic
  const generateRandomMnemonicHandler = useCallback(() => {
    const newMnemonic = genRandomMnemonic();
    setMnemonic(newMnemonic);
  }, [genRandomMnemonic]);

  // Helper to generate from entropy
  const generateFromEntropyHandler = useCallback(() => {
    const newMnemonic = genFromEntropy();
    if (newMnemonic) {
      setMnemonic(newMnemonic);
    }
  }, [genFromEntropy]);

  return {
    mnemonic,
    setMnemonic,
    entropy,
    setEntropy,
    entropyType,
    setEntropyType,
    wordCount,
    setWordCount,
    passphrase,
    setPassphrase,
    derivationPath,
    setDerivationPath,
    network,
    setNetwork,
    derivedAddresses,
    derivedPrivateKey,
    derivedPublicKey,
    generateRandomMnemonic: generateRandomMnemonicHandler,
    isValidMnemonic,
    generateFromEntropy: generateFromEntropyHandler
  };
}
