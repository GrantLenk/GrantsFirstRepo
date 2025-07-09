import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  userReward: number;
  isAdCompleted: boolean;
}

export default function WalletConnect({ userReward, isAdCompleted }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected your crypto wallet",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const claimReward = async () => {
    if (!walletAddress || !isAdCompleted) return;

    toast({
      title: "Reward Claimed",
      description: `$${userReward.toFixed(4)} has been sent to your wallet`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Crypto Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!walletAddress ? (
          <div className="text-center space-y-3">
            <div className="text-sm text-gray-600">
              Connect your wallet to receive ad rewards
            </div>
            <Button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Connected:</div>
              <Badge variant="outline" className="text-green-600">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm font-mono">
                {formatAddress(walletAddress)}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Your Reward:</span>
                <span className="font-bold text-green-600">
                  ${userReward.toFixed(4)}
                </span>
              </div>
              
              <Button
                onClick={claimReward}
                disabled={!isAdCompleted || userReward <= 0}
                className="w-full"
                size="sm"
              >
                {isAdCompleted ? 'Claim Reward' : 'Watch Ad to Claim'}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="w-full"
              size="sm"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}