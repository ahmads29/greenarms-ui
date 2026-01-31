import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/app/api";

export function LoginPage() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors: { username?: string; password?: string } = {};
        if (!username) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                // Call real Login API
                const response = await authApi.login({ username, password });

                // Mock user data since API only returns tokens for now
                const mockUser = {
                    username: username,
                    email: "admin@greenarms.com",
                    role: "admin",
                    canModify: true
                };

                toast.success("Logged in successfully");
                // Pass access token and mock user to context
                login(response.access, mockUser);
            } catch (error: any) {
                console.error("Login error:", error);
                toast.error(error.message || "An error occurred during login. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-border p-8">
                <div className="text-center mb-8">
                    {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-primary mb-4">
                        <Github className="w-8 h-8" />
                    </div> */}
                    <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            className={errors.username ? "border-destructive" : ""}
                            disabled={isLoading}
                        />
                        {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className={errors.password ? "border-destructive" : ""}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="remember" 
                            checked={rememberMe} 
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                        >
                            Remember me
                        </label>
                    </div>

                    <Button onClick={handleSubmit} type="submit" className="w-full" style={{ backgroundColor: '#4f39f6', color: 'white' }}>
                        Sign In
                    </Button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register-email")}
                                className="hover:underline font-medium"
                                style={{ color: '#4f39f6' }}
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
