# shadcn/ui Setup Guide

## ✅ Installation Complete!

shadcn/ui has been successfully configured in your Event Ticketing System project.

## 📦 What Was Installed

### Dependencies
- **class-variance-authority** - For creating component variants
- **clsx** - For conditional className composition
- **tailwind-merge** - For merging Tailwind CSS classes
- **lucide-react** - Icon library used by shadcn/ui
- **tailwindcss-animate** - Animation utilities for Tailwind
- **@radix-ui/react-slot** - Primitive for composable components

### Configuration Files
- ✅ `components.json` - shadcn/ui configuration
- ✅ `lib/utils.ts` - Utility functions (cn helper)
- ✅ `tailwind.config.js` - Updated with shadcn/ui theme
- ✅ `app/globals.css` - Updated with CSS variables for theming

### Components
- ✅ `components/ui/button.tsx` - Button component (example)

## 🚀 Quick Start

### Adding New Components

To add any shadcn/ui component, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

**Popular components:**
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add select
npx shadcn@latest add calendar
npx shadcn@latest add badge
```

### Using Components

```tsx
import { Button } from "@/components/ui/button"

export default function MyPage() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}
```

## 🎨 Theming

### Color Customization

Edit `app/globals.css` to customize your color palette:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Your primary brand color */
  --secondary: 210 40% 96.1%;    /* Secondary color */
  /* ... other colors */
}
```

Colors use HSL format: `hue saturation% lightness%`

### Dark Mode

Dark mode is configured and ready to use. Add the `dark` class to your `<html>` element to enable it:

```tsx
<html className="dark">
```

## 📚 Resources

- **Component Library**: [ui.shadcn.com](https://ui.shadcn.com)
- **Documentation**: [ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- **Examples**: [ui.shadcn.com/examples](https://ui.shadcn.com/examples)

## 🎯 Demo Page

Visit `/shadcn-demo` to see the button component in action with all variants and sizes.

## 💡 Tips

1. **Component Customization**: All components are copied to your project, so you can modify them freely
2. **Icons**: Use `lucide-react` for icons: `import { Icon } from "lucide-react"`
3. **Utility Function**: Use `cn()` from `@/lib/utils` to merge className props
4. **Type Safety**: All components are fully typed with TypeScript

## 🔧 Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Restart the dev server: `npm run dev`

## 📝 Example: Building a Card

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EventCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Name</CardTitle>
        <CardDescription>Event description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Event details and information</p>
      </CardContent>
      <CardFooter>
        <Button>Book Ticket</Button>
      </CardFooter>
    </Card>
  )
}
```

First, add the card component:
```bash
npx shadcn@latest add card
```

---

**Happy coding! 🎉**
