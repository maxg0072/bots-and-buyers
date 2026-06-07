import type { Metadata } from "next";
import { Millionaire } from "@/components/quiz/millionaire";

export const metadata: Metadata = { title: "Wer wird Millionär" };

export default function MillionairePage() {
  return <Millionaire />;
}
