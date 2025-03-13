
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Key, Lock, HelpCircle } from 'lucide-react';
import { toast } from "sonner";
import { useBip39 } from '@/hooks/useBip39';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Import our new components
import MnemonicGenerator from '@/components/bip39/MnemonicGenerator';
import EntropyConverter from '@/components/bip39/EntropyConverter';
import DerivedAddressesPanel from '@/components/bip39/DerivedAddressesPanel';

const Bip39Utility: React.FC = () => {
  const { 
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
    generateRandomMnemonic,
    isValidMnemonic,
    generateFromEntropy
  } = useBip39();

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Mnemonic copied to clipboard");
  };

  return (
    <MainLayout showBackButton={true}>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <Card className="cyber-card border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-cyber-neon flex items-center gap-2">
                  <Key className="h-6 w-6" /> BIP39 Mnemonic Generator
                </CardTitle>
                <CardDescription className="text-cyber-neon/70">
                  Generate and validate BIP39 mnemonic seed phrases for wallet creation
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-cyber-neon">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="cyber-card border-cyber-neon/50 shadow-[0_0_10px_rgba(15,255,80,0.3)]">
                  <DialogHeader>
                    <DialogTitle className="text-cyber-neon">About BIP39</DialogTitle>
                    <DialogDescription className="text-cyber-neon/80">
                      BIP39 defines the implementation of a mnemonic code or mnemonic sentence – a group of easy to remember words – for the generation of deterministic wallets. 
                      <br /><br />
                      These seed phrases allow users to easily backup and restore their cryptocurrency wallets.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="generate" className="space-y-6">
              <TabsList className="grid grid-cols-2 gap-2 bg-background/50">
                <TabsTrigger value="generate" className="data-[state=active]:text-cyber-neon data-[state=active]:bg-muted">Generate New Mnemonic</TabsTrigger>
                <TabsTrigger value="convert" className="data-[state=active]:text-cyber-neon data-[state=active]:bg-muted">Convert From Entropy</TabsTrigger>
              </TabsList>

              <TabsContent value="generate">
                <MnemonicGenerator 
                  mnemonic={mnemonic}
                  setMnemonic={setMnemonic}
                  wordCount={wordCount}
                  setWordCount={setWordCount}
                  passphrase={passphrase}
                  setPassphrase={setPassphrase}
                  isValidMnemonic={isValidMnemonic}
                  generateRandomMnemonic={generateRandomMnemonic}
                />
              </TabsContent>

              <TabsContent value="convert">
                <EntropyConverter 
                  entropy={entropy}
                  setEntropy={setEntropy}
                  entropyType={entropyType}
                  setEntropyType={setEntropyType}
                  generateFromEntropy={generateFromEntropy}
                />
              </TabsContent>

              <div className="mt-6">
                <DerivedAddressesPanel 
                  derivationPath={derivationPath}
                  setDerivationPath={setDerivationPath}
                  network={network}
                  setNetwork={setNetwork}
                  derivedAddresses={derivedAddresses}
                  isValidMnemonic={isValidMnemonic}
                  mnemonic={mnemonic}
                />
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t border-cyber-neon/20 flex justify-between">
            <div className="flex items-center gap-2 text-xs text-cyber-neon/70">
              <Lock className="h-4 w-4" /> 
              <span>All computation is done locally in your browser</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={handleCopyMnemonic}
              disabled={!mnemonic || !isValidMnemonic}
            >
              <Copy className="h-4 w-4" /> Copy Mnemonic
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Bip39Utility;
