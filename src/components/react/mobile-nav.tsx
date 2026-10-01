import { useState, type MouseEvent, type ReactNode } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  currentSection: "tutorial" | "packages" | "integrations";
  tutorial?: ReactNode;
  packages?: ReactNode;
  integrations?: ReactNode;
}

export default function MobileNav({ currentSection, tutorial, packages, integrations }: Props) {
  const [open, setOpen] = useState(false);

  const closeOnNavigate = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="-ml-1 lg:hidden" aria-label="Open navigation" />}
      >
        <ListIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[21rem] max-w-[88vw] gap-0 p-0">
        <SheetHeader className="p-4 pb-3">
          <SheetTitle>
            <a href="/" className="font-bold tracking-tight">
              rhythm<span className="text-primary">js</span>
            </a>
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue={currentSection} className="min-h-0 flex-1 gap-0">
          <TabsList className="mx-4 w-auto">
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          {}
          <div className="drawer-nav min-h-0 flex-1 overflow-y-auto px-3 pt-4 pb-8" onClick={closeOnNavigate}>
            <TabsContent value="tutorial">{tutorial}</TabsContent>
            <TabsContent value="packages">{packages}</TabsContent>
            <TabsContent value="integrations">{integrations}</TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
