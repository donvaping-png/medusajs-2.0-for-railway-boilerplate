# Guía de Estilos para Widgets de Medusa Admin

## 🎨 Sistema de Diseño de Medusa

Medusa Admin usa un sistema de diseño consistente basado en:
- **Colores**: Paleta de grises + color primario (violeta/púrpura)
- **Tipografía**: Inter font, tamaños consistentes
- **Espaciado**: Sistema de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48)
- **Bordes**: Radius de 6-8px, bordes sutiles
- **Sombras**: Sombras suaves para elevación

## 📐 Paleta de Colores

```typescript
const medusaColors = {
  // Grises (principal)
  gray: {
    0: "#FFFFFF",
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
  },
  
  // Primario (Violeta de Medusa)
  primary: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",  // Color principal
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
  },
  
  // Estados
  success: {
    50: "#F0FDF4",
    500: "#10B981",
    700: "#047857",
  },
  
  error: {
    50: "#FEF2F2",
    500: "#EF4444",
    700: "#B91C1C",
  },
  
  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
    700: "#B45309",
  },
  
  info: {
    50: "#EFF6FF",
    500: "#3B82F6",
    700: "#1D4ED8",
  },
}
```

## 🎯 Componentes Estándar

### Container Principal
```typescript
container: {
  backgroundColor: medusaColors.gray[0],
  border: `1px solid ${medusaColors.gray[200]}`,
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
}
```

### Header
```typescript
header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  backgroundColor: medusaColors.gray[50],
  borderBottom: `1px solid ${medusaColors.gray[200]}`,
}

title: {
  fontSize: "18px",
  fontWeight: "600",
  color: medusaColors.gray[900],
  margin: 0,
  letterSpacing: "-0.01em",
}

subtitle: {
  fontSize: "14px",
  color: medusaColors.gray[500],
  margin: "4px 0 0 0",
  fontWeight: "400",
}
```

### Botones

```typescript
// Botón Primario
primaryButton: {
  backgroundColor: medusaColors.primary[500],
  color: medusaColors.gray[0],
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  ":hover": {
    backgroundColor: medusaColors.primary[600],
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
}

// Botón Secundario
secondaryButton: {
  backgroundColor: medusaColors.gray[0],
  color: medusaColors.gray[700],
  border: `1px solid ${medusaColors.gray[300]}`,
  padding: "10px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: medusaColors.gray[50],
    borderColor: medusaColors.gray[400],
  },
}

// Botón de Peligro
dangerButton: {
  backgroundColor: medusaColors.error[500],
  color: medusaColors.gray[0],
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: medusaColors.error[700],
  },
}

// Botón Pequeño (Add)
addButton: {
  backgroundColor: medusaColors.gray[0],
  color: medusaColors.gray[700],
  border: `1px solid ${medusaColors.gray[300]}`,
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: medusaColors.gray[50],
  },
}
```

### Inputs y Selects

```typescript
input: {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${medusaColors.gray[300]}`,
  borderRadius: "8px",
  fontSize: "14px",
  color: medusaColors.gray[900],
  backgroundColor: medusaColors.gray[0],
  transition: "all 0.2s ease",
  ":focus": {
    outline: "none",
    borderColor: medusaColors.primary[500],
    boxShadow: `0 0 0 3px ${medusaColors.primary[50]}`,
  },
}

select: {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${medusaColors.gray[300]}`,
  borderRadius: "8px",
  fontSize: "14px",
  color: medusaColors.gray[900],
  backgroundColor: medusaColors.gray[0],
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":focus": {
    outline: "none",
    borderColor: medusaColors.primary[500],
    boxShadow: `0 0 0 3px ${medusaColors.primary[50]}`,
  },
}

label: {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: medusaColors.gray[700],
  marginBottom: "8px",
  letterSpacing: "-0.01em",
}

hint: {
  fontSize: "13px",
  color: medusaColors.gray[500],
  marginTop: "6px",
  lineHeight: "1.5",
}
```

### Secciones

```typescript
section: {
  padding: "20px 24px",
  borderBottom: `1px solid ${medusaColors.gray[100]}`,
}

sectionHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
}

sectionTitle: {
  fontSize: "15px",
  fontWeight: "600",
  color: medusaColors.gray[900],
  margin: 0,
}
```

### Checkboxes y Radio Buttons

```typescript
checkboxLabel: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px",
  border: `1px solid ${medusaColors.gray[200]}`,
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: medusaColors.gray[0],
  ":hover": {
    backgroundColor: medusaColors.gray[50],
    borderColor: medusaColors.gray[300],
  },
}

checkbox: {
  width: "18px",
  height: "18px",
  cursor: "pointer",
  accentColor: medusaColors.primary[500],
}
```

### Tablas y Listas

```typescript
table: {
  width: "100%",
  borderCollapse: "collapse",
}

tableHeader: {
  backgroundColor: medusaColors.gray[50],
  borderBottom: `2px solid ${medusaColors.gray[200]}`,
}

tableHeaderCell: {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: medusaColors.gray[700],
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}

tableRow: {
  borderBottom: `1px solid ${medusaColors.gray[100]}`,
  transition: "background-color 0.2s ease",
  ":hover": {
    backgroundColor: medusaColors.gray[50],
  },
}

tableCell: {
  padding: "12px 16px",
  fontSize: "14px",
  color: medusaColors.gray[900],
}
```

### Cards y Boxes

```typescript
card: {
  backgroundColor: medusaColors.gray[0],
  border: `1px solid ${medusaColors.gray[200]}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
}

infoBox: {
  backgroundColor: medusaColors.info[50],
  border: `1px solid ${medusaColors.info[200]}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
}

successBox: {
  backgroundColor: medusaColors.success[50],
  border: `1px solid ${medusaColors.success[200]}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
}

warningBox: {
  backgroundColor: medusaColors.warning[50],
  border: `1px solid ${medusaColors.warning[200]}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
}

errorBox: {
  backgroundColor: medusaColors.error[50],
  border: `1px solid ${medusaColors.error[200]}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
}
```

### Badges y Tags

```typescript
badge: {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "500",
  backgroundColor: medusaColors.gray[100],
  color: medusaColors.gray[700],
}

badgePrimary: {
  backgroundColor: medusaColors.primary[100],
  color: medusaColors.primary[700],
}

badgeSuccess: {
  backgroundColor: medusaColors.success[100],
  color: medusaColors.success[700],
}

badgeError: {
  backgroundColor: medusaColors.error[100],
  color: medusaColors.error[700],
}
```

## 🎭 Iconos

Medusa usa iconos de diferentes fuentes. Para widgets, puedes usar:
- **Emojis**: Simple y efectivo (🔷, ⚙️, 💾, ✕)
- **Unicode**: Símbolos especiales (→, ←, ↑, ↓, ✓, ✗)
- **SVG inline**: Para iconos más complejos

```typescript
// Ejemplo de icono SVG
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path 
      d="M13.3333 4L6 11.3333L2.66667 8" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)
```

## 📱 Responsive

```typescript
// Grid responsive
grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "12px",
}

// Flex responsive
flexRow: {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
}
```

## ✨ Animaciones y Transiciones

```typescript
transition: {
  transition: "all 0.2s ease",
}

transitionFast: {
  transition: "all 0.15s ease",
}

transitionSlow: {
  transition: "all 0.3s ease",
}
```

## 🎯 Ejemplo Completo de Widget

Ver archivo: `backend/src/admin/widgets/product-configurator-styled.tsx` (próximo a crear)

## 📚 Referencias

- Medusa Admin Dashboard: Inspeccionar elementos en el navegador
- Tailwind CSS: Sistema de colores y espaciado similar
- Radix UI: Componentes accesibles (base de Medusa UI)
