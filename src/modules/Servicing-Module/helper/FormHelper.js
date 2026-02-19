export const shouldShowOTPModal = (subRoute) => {
  const verticalId = localStorage.getItem("vertical_id");

  const parsedVerticalId = parseInt(verticalId, 10);
  const parsedSubRoute = parseInt(subRoute, 10);

  if (parsedVerticalId === 3) {
    return true; // Show OTP modal for all cases when verticalId is 3
  }
  if (parsedVerticalId === 4 && [2, 3].includes(parsedSubRoute)) {
    return true; // Show OTP modal when verticalId is 4 and subRoute is 2{email} or 3{mobile} 
  }
  return false; // Don't show OTP modal for other cases
};

export const showMobileAndEmailOtp=(subRoute)=>{
   const verticalId = +localStorage.getItem("vertical_id");

  const parsedSubRoute = parseInt(subRoute, 10);
  if ([3,4].includes(verticalId) && [2, 3].includes(parsedSubRoute)) {
    return true; // Show Mobile & Email OTP modal when fls/Agent Journey and subRoute is 2{email} or 3{mobile} 
  }
  return false; // Show Only Mobile Otp Option
}
