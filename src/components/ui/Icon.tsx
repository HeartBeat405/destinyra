import {
  Sprout,
  Gem,
  Heart,
  HeartHandshake,
  Briefcase,
  Hash,
  Layers,
  Feather,
  Moon,
  Brain,
  Zap,
  Orbit,
  Sparkles,
  Sun,
  Bot,
  BookOpen,
  Compass,
  // Admin icons
  LayoutDashboard,
  LayoutTemplate,
  FileText,
  FolderTree,
  Tag,
  Users,
  File,
  Image,
  Wrench,
  MessageSquare,
  Mail,
  UserCog,
  ShieldCheck,
  BarChart3,
  Search,
  Settings,
  ScrollText,
  CheckCircle2,
  Circle,
  Megaphone,
  Rocket,
  type LucideIcon,
} from "lucide-react";

// Explicit registry (tree-shakeable). DB/seed stores an icon NAME string;
// this resolves it to a premium SVG icon. Unknown names fall back to Sparkles.
const REGISTRY: Record<string, LucideIcon> = {
  Sprout,
  Gem,
  Heart,
  HeartHandshake,
  Briefcase,
  Hash,
  Layers,
  Feather,
  Moon,
  Brain,
  Zap,
  Orbit,
  Sparkles,
  Sun,
  Bot,
  BookOpen,
  Compass,
  LayoutDashboard,
  LayoutTemplate,
  FileText,
  FolderTree,
  Tag,
  Users,
  File,
  Image,
  Wrench,
  MessageSquare,
  Mail,
  UserCog,
  ShieldCheck,
  BarChart3,
  Search,
  Settings,
  ScrollText,
  CheckCircle2,
  Circle,
  Megaphone,
  Rocket,
};

type Props = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({ name, className, strokeWidth = 1.75 }: Props) {
  const Cmp = REGISTRY[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
