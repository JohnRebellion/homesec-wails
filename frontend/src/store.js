import { writable } from "svelte/store"

export const defaultHeaders = writable(0)

export function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  }
}
