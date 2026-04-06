import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Target,
  Handshake,
  Calendar,
  type LucideIcon
} from "lucide-react"
import { FlippingCard } from "@/components/ui/flipping-card"

interface CardData {
  id: string;
  icon: LucideIcon;
  front: {
    title: string;
    description: string;
  };
  back: {
    description: string;
    benefits: string[];
  };
}

const cardsData: CardData[] = [
  {
    id: "investor-tracking",
    icon: Users,
    front: {
      title: "Investor Tracking",
      description: "Track every investor from lead to closing with complete visibility.",
    },
    back: {
      description: "Manage your entire investor pipeline with clarity and structure.",
      benefits: [
        "Track investor status and history",
        "Organize contact information",
        "Monitor engagement levels"
      ],
    },
  },
  {
    id: "outreach-performance",
    icon: BarChart3,
    front: {
      title: "Outreach Analytics",
      description: "Measure performance by platform and conversion rates.",
    },
    back: {
      description: "Data-driven insights to optimize your fundraising strategy.",
      benefits: [
        "Platform performance metrics",
        "Conversion rate tracking",
        "Source attribution analysis"
      ],
    },
  },
  {
    id: "deal-pipeline",
    icon: TrendingUp,
    front: {
      title: "Deal Pipeline",
      description: "Visualize progress through every stage of the fundraising journey.",
    },
    back: {
      description: "Clear visibility from first contact to closing the deal.",
      benefits: [
        "Visual pipeline stages",
        "Deal value tracking",
        "Progress monitoring"
      ],
    },
  },
  {
    id: "meeting-management",
    icon: Calendar,
    front: {
      title: "Meeting Management",
      description: "Log interactions and track outcomes systematically.",
    },
    back: {
      description: "Never miss a detail with structured meeting tracking.",
      benefits: [
        "Schedule and log meetings",
        "Track outcomes and next steps",
        "Centralized interaction history"
      ],
    },
  },
  {
    id: "deal-tracking",
    icon: Handshake,
    front: {
      title: "Deal Tracking",
      description: "Monitor investment amounts, valuations, and equity terms.",
    },
    back: {
      description: "Complete visibility into every aspect of your deals.",
      benefits: [
        "Track investment amounts",
        "Monitor valuations",
        "Manage equity negotiations"
      ],
    },
  },
  {
    id: "focused-outreach",
    icon: Target,
    front: {
      title: "Focused Outreach",
      description: "Know exactly where to focus your efforts for maximum results.",
    },
    back: {
      description: "Identify which channels and investors are worth your time.",
      benefits: [
        "Channel effectiveness insights",
        "Investor engagement scoring",
        "ROI on outreach efforts"
      ],
    },
  },
]


interface CardFrontProps {
  data: CardData["front"];
  icon: LucideIcon;
}

function CardFront({ data, icon: Icon }: CardFrontProps) {
  return (
    <div className="flex flex-col h-full w-full p-4 justify-center items-center text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg
        bg-gradient-to-br from-[#00688b] to-[#005570] dark:from-[#00688b] dark:to-[#00344a]
        shadow-lg shadow-[#00688b]/30 mb-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        {data.title}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {data.description}
      </p>
      <div className="mt-3 text-[10px] text-gray-500 dark:text-gray-500">
        Hover to learn more
      </div>
    </div>
  );
}

interface CardBackProps {
  data: CardData["back"];
}

function CardBack({ data }: CardBackProps) {
  return (
    <div className="flex flex-col h-full w-full p-4 justify-center">
      <p className="text-xs text-gray-700 dark:text-gray-300 mb-3 text-center font-medium">
        {data.description}
      </p>
      <ul className="space-y-1.5">
        {data.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-xs text-gray-600 dark:text-gray-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00688b] mt-1 mr-2 flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Features() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-950/50 dark:to-black">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00688b]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00688b]/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#00688b] dark:text-[#0088b3] bg-[#e6f4f8] dark:bg-[#00344a]/30 px-4 py-2 rounded-full">
              Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#00688b] to-[#0088b3] dark:from-[#0088b3] dark:to-[#00a8d8] bg-clip-text text-transparent">
              Manage Fundraising
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Track investors, measure outreach performance, and close deals with clarity and structure.
          </p>
        </div>

        {/* Features Grid with Flipping Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cardsData.map((card) => (
            <FlippingCard
              key={card.id}
              width={260}
              height={280}
              frontContent={<CardFront data={card.front} icon={card.icon} />}
              backContent={<CardBack data={card.back} />}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
