import axios from "axios";

import MinimalTheme from "../components/themes/MinimalTheme";
import CyberpunkTheme from "../components/themes/CyberpunkTheme";
import GlassTheme from "../components/themes/GlassTheme";
import AuroraTheme from "../components/themes/AuroraTheme";
import BrutalistTheme from "../components/themes/BrutalistTheme";
import TerminalTheme from "../components/themes/TerminalTheme";
import PastelTheme from "../components/themes/PastelTheme";
import NexusTheme from "../components/themes/NexusTheme";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getPortfolio(slug: string) {
  if (!slug || slug === "undefined") {
    return null;
  }

  try {
    const res = await axios.get(
      `${apiBaseUrl}/portfolios/${slug}`
    );

    return res.data;

  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    return (
      <div className="p-10 text-2xl">
        Portfolio not found
      </div>
    );
  }

  if (portfolio.theme === "cyberpunk") {
    return <CyberpunkTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "glass") {
    return <GlassTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "aurora") {
    return <AuroraTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "brutal") {
    return <BrutalistTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "terminal") {
    return <TerminalTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "pastel") {
    return <PastelTheme portfolio={portfolio} />;
  }

  if (portfolio.theme === "nexus") {
    return <NexusTheme portfolio={portfolio}/>
  }

  return <MinimalTheme portfolio={portfolio} />;
}