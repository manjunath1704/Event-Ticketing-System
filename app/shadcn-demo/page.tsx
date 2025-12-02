import { Button } from "@/components/ui/button"

export default function ShadcnDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-2xl p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              shadcn/ui is Ready! 🎉
            </h1>
            <p className="text-muted-foreground">
              Your Event Ticketing System now has shadcn/ui configured and ready to use.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Button Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Add more components with: <code className="bg-muted px-2 py-1 rounded">npx shadcn@latest add [component-name]</code></li>
              <li>Browse available components at <a href="https://ui.shadcn.com" className="text-primary hover:underline">ui.shadcn.com</a></li>
              <li>Customize your theme in <code className="bg-muted px-2 py-1 rounded">app/globals.css</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
