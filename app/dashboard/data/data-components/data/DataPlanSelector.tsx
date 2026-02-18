"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { VtpassDataVariation, VtpassDataVariationCategory } from "@/types/vtpass/vtu/vtpass-data";
import { Loader2, Wifi, Calendar, Moon, Users, Router, Grid3x3, List, X, ArrowRight, Star } from "lucide-react";

interface DataPlanSelectorProps {
  variationCodes: {
    ServiceName: string;
    serviceID: string;
    variations_categorized: Record<string, VtpassDataVariationCategory>;
  } | null;
  isLoading: boolean;
  error: string | null;
  onSelectPlan: (variation: VtpassDataVariation) => void;
  selectedVariationCode?: string | null;
}

// Category display configuration - More subtle, professional colors
const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  Daily: { label: "Daily Plans", icon: Calendar, color: "bg-blue-50 text-blue-600 border-blue-300" },
  Weekly: { label: "Weekly Plans", icon: Calendar, color: "bg-emerald-50 text-emerald-600 border-emerald-300" },
  Monthly: { label: "Monthly Plans", icon: Calendar, color: "bg-violet-50 text-violet-600 border-violet-300" },
  Night: { label: "Night Plans", icon: Moon, color: "bg-indigo-50 text-indigo-600 border-indigo-300" },
  Weekend: { label: "Weekend Plans", icon: Calendar, color: "bg-amber-50 text-amber-600 border-amber-300" },
  Social: { label: "Social Plans", icon: Users, color: "bg-rose-50 text-rose-600 border-rose-300" },
  SME: { label: "SME Plans", icon: Users, color: "bg-teal-50 text-teal-600 border-teal-300" },
  Hynetflex: { label: "Hynetflex Plans", icon: Router, color: "bg-cyan-50 text-cyan-600 border-cyan-300" },
  "Broadband router": { label: "Broadband Plans", icon: Router, color: "bg-slate-50 text-slate-600 border-slate-300" },
  Others: { label: "Other Plans", icon: Wifi, color: "bg-slate-50 text-slate-600 border-slate-300" },
};

const TOOLTIP_STORAGE_KEY = "data-plan-view-tooltip-shown-count";
const MAX_TOOLTIP_SHOWS = 3;
const FAVORITES_STORAGE_KEY = "data-plan-favorites";

export function DataPlanSelector({
  variationCodes,
  isLoading,
  error,
  onSelectPlan,
  selectedVariationCode,
}: DataPlanSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [layout, setLayout] = useState<"cards" | "rows">("rows"); // Row is default
  const [showTooltip, setShowTooltip] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        const favoriteArray = JSON.parse(saved);
        setFavorites(new Set(favoriteArray));
      } catch (e) {
        // Invalid data, start fresh
        setFavorites(new Set());
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const favoriteArray = Array.from(favorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteArray));
  }, [favorites]);

  const toggleFavorite = (variationCode: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent plan selection when clicking star
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(variationCode)) {
        newFavorites.delete(variationCode);
      } else {
        newFavorites.add(variationCode);
      }
      return newFavorites;
    });
  };

  const isFavorite = (variationCode: string) => favorites.has(variationCode);

  // Check and show tooltip on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const shownCount = parseInt(localStorage.getItem(TOOLTIP_STORAGE_KEY) || "0", 10);
    
    if (shownCount < MAX_TOOLTIP_SHOWS) {
      // Small delay to ensure UI is rendered
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissTooltip = () => {
    setShowTooltip(false);
    if (typeof window !== "undefined") {
      const currentCount = parseInt(localStorage.getItem(TOOLTIP_STORAGE_KEY) || "0", 10);
      localStorage.setItem(TOOLTIP_STORAGE_KEY, String(currentCount + 1));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-brand-bg-primary mx-auto mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm text-brand-text-secondary">Loading data plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-red-600 text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!variationCodes || !variationCodes.variations_categorized) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-xs sm:text-sm text-brand-text-secondary">No data plans available at the moment.</p>
      </div>
    );
  }

  const categories = Object.keys(variationCodes.variations_categorized).filter(
    (cat) => variationCodes.variations_categorized[cat].count > 0
  );

  // Set first category as active if none selected
  if (!activeCategory && categories.length > 0) {
    setActiveCategory(categories[0]);
  }

  const activeVariations = activeCategory
    ? variationCodes.variations_categorized[activeCategory]?.variations || []
    : [];

  // Filter to show only favorites if toggle is on
  const displayedVariations = showFavoritesOnly
    ? activeVariations.filter((v) => isFavorite(v.variation_code))
    : activeVariations;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4 relative">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 whitespace-nowrap">
            Select Data Plan
          </h2>
          {favorites.size > 0 && (
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap",
                showFavoritesOnly
                  ? "bg-brand-bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Star className={cn(
                "h-3 w-3 sm:h-4 sm:w-4",
                showFavoritesOnly ? "fill-white" : "fill-yellow-400 text-yellow-400"
              )} />
              <span className="hidden min-[400px]:inline">Favourites</span> ({favorites.size})
            </button>
          )}
        </div>
        {/* Layout Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 relative" id="layout-toggle">
          <button
            onClick={() => setLayout("rows")}
            className={cn(
              "p-2 rounded-md transition-all",
              layout === "rows"
                ? "bg-white text-brand-bg-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
            title="Row View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayout("cards")}
            className={cn(
              "p-2 rounded-md transition-all",
              layout === "cards"
                ? "bg-white text-brand-bg-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
            title="Card View"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-slate-900 text-white rounded-lg p-4 shadow-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4" />
                    <p className="font-semibold text-sm">Switch View</p>
                  </div>
                  <p className="text-xs text-slate-300">
                    You can switch between row and card view to see data plans in your preferred layout.
                  </p>
                </div>
                <button
                  onClick={handleDismissTooltip}
                  className="flex-shrink-0 p-1 hover:bg-slate-800 rounded transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Arrow pointing up */}
              <div className="absolute -top-2 right-4">
                <div className="w-4 h-4 bg-slate-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Others;
            const Icon = config.icon;
            const count = variationCodes.variations_categorized[category]?.count || 0;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-all",
                  "border-2",
                  isActive
                    ? `${config.color} shadow-sm font-semibold`
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{config.label}</span>
                <span className="text-[9px] sm:text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Data Plans - Cards or Rows */}
      {displayedVariations.length > 0 ? (
        layout === "cards" ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {displayedVariations.map((variation, index) => {
              const isSelected = selectedVariationCode === variation.variation_code;
              const amount = parseFloat(variation.variation_amount);
              
              // Color gradient based on index for visual variety - more visible colors
              const colorVariants = [
                { gradient: "from-blue-100 to-blue-50", border: "border-blue-300", accent: "bg-blue-300" },
                { gradient: "from-emerald-100 to-emerald-50", border: "border-emerald-300", accent: "bg-emerald-300" },
                { gradient: "from-violet-100 to-violet-50", border: "border-violet-300", accent: "bg-violet-300" },
                { gradient: "from-amber-100 to-amber-50", border: "border-amber-300", accent: "bg-amber-300" },
                { gradient: "from-rose-100 to-rose-50", border: "border-rose-300", accent: "bg-rose-300" },
                { gradient: "from-teal-100 to-teal-50", border: "border-teal-300", accent: "bg-teal-300" },
              ];
              const cardColor = colorVariants[index % colorVariants.length];

              return (
                  <button
                  key={variation.variation_code}
                  onClick={() => onSelectPlan(variation)}
                  className={cn(
                    "p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all text-left relative overflow-hidden",
                    "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-1 sm:focus:ring-offset-2",
                    isSelected
                      ? "border-brand-bg-primary bg-gradient-to-br from-brand-bg-primary/10 to-brand-bg-primary/5 shadow-lg ring-2 ring-brand-bg-primary/30 scale-[1.02]"
                      : `bg-gradient-to-br ${cardColor.gradient} ${cardColor.border} hover:shadow-md`
                  )}
                >
                  {/* Decorative corner accent */}
                  {!isSelected && (
                    <div className={cn(
                      "absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16 rounded-bl-full opacity-20",
                      cardColor.accent
                    )} />
                  )}
                  
                  <div className="flex items-start justify-between mb-2 sm:mb-3 relative z-10">
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2",
                        isSelected ? "text-brand-bg-primary" : "text-slate-800"
                      )}>
                        {variation.name}
                      </h3>
                      <p className="text-[9px] sm:text-xs text-slate-500 truncate">
                        {variation.variation_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 flex-shrink-0">
                      {/* Favorite Star */}
                      <button
                        onClick={(e) => toggleFavorite(variation.variation_code, e)}
                        className="p-0.5 sm:p-1 hover:bg-white/50 rounded transition-colors"
                        title={isFavorite(variation.variation_code) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star
                          className={cn(
                            "h-3.5 w-3.5 sm:h-5 sm:w-5 transition-colors",
                            isFavorite(variation.variation_code)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400 hover:text-yellow-400"
                          )}
                        />
                      </button>
                      {isSelected && (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand-bg-primary flex items-center justify-center shadow-sm">
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "mt-2 sm:mt-4 pt-2 sm:pt-4 border-t relative z-10",
                    isSelected ? "border-brand-bg-primary/30" : "border-slate-200"
                  )}>
                    <p className={cn(
                      "text-base sm:text-lg md:text-2xl font-bold",
                      isSelected ? "text-brand-bg-primary" : "text-slate-800"
                    )}>
                      ₦{amount.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto pb-3 sm:pb-4 -mx-2 px-2">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {displayedVariations.map((variation, index) => {
                const isSelected = selectedVariationCode === variation.variation_code;
                const amount = parseFloat(variation.variation_amount);
                
                // Color gradient for rows
                const colorVariants = [
                  { gradient: "from-blue-100 to-blue-50", border: "border-blue-300", accent: "bg-blue-300" },
                  { gradient: "from-emerald-100 to-emerald-50", border: "border-emerald-300", accent: "bg-emerald-300" },
                  { gradient: "from-violet-100 to-violet-50", border: "border-violet-300", accent: "bg-violet-300" },
                  { gradient: "from-amber-100 to-amber-50", border: "border-amber-300", accent: "bg-amber-300" },
                  { gradient: "from-rose-100 to-rose-50", border: "border-rose-300", accent: "bg-rose-300" },
                  { gradient: "from-teal-100 to-teal-50", border: "border-teal-300", accent: "bg-teal-300" },
                ];
                const rowColor = colorVariants[index % colorVariants.length];

                return (
                  <button
                    key={variation.variation_code}
                    onClick={() => onSelectPlan(variation)}
                    className={cn(
                      "flex-shrink-0 w-44 sm:w-52 md:w-64 p-3 sm:p-4 rounded-lg border-2 transition-all text-left relative overflow-hidden",
                      "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-1 sm:focus:ring-offset-2",
                      "flex flex-col justify-between",
                      isSelected
                        ? "border-brand-bg-primary bg-gradient-to-br from-brand-bg-primary/10 to-brand-bg-primary/5 shadow-md ring-2 ring-brand-bg-primary/20"
                        : `bg-gradient-to-br ${rowColor.gradient} ${rowColor.border} hover:shadow-sm`
                    )}
                  >
                    {/* Top accent bar */}
                    {!isSelected && (
                      <div className={cn(
                        "absolute top-0 left-0 right-0 h-1",
                        rowColor.accent
                      )} />
                    )}
                    
                    <div className="relative z-10 mt-0.5 sm:mt-1">
                      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            "font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2",
                            isSelected ? "text-brand-bg-primary" : "text-slate-800"
                          )}>
                            {variation.name}
                          </h3>
                          <p className="text-[9px] sm:text-xs text-slate-500 truncate">
                            {variation.variation_code}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 flex-shrink-0">
                          {/* Favorite Star */}
                          <button
                            onClick={(e) => toggleFavorite(variation.variation_code, e)}
                            className="p-0.5 sm:p-1 hover:bg-white/50 rounded transition-colors"
                            title={isFavorite(variation.variation_code) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star
                              className={cn(
                                "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
                                isFavorite(variation.variation_code)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400 hover:text-yellow-400"
                              )}
                            />
                          </button>
                          {isSelected && (
                            <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-brand-bg-primary flex items-center justify-center shadow-sm">
                              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200">
                        <p className={cn(
                          "text-base sm:text-lg md:text-xl font-bold",
                          isSelected ? "text-brand-bg-primary" : "text-slate-800"
                        )}>
                          ₦{amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      ) : showFavoritesOnly ? (
        <div className="text-center py-8 sm:py-12">
          <Star className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-brand-text-secondary font-medium">No favorite plans yet</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2">Click the star icon on any plan to add it to favorites</p>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-brand-text-secondary">
          <p className="text-xs sm:text-sm">No plans available in this category.</p>
        </div>
      )}
    </div>
  );
}
