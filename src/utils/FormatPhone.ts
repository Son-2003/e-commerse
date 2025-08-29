export const formatPhone = (input: string) => {
  let digits = input.replace(/\D/g, "");

  if (digits.length > 11) {
    digits = digits.slice(0, 11);
  }

  if (digits.length > 4 && digits.length <= 7) {
    return digits.replace(/(\d{4})(\d{1,3})/, "$1-$2");
  } else if (digits.length > 7) {
    return digits.replace(/(\d{4})(\d{3})(\d{1,3})/, "$1-$2-$3");
  } else {
    return digits;
  }
};

export const unFormatPhone = (input: string) => {
  return input.replace(/\D/g, "");
};

export const isValidPhone = (phone: string) => {
 const digits = phone.replace(/\D/g, "");
 
 if (digits.length < 10 || digits.length > 11) {
   return false;
 }
 
 const vnPhoneRegex = [
   /^(03[2-9]|05[689]|07[06-9]|08[1-689]|09[0-46-9])\d{7}$/,
   /^(016[2-9]|018[0-9]|019[0-9])\d{7}$/,
   /^(02[0-9])\d{8}$/
 ];
 
 return vnPhoneRegex.some(regex => regex.test(digits));
};

export const isValidEmail = (email: string) => {
  if (!email) return false;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return emailRegex.test(email.trim());
};
