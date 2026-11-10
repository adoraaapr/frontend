export function formatRupees(paise:string|number){return `₹${(Number(paise)/100).toLocaleString('en-IN',{maximumFractionDigits:2})}`;}
