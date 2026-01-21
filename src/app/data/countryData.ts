export interface Country {
    name: string;
    code: string;
    flag: string;
    dialCode: string;
}

export const countryData: Country[] = [
    { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
    { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
    { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
    { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
    { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
    { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
    { name: "China", code: "CN", flag: "🇨🇳", dialCode: "+86" },
    { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
    { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
    { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52" },
    { name: "Russia", code: "RU", flag: "🇷🇺", dialCode: "+7" },
    { name: "South Korea", code: "KR", flag: "🇰🇷", dialCode: "+82" },
    { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39" },
    { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34" },
    { name: "Netherlands", code: "NL", flag: "🇳🇱", dialCode: "+31" },
    { name: "Turkey", code: "TR", flag: "🇹🇷", dialCode: "+90" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", dialCode: "+966" },
    { name: "Switzerland", code: "CH", flag: "🇨🇭", dialCode: "+41" },
    { name: "Sweden", code: "SE", flag: "🇸🇪", dialCode: "+46" },
    { name: "UAE", code: "AE", flag: "🇦🇪", dialCode: "+971" },
    // Add more as needed
];
