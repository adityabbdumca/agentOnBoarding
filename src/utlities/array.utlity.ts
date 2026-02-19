// Add array utilities
 const checkOtpComplete = (otpArray:string[]|string) => {
    if (!Array.isArray(otpArray)) return false;
    return otpArray.every((digit) => digit && digit.trim() !== "");
  };
export { checkOtpComplete };
