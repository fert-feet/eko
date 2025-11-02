import { atom } from "jotai";
import { WidgetScreen } from "@/modules/widget/types";

// basic state atoms
export const screenAtom = atom<WidgetScreen>("loading")
export const organizationIdAtom = atom<string | null>(null)

export const errorMessageAtom = atom<string | null>(null)
export const loadingMessageAtom = atom<string | null>(null)