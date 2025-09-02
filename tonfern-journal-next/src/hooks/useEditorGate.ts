"use client";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { EDITOR_UIDS } from "@/lib/config";

export function useEditorGate() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || !EDITOR_UIDS.has(u.uid)) {
        location.href = "/login";
      }
    });
    return () => unsub();
  }, []);
}
