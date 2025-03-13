
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface InfoDialogProps {
  title: string;
  description: React.ReactNode;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ title, description }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-cyber-neon/70">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="cyber-card border-cyber-neon/50">
        <DialogHeader>
          <DialogTitle className="text-cyber-neon">{title}</DialogTitle>
          <DialogDescription className="text-cyber-neon/80">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
