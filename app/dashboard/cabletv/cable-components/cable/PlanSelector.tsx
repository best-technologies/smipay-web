"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { VtpassCableVariation } from "@/types/vtpass/vtu/vtpass-cable";
import { Loader2, Star, Tv, Grid3x3, List, X, ArrowRight } from "lucide-react";

interface PlanSelectorProps {
  variationCodes: {
    ServiceName: string;
    serviceID: string;
    variations: VtpassCableVariation[];
  } | null;
  isLoading: boolean;
  error: string | null;
  onSelectPlan: (variation: VtpassCableVariation) => void;
  selectedVariationCode?: string | null;
}

const TOOLTIP_STORAGE_KEY = "cable-plan-view-tooltip-shown-count";
const MAX_TOOLTIP_SHOWS = 3;
const FAVORITES_STORAGE_KEY = "cable-plan-favorites";

export function PlanSelector({
  variationCodes,
  isLoading,
  error,
  onSelectPlan,
  selectedVariationCode,
}: PlanSelectorProps) {
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
    e.stopPropagation();
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
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-bg-primary mx-auto mb-4" />
        <p className="text-brand-text-secondary">Loading subscription plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!variationCodes || !variationCodes.variations || variationCodes.variations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-text-secondary">No subscription plans available at the moment.</p>
      </div>
    );
  }

  // Get all variations (use varations if variations is empty - API typo)
  const allVariations: VtpassCableVariation[] = variationCodes.variations.length > 0 
    ? variationCodes.variations 
    : ((variationCodes as any).varations as VtpassCableVariation[]) || [];

  // Filter by favorites if enabled
  const displayedVariations = showFavoritesOnly
    ? allVariations.filter((v: VtpassCableVariation) => isFavorite(v.variation_code))
    : allVariations;

  const favoriteCount = allVariations.filter((v: VtpassCableVariation) => isFavorite(v.variation_code)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Select Subscription Plan
          </h2>
          {favoriteCount > 0 && (
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                showFavoritesOnly
                  ? "bg-brand-bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Star className={cn(
                "h-4 w-4",
                showFavoritesOnly ? "fill-white" : "fill-yellow-400 text-yellow-400"
              )} />
              View Favourites ({favoriteCount})
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
                    You can switch between row and card view to see subscription plans in your preferred layout.
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

      {/* Plans - Cards or Rows */}
      {displayedVariations.length > 0 ? (
        layout === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedVariations.map((variation, index) => {
              const isSelected = selectedVariationCode === variation.variation_code;
              const amount = parseFloat(variation.variation_amount);
              
              // Color gradient based on index for visual variety
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
                    "p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden",
                    "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-2",
                    isSelected
                      ? "border-brand-bg-primary bg-gradient-to-br from-brand-bg-primary/10 to-brand-bg-primary/5 shadow-lg ring-2 ring-brand-bg-primary/30 scale-[1.02]"
                      : `bg-gradient-to-br ${cardColor.gradient} ${cardColor.border} hover:shadow-md`
                  )}
                >
                  {/* Decorative corner accent */}
                  {!isSelected && (
                    <div className={cn(
                      "absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-20",
                      cardColor.accent
                    )} />
                  )}
                  
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-semibold text-sm mb-1",
                        isSelected ? "text-brand-bg-primary" : "text-slate-800"
                      )}>
                        {variation.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {variation.variation_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {/* Favorite Star */}
                      <button
                        onClick={(e) => toggleFavorite(variation.variation_code, e)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                        title={isFavorite(variation.variation_code) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isFavorite(variation.variation_code)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400 hover:text-yellow-400"
                          )}
                        />
                      </button>
                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-brand-bg-primary flex items-center justify-center shadow-sm">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "mt-4 pt-4 border-t relative z-10",
                    isSelected ? "border-brand-bg-primary/30" : "border-slate-200"
                  )}>
                    <p className={cn(
                      "text-2xl font-bold",
                      isSelected ? "text-brand-bg-primary" : "text-slate-800"
                    )}>
                      ₦{amount.toLocaleString()}
                    </p>
                    {variation.fixedPrice === "Yes" && (
                      <p className="text-xs text-slate-500 mt-1">Fixed Price</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-3 min-w-max">
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
                      "flex-shrink-0 w-64 p-4 rounded-lg border-2 transition-all text-left relative overflow-hidden",
                      "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-bg-primary focus:ring-offset-2",
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
                    
                    <div className="relative z-10 mt-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-semibold text-sm mb-1 line-clamp-2",
                            isSelected ? "text-brand-bg-primary" : "text-slate-800"
                          )}>
                            {variation.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate">
                            {variation.variation_code}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          {/* Favorite Star */}
                          <button
                            onClick={(e) => toggleFavorite(variation.variation_code, e)}
                            className="p-1 hover:bg-white/50 rounded transition-colors"
                            title={isFavorite(variation.variation_code) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4 transition-colors",
                                isFavorite(variation.variation_code)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400 hover:text-yellow-400"
                              )}
                            />
                          </button>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-brand-bg-primary flex items-center justify-center shadow-sm">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className={cn(
                          "text-xl font-bold",
                          isSelected ? "text-brand-bg-primary" : "text-slate-800"
                        )}>
                          ₦{amount.toLocaleString()}
                        </p>
                        {variation.fixedPrice === "Yes" && (
                          <p className="text-xs text-slate-500 mt-1">Fixed Price</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      ) : showFavoritesOnly ? (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-brand-text-secondary font-medium">No favorite plans yet</p>
          <p className="text-sm text-gray-400 mt-2">Click the star icon on any plan to add it to favorites</p>
        </div>
      ) : (
        <div className="text-center py-8 text-brand-text-secondary">
          <p>No plans available.</p>
        </div>
      )}
    </div>
  );
}
