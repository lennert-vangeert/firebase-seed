import { Card, Modal, createTheme, type MantineColorsTuple } from "@mantine/core";

// Brand accent — emerald (Tailwind emerald 50→900). Drives primaryColor + the
// "from" end of the signature gradient.
const brand: MantineColorsTuple = [
  "#ecfdf5",
  "#d1fae5",
  "#a7f3d0",
  "#6ee7b7",
  "#34d399",
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
  "#064e3b",
];

// Secondary accent — cyan (Tailwind cyan 50→900). The "to" end of the gradient.
const accent: MantineColorsTuple = [
  "#ecfeff",
  "#cffafe",
  "#a5f3fc",
  "#67e8f9",
  "#22d3ee",
  "#06b6d4",
  "#0891b2",
  "#0e7490",
  "#155e75",
  "#164e63",
];

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 5 },
  autoContrast: true, // readable text on gradient/filled surfaces
  defaultRadius: "lg", // bold/vibrant -> 16px rounding
  cursorType: "pointer",
  colors: { brand, accent },

  // Signature emerald -> cyan gradient. Used by every <... variant="gradient" />.
  defaultGradient: { from: "#10b981", to: "#06b6d4", deg: 45 },

  fontFamily:
    "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMonospace:
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",

  headings: {
    fontFamily: "'Sora Variable', Sora, system-ui, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2.625rem", lineHeight: "1.15" },
      h2: { fontSize: "2rem", lineHeight: "1.2" },
      h3: { fontSize: "1.5rem", lineHeight: "1.25" },
      h4: { fontSize: "1.25rem", lineHeight: "1.3" },
      h5: { fontSize: "1.125rem", lineHeight: "1.4" },
      h6: { fontSize: "1rem", lineHeight: "1.4" },
    },
  },

  components: {
    Card: Card.extend({ defaultProps: { withBorder: true } }),
    Modal: Modal.extend({ defaultProps: { centered: true } }),
  },
});
