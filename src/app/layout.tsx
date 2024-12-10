import type {Metadata} from "next";
import "./globals.css";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import React from "react";
import theme from "@/theme"
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: "Interview Queues",
    description: "Queues app for technical test",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={inter.className}
        >
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider theme={theme}>

                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
