import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"

export function getDefaultHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
    }
}

export function getDecodedToken() {
    const token = Cookies.get("token")
    let decoded

    if (token != undefined) {
        decoded = jwt_decode(token)
    }
    return decoded
}

export function getCurrentUser() {
    let currentUser
    const decoded = getDecodedToken()

    if (decoded != undefined) {
        currentUser = decoded.user
    }
    return currentUser
}

const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
}

export const formatDate = (d) => {
    d = new Date(d)
    return `${
    months[d.getMonth()]
  } ${d.getDate()}, ${d.getFullYear()}`
}

export const formatDateTime = (d) => {
    d = new Date(d)
    return `${
    months[d.getMonth()]
  } ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString()}`
}