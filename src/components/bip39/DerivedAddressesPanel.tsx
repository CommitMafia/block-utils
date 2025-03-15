
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy } from 'lucide-react';
import { toast } from "sonner";
import { DerivedAddress } from '@/hooks/useAddressDerivation';
import InfoDialog from './InfoDialog';
import { privateKeyToWIF } from '@/lib/crypto/bitcoinUtils';

interface DerivedAddressesPanelProps {
  derivationPath: string;
  setDerivationPath: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  derivedAddresses: DerivedAddress[];
  isValidMnemonic: boolean;
  mnemonic: string;
}

const DerivedAddressesPanel: React.FC<DerivedAddressesPanelProps> = ({
  derivationPath,
  setDerivationPath,
  network,
  setNetwork,
  derivedAddresses,
  isValidMnemonic,
  mnemonic
}) => {
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const handleCopyPrivateKey = (privateKey: string, isBitcoin = false) => {
    // For Bitcoin, convert to WIF format before copying
    const textToCopy = isBitcoin ? privateKeyToWIF(privateKey) : privateKey;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`${isBitcoin ? "WIF private key" : "Private key"} copied to clipboard`);
  };

  const handleCopyPublicKey = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    toast.success("Public key copied to clipboard");
  };

  const formatPrivateKey = (privateKey: string, network: string): string => {
    if (network === 'bitcoin') {
      return privateKeyToWIF(privateKey);
    }
    return privateKey;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-cyber-neon flex justify-between items-center">
          <span>Derivation Path</span>
          <InfoDialog
            title="Derivation Path"
            description="The derivation path determines which accounts are derived from your seed phrase.
            Different paths are used for different cryptocurrencies and account types."
          />
        </Label>
        <div className="flex gap-2">
          <Select
            value={network}
            onValueChange={setNetwork}
          >
            <SelectTrigger className="cyber-input">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bip44">BIP44 - General</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="litecoin">Litecoin</SelectItem>
              <SelectItem value="dogecoin">Dogecoin</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="cyber-input terminal-text"
            value={derivationPath}
            onChange={(e) => setDerivationPath(e.target.value)}
            placeholder="m/44'/0'/0'/0/0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-cyber-neon">Derived Addresses</Label>
          <Button variant="outline" size="sm" className="gap-1" disabled={!isValidMnemonic || !mnemonic}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
        
        <div className="border border-cyber-neon/30 rounded-md overflow-hidden">
          <div className="bg-background/50 p-2 text-xs text-cyber-neon grid grid-cols-4 gap-2 font-mono">
            <div>Path</div>
            <div>Address</div>
            <div>Public Key</div>
            <div>Private Key {network === 'bitcoin' && '(WIF)'}</div>
          </div>
          <div className="overflow-y-auto max-h-64">
            {derivedAddresses.length > 0 ? (
              derivedAddresses.map((item, index) => (
                <div 
                  key={index} 
                  className="p-2 text-xs grid grid-cols-4 gap-2 font-mono border-t border-cyber-neon/20 hover:bg-background/30"
                >
                  <div className="text-cyber-neon/70 truncate">{item.path}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-cyber-neon truncate">{item.address}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-cyber-neon/70 shrink-0"
                      onClick={() => handleCopyAddress(item.address)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cyber-neon/70 truncate">{item.publicKey}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-cyber-neon/70 shrink-0"
                      onClick={() => handleCopyPublicKey(item.publicKey)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-cyber-neon/70 truncate">
                      {network === 'bitcoin' ? formatPrivateKey(item.privateKey, network) : item.privateKey}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-cyber-neon/70 shrink-0"
                      onClick={() => handleCopyPrivateKey(item.privateKey, network === 'bitcoin')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-cyber-neon/50 text-center text-sm">
                {!mnemonic ? (
                  <span>Generate or enter a mnemonic to see derived addresses</span>
                ) : !isValidMnemonic ? (
                  <span>Please enter a valid mnemonic phrase</span>
                ) : (
                  <span>No addresses generated yet</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DerivedAddressesPanel;
