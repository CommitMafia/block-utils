
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import InfoDialog from './InfoDialog';

interface MnemonicGeneratorProps {
  mnemonic: string;
  setMnemonic: (value: string) => void;
  wordCount: number;
  setWordCount: (value: number) => void;
  passphrase: string;
  setPassphrase: (value: string) => void;
  isValidMnemonic: boolean;
  generateRandomMnemonic: () => void;
}

const MnemonicGenerator: React.FC<MnemonicGeneratorProps> = ({
  mnemonic,
  setMnemonic,
  wordCount,
  setWordCount,
  passphrase,
  setPassphrase,
  isValidMnemonic,
  generateRandomMnemonic
}) => {
  // Update word count when mnemonic changes
  useEffect(() => {
    if (mnemonic) {
      const words = mnemonic.trim().split(/\s+/);
      const count = words.length;
      
      // Check if the count is one of the supported word counts
      if ([12, 15, 18, 21, 24].includes(count) && count !== wordCount) {
        setWordCount(count);
      }
    }
  }, [mnemonic, wordCount, setWordCount]);

  const handleMnemonicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMnemonic(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="wordCount" className="text-cyber-neon">Word Count: {wordCount}</Label>
            <Select
              value={wordCount.toString()}
              onValueChange={(value) => setWordCount(parseInt(value))}
            >
              <SelectTrigger className="w-[120px] cyber-input">
                <SelectValue placeholder="Word Count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 words</SelectItem>
                <SelectItem value="15">15 words</SelectItem>
                <SelectItem value="18">18 words</SelectItem>
                <SelectItem value="21">21 words</SelectItem>
                <SelectItem value="24">24 words</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="mnemonic" className="text-cyber-neon">Mnemonic</Label>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={generateRandomMnemonic}
            >
              <RefreshCw className="h-3 w-3" /> Generate New
            </Button>
          </div>
          <Textarea
            id="mnemonic"
            className={`cyber-input h-20 terminal-text ${!isValidMnemonic && mnemonic ? 'border-red-500' : ''}`}
            value={mnemonic}
            onChange={handleMnemonicChange}
            placeholder="Enter mnemonic seed phrase"
          />
          {!isValidMnemonic && mnemonic && (
            <p className="text-red-500 text-xs mt-1">Invalid mnemonic phrase</p>
          )}
          {isValidMnemonic && mnemonic && (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Valid mnemonic phrase
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passphrase" className="text-cyber-neon flex justify-between items-center">
            <span>BIP39 Passphrase (optional)</span>
            <InfoDialog
              title="BIP39 Passphrase"
              description="The BIP39 passphrase adds an extra layer of security to your mnemonic. 
              Even if someone gets your seed phrase, they can't access your wallet without knowing the passphrase."
            />
          </Label>
          <Input
            id="passphrase"
            className="cyber-input terminal-text"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Enter extra passphrase (optional)"
          />
        </div>
      </div>
    </div>
  );
};

export default MnemonicGenerator;
