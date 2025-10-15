export const toCamelCase = (str: string) => {
    return str
        .split(/[_-]+/) // Split by hyphens or underscores
        .map((word, index) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter of subsequent words
        })
        .join('');
};
