import type { Metadata } from "next";
import CodeViewer from "./CodeViewer";

export const metadata: Metadata = {
  title: "Code — Doctor Master",
  description: "See any web page next to its HTML source.",
};

export default function CodePage() {
  return <CodeViewer />;
}
