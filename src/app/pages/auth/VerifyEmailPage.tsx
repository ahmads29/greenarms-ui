import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/app/components/ui/input-otp";
import { authApi } from "@/app/api";

export function VerifyEmailPage() {
    const { registrationEmail, setIsEmailVerified, setVerificationToken } = useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (!registrationEmail) {
            navigate("/register-email");
        }
    }, [registrationEmail, navigate]);

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.verifyOtp(registrationEmail!, otp);
            
            setVerificationToken(response.verification_token);
            setIsEmailVerified(true);
            toast.success("Email verified successfully");
            navigate("/register");
        } catch (err: any) {
            toast.error(err.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!registrationEmail) return;
        
        try {
            await authApi.sendOtp(registrationEmail);
            toast.success("OTP resent successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to resend OTP");
        }
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
                    We sent a verification code to <br />
                    <span className="font-medium text-foreground">{registrationEmail}</span>
                </p>

                <div className="flex justify-center mb-8">
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="space-y-4">
                    <Button 
                        onClick={handleVerifyOtp}
                        className="w-full" 
                        style={{ backgroundColor: '#4f39f6', color: 'white' }}
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <Button 
                        variant="ghost" 
                        onClick={handleResend}
                        className="w-full"
                    >
                        Resend code
                    </Button>
                </div>
            </div>
        </div>
    );
}
