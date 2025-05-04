import { writable } from "svelte/store";

console.log("CommandPaletteStore initialized");
export const showSearch = writable(false); 