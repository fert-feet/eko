import { atom } from "jotai";
import { WidgetScreen } from "@/modules/widget/types";

// basic state atoms
export const screenAtom = atom<WidgetScreen>("auth")

export const errorMessageAtom = atom<string | null>(null)