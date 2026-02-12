"use client";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { EDITOR_UIDS } from "@/lib/config";

export function useEditorGate() {
  useEffect(() => {
    // DEV BYPASS: Check if we are in dev mode and have the bypass token
    if (process.env.NODE_ENV === 'development') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies['journal_token'] === 'dev-token-bypass') {
        console.log('🚧 Dev Bypass Active: Skipping Auth Check');
        return; // Allow access
      }
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || !EDITOR_UIDS.has(u.uid)) {
        location.href = "/login";
      }
    });
    return () => unsub();
  }, []);
}
