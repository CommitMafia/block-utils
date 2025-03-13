
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Key, RefreshCw, Copy, Download, ShieldCheck, HelpCircle, ListCheck, Lock } from 'lucide-react';
import { toast } from "sonner";
import { useBip39 } from '@/hooks/useBip39';

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
    derivedPrivateKey,
    derivedPublicKey,
    isValidMnemonic,
    generateFromEntropy
  } = useBip39();

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    toast.success("Mnemonic copied to clipboard");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const handleCopyPrivateKey = (privateKey: string) => {
    navigator.clipboard.writeText(privateKey);
    toast.success("Private key copied to clipboard");
  };

  const handleCopyPublicKey = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    toast.success("Public key copied to clipboard");
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

              <TabsContent value="generate" className="space-y-6">
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
                      onChange={(e) => setMnemonic(e.target.value)}
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-cyber-neon/70">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="cyber-card border-cyber-neon/50">
                          <DialogHeader>
                            <DialogTitle className="text-cyber-neon">BIP39 Passphrase</DialogTitle>
                            <DialogDescription className="text-cyber-neon/80">
                              The BIP39 passphrase adds an extra layer of security to your mnemonic. 
                              Even if someone gets your seed phrase, they can't access your wallet without knowing the passphrase.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
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
              </TabsContent>

              <TabsContent value="convert" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="entropy" className="text-cyber-neon">Entropy</Label>
                      <Select 
                        value={entropyType} 
                        onValueChange={setEntropyType}
                      >
                        <SelectTrigger className="w-[120px] cyber-input">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hex">Hexadecimal</SelectItem>
                          <SelectItem value="binary">Binary</SelectItem>
                          <SelectItem value="dice">Dice Rolls</SelectItem>
                          <SelectItem value="base6">Base 6</SelectItem>
                          <SelectItem value="cards">Playing Cards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea 
                      id="entropy"
                      className="cyber-input h-20 terminal-text"
                      value={entropy}
                      onChange={(e) => setEntropy(e.target.value)}
                      placeholder="Enter entropy value"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={generateFromEntropy}
                    >
                      <RefreshCw className="h-4 w-4" /> Convert
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-cyber-neon flex justify-between items-center">
                    <span>Derivation Path</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-cyber-neon/70">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="cyber-card border-cyber-neon/50">
                        <DialogHeader>
                          <DialogTitle className="text-cyber-neon">Derivation Path</DialogTitle>
                          <DialogDescription className="text-cyber-neon/80">
                            The derivation path determines which accounts are derived from your seed phrase.
                            Different paths are used for different cryptocurrencies and account types.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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
                      <div>Private Key</div>
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
                              <span className="text-cyber-neon/70 truncate">{item.privateKey}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 text-cyber-neon/70 shrink-0"
                                onClick={() => handleCopyPrivateKey(item.privateKey)}
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
