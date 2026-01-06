"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingDown } from "lucide-react";
import { BundleOpportunity, swapWithBundle } from "@/lib/actions/cart";
import { useState } from "react";
import { toast } from "react-toastify";

interface BundleSuggestionProps {
  opportunities: BundleOpportunity[];
}

export function BundleSuggestion({ opportunities }: BundleSuggestionProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return null;
  }

  const handleSwapToBundle = async (opportunity: BundleOpportunity) => {
    setLoading(opportunity.subjectId);
    try {
      const result = await swapWithBundle(opportunity.subjectId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to switch to bundle");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {opportunities.map((opportunity) => (
        <Card
          key={opportunity.subjectId}
          className="border-primary/50 bg-primary/5 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    Bundle Savings Available!
                  </h3>
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Save ${opportunity.savings.toFixed(2)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  You have all individual content types for{" "}
                  <span className="font-semibold text-foreground">
                    {opportunity.subjectTitle}
                  </span>
                  . Switch to the complete bundle and save money!
                </p>

                {/* Price Comparison */}
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Current Total
                    </div>
                    <div className="text-lg font-semibold text-muted-foreground line-through">
                      ${opportunity.currentIndividualTotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Bundle Price
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${opportunity.bundlePrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSwapToBundle(opportunity)}
                  disabled={loading === opportunity.subjectId}
                  className="gradient-primary"
                  size="sm"
                >
                  {loading === opportunity.subjectId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Switching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Switch to Bundle & Save ${opportunity.savings.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
