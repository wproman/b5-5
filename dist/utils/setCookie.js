"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHelper = exports.clearAuthCookies = exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
};
exports.setAuthCookie = setAuthCookie;
const clearAuthCookies = (res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
};
exports.clearAuthCookies = clearAuthCookies;
exports.CookieHelper = {
    setAuthCookie: exports.setAuthCookie,
    clearAuthCookies: exports.clearAuthCookies,
};
