export const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison
    return date < today;
};
