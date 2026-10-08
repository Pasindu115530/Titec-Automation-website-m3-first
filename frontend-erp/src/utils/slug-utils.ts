export const createSlug = (name: string, id: string | number): string => {
    const slugName = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '');   // Trim leading/trailing hyphens

    return `${slugName}-${id}`;
};

export const extractIdFromSlug = (slug: string): string => {
    // Splits by hyphen and takes the last part
    const parts = slug.split('-');
    return parts[parts.length - 1];
};
