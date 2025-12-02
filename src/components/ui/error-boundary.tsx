"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

export function GlobalErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-6 p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-lg shadow-destructive/20">
                <AlertTriangle className="size-10" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
                <p className="text-muted-foreground">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
            </div>
            <Button
                onClick={resetErrorBoundary}
                size="lg"
                className="gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-all"
            >
                <RefreshCcw className="size-4" />
                Try Again
            </Button>
        </div>
    );
}
