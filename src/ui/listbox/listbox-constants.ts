/* Kept out of the component module on purpose: that module is 'use client',
   and a server component importing a value from one gets a client reference,
   not the value. Here, it stays a plain value on the server too. */

/** Item count above which `searchable="auto"` enables the search box. */
export const SEARCHABLE_AUTO_THRESHOLD = 6;
