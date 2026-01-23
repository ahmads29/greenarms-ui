import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

export function VerifyEmailPage() {
    const { registrationEmail, setIsEmailVerified } = useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!registrationEmail) {
            navigate("/register-email");
        }
    }, [registrationEmail, navigate]);

    const handleVerified = async () => {
        setIsLoading(true);
        try {
            // Mock verification success
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsEmailVerified(true);
            toast.success("Email verified successfully");
            navigate("/register");
        } catch (err) {
            toast.error("Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Resending email...',
                success: 'Verification email resent!',
                error: 'Failed to resend email',
            }
        );
    };

    if (!registrationEmail) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-border p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <MailCheck className="w-8 h-8" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
                
                <p className="text-muted-foreground mb-6">
                    We sent a verification email to <br />
                    <span className="font-medium text-foreground">{registrationEmail}</span>
                </p>

                <p className="text-sm text-muted-foreground mb-8">
                    Please check your inbox and verify your email to continue.
                </p>

                <div className="space-y-4">
                    <Button 
                        onClick={handleVerified}
                        className="w-full" 
                        style={{ backgroundColor: '#4f39f6', color: 'white' }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "I have verified"}
                    </Button>

                    <Button 
                        variant="ghost" 
                        onClick={handleResend}
                        className="w-full"
                    >
                        Resend email
                    </Button>
                </div>
            </div>
        </div>
    );
}
