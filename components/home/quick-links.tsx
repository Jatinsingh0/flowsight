import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Users, CreditCard, Activity } from "lucide-react";

const quickLinks = [
  {
    icon: LayoutDashboard,
    label: "View full dashboard",
    href: "/dashboard",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Users,
    label: "View users",
    href: "/dashboard/users",
    color: "text-accent2",
    bgColor: "bg-accent2/10",
    borderColor: "border-accent2/20",
  },
  {
    icon: CreditCard,
    label: "View subscriptions",
    href: "/dashboard/subscriptions",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Activity,
    label: "View activity",
    href: "/dashboard/activity",
    color: "text-accent2",
    bgColor: "bg-accent2/10",
    borderColor: "border-accent2/20",
  },
];

export function QuickLinks() {
  return (
    <section className="border-b border-borderSubtle bg-background py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={index} href={link.href}>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-borderSubtle bg-card/50 hover:bg-card hover:border-accent/30 transition-all duration-300 px-6"
                >
                  <div className={`mr-3 flex h-7 w-7 items-center justify-center rounded-md border ${link.borderColor} ${link.bgColor}`}>
                    <Icon className={`h-4 w-4 ${link.color} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <span className="text-sm font-medium text-textBase">{link.label}</span>
                  <ArrowRight className="ml-3 h-4 w-4 text-textMuted transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

