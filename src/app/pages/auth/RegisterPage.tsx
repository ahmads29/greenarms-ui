import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { getCountries, getCountryCallingCode, Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as Flags from 'country-flag-icons/react/3x2';

// Get all countries except Israel
const countries = getCountries().filter(country => country !== 'IL');

import { authApi } from "@/app/api";

export function RegisterPage() {
    const { login, registrationEmail, isEmailVerified, verificationToken } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [selectedCountry, setSelectedCountry] = useState<Country>("IT");
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");

    // Region names for display
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

    useEffect(() => {
        if (!registrationEmail) {
            navigate("/register-email");
        } else if (!isEmailVerified) {
            navigate("/verify-email");
        }
    }, [registrationEmail, isEmailVerified, navigate]);

    // Update full phone number when country or local number changes
    useEffect(() => {
        if (localPhoneNumber) {
            try {
                const callingCode = getCountryCallingCode(selectedCountry);
                setFormData(prev => ({ ...prev, phoneNumber: `+${callingCode}${localPhoneNumber}` }));
            } catch (e) {
                // Handle error if country code lookup fails
            }
        } else {
            setFormData(prev => ({ ...prev, phoneNumber: "" }));
        }
    }, [selectedCountry, localPhoneNumber]);

    const validatePassword = (pwd: string) => {
        const hasUpper = /[A-Z]/.test(pwd);
        const hasLower = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        const isLongEnough = pwd.length >= 8;
        return hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";

        if (!localPhoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must have at least 8 chars, incl. 1 upper, 1 lower, 1 number, 1 special";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        if (!verificationToken) {
          toast.error("Missing verification token. Please verify email again.");
          return;
        }

        const response = await authApi.registerUser({
          username: registrationEmail!, // Using email as username
          email: registrationEmail!,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          verification_token: verificationToken
        });

        toast.success("Account created successfully");
        
        // Login the user with the returned tokens
        login(response.access_token, { 
          email: registrationEmail!, 
          role: "viewer", // Default role
          canModify: false 
        });
        
        // Store refresh token if needed (handled in login or here)
        localStorage.setItem('refreshToken', response.refresh_token);

      } catch (err: any) {
        toast.error(err.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                                className={errors.firstName ? "border-destructive" : ""}
                            />
                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                                className={errors.lastName ? "border-destructive" : ""}
                            />
                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="w-[180px]">
                                <Select 
                                    value={selectedCountry} 
                                    onValueChange={(value: Country) => setSelectedCountry(value)}
                                >
                                    <SelectTrigger className={errors.phoneNumber ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => {
                                            const FlagComponent = Flags[country as keyof typeof Flags];
                                            const countryName = regionNames.of(country);
                                            return (
                                                <SelectItem key={country} value={country}>
                                                    <div className="flex items-center gap-2">
                                                        {FlagComponent && <FlagComponent className="w-5 h-4 rounded-sm shrink-0" />}
                                                        <span className="truncate">{countryName}</span>
                                                        <span className="text-muted-foreground ml-auto">+{getCountryCallingCode(country)}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                type="tel"
                                placeholder="Phone number"
                                value={localPhoneNumber}
                                onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                className={`flex-1 ${errors.phoneNumber ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                className={errors.password ? "border-destructive" : ""}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        <p className="text-xs text-muted-foreground">
                            Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                        </p>
                    </div>

                    <Button type="submit" className="w-full mt-4" style={{ backgroundColor: '#4f39f6', color: 'white' }}>
                        Complete Registration
                    </Button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="hover:underline font-medium"
                                style={{ color: '#4f39f6' }}
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
