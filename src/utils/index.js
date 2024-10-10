export * from "./router.jsx";
import { createContext } from "react";

export const DialogContext = createContext(null);
export * from './api.js'


export const readFile = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => resolve(reader.result)
    });
};