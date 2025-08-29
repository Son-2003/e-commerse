export const formatAddressPart = (addr?: string | null) => {
  const safe = (addr ?? "").toString();
  const parts = safe.split("//");
  return parts[0] + ", " + parts[1];
};
