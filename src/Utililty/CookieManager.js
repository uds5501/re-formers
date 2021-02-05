import Cookies from 'universal-cookie';
const cookies = new Cookies();

// for authentication persistance
export const SetCookie = (userData) => {
    const option = {maxAge: 3600};
    for(const [key, value] of Object.entries(userData)) {
        cookies.set(key, value, option);
    };
}

export const DeleteCookie = (fields) => {
    fields.forEach((field) => {
        cookies.remove(field);
    });
}

export const hasCookie = () => {
    const obj = {
        entryToken: cookies.get('entryToken') || '-1'
    };
    return obj;
}
