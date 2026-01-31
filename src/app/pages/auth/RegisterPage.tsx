import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authApi } from "@/app/api";

export function RegisterPage() {
    const { login, registrationEmail, isEmailVerified, verificationToken } = useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!registrationEmail) {
            navigate("/register-email");
        } else if (!isEmailVerified) {
            navigate("/verify-email");
        }
    }, [registrationEmail, isEmailVerified, navigate]);

    const validatePassword = (pwd: string) => {
        // At least 8 chars, 1 upper, 1 lower, 1 number, 1 special
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        const isLongEnough = pwd.length >= 8;
        return hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must have at least 8 chars, incl. 1 upper, 1 lower, 1 number, 1 special";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validate()) return;

        setIsLoading(true);
        try {
            if (!verificationToken) {
                toast.error("Missing verification token. Please verify email again.");
                return;
            }

            const response = await authApi.registerUser({
                username: formData.username,
                email: registrationEmail!,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                verification_token: verificationToken
            });

            toast.success("Account created successfully");
            
            // Login the user with the returned tokens
            login(response.access, { 
                email: registrationEmail!, 
                username: formData.username,
                role: "viewer", // Default role
                canModify: false 
            });
            
            // Store refresh token
            if (response.refresh) {
                localStorage.setItem('refreshToken', response.refresh);
            }

            // Redirect handled by login function (sets currentPage to dashboard) or manually if needed
            // AppContext.login sets currentPage="dashboard", but we might need to navigate if using Router
            navigate("/"); // Assuming dashboard is at root or handled by router based on auth state

        } catch (err: any) {
            if (err.message && (err.message.includes("Validation") || err.message.includes("Token"))) {
                 toast.error(err.message);
            } else {
                 toast.error("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!registrationEmail || !isEmailVerified) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-border p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-primary mb-4">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Complete Registration</h1>
                    <p className="text-muted-foreground mt-2">Set up your profile details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            value={registrationEmail}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className={errors.firstName ? "border-destructive" : ""}
                                placeholder="John"
                            />
                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className={errors.lastName ? "border-destructive" : ""}
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className={errors.username ? "border-destructive" : ""}
                            placeholder="johndoe"
                        />
                        {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                                placeholder="••••••••"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                                placeholder="••••••••"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                        style={{ backgroundColor: '#4f39f6', color: 'white' }}
                    >
                        {isLoading ? "Creating Account..." : "Complete Registration"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
