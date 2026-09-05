import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listPricing = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("pricing_public" as "pricing_rules")
      .select("duration_seconds, label, price_fcfa, credits")
      .order("duration_seconds", { ascending: true });
    return (data ?? []).map((r) => ({
      durationSeconds: r.duration_seconds,
      label: r.label,
      priceFcfa: Number(r.price_fcfa),
      credits: Number(r.credits),
    }));
  });

export const createProduction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    brief: string;
    durationSeconds: number;
    aspectRatio: string;
    style: string;
    language: string;
    title?: string;
    voiceId?: string;
    referenceImages?: string[];
  }) => {
    if (!input.brief || input.brief.trim().length < 10)
      throw new Error("Décrivez votre vidéo en au moins 10 caractères.");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { runCreateProduction } = await import("@/lib/motion/engine.server");
    try {
      return await runCreateProduction(context.userId, {
        brief: data.brief.trim(),
        durationSeconds: data.durationSeconds,
        aspectRatio: data.aspectRatio,
        style: data.style,
        language: data.language,
        modelKey: "gemini-omni",
        ...(data.voiceId ? { voiceId: data.voiceId } : {}),
        ...(data.referenceImages?.length ? { referenceImages: data.referenceImages } : {}),
        ...(data.title ? { title: data.title } : {}),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      if (message === "INSUFFICIENT_CREDITS")
        throw new Error("Crédits insuffisants pour lancer cette production.");
      throw new Error(message);
    }
  });

export const getProduction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string }) => input)
  .handler(async ({ data, context }) => {
    const { getProductionState } = await import("@/lib/motion/engine.server");
    return getProductionState(context.userId, data.projectId);
  });

export const advanceProduction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string }) => input)
  .handler(async ({ data, context }) => {
    const { runAdvanceProduction } = await import("@/lib/motion/engine.server");
    return runAdvanceProduction(context.userId, data.projectId);
  });

export const extendProduction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string; extraSeconds: number }) => input)
  .handler(async ({ data, context }) => {
    const { runExtendProduction } = await import("@/lib/motion/engine.server");
    try {
      return await runExtendProduction(context.userId, data.projectId, data.extraSeconds);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      if (message === "INSUFFICIENT_CREDITS")
        throw new Error("Crédits insuffisants pour prolonger cette production.");
      throw new Error(message);
    }
  });

export const listProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("projects")
      .select("id, title, brief, status, duration_seconds, aspect_ratio, credits_spent, created_at")
      .eq("archived", false)
      .order("created_at", { ascending: false });
    return (data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      brief: p.brief,
      status: p.status,
      durationSeconds: p.duration_seconds,
      aspectRatio: p.aspect_ratio,
      creditsSpent: Number(p.credits_spent),
      createdAt: p.created_at,
    }));
  });

export const listVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("projects")
      .select("id, title, status, duration_seconds, aspect_ratio, created_at")
      .eq("status", "COMPLETED")
      .order("created_at", { ascending: false });
    return (data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      durationSeconds: p.duration_seconds,
      aspectRatio: p.aspect_ratio,
      createdAt: p.created_at,
    }));
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [account, projects, roles, profile] = await Promise.all([
      supabase.from("credit_accounts").select("balance, lifetime_used").maybeSingle(),
      supabase
        .from("projects")
        .select("id, title, status, duration_seconds, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("user_roles").select("role"),
      supabase.from("profiles").select("full_name").maybeSingle(),
    ]);

    const list = projects.data ?? [];
    return {
      balance: Number(account.data?.balance ?? 0),
      lifetimeUsed: Number(account.data?.lifetime_used ?? 0),
      fullName: profile.data?.full_name ?? null,
      roles: (roles.data ?? []).map((r) => r.role as string),
      recent: list.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        durationSeconds: p.duration_seconds,
        createdAt: p.created_at,
      })),
      activeCount: list.filter(
        (p) => !["COMPLETED", "FAILED", "CANCELLED"].includes(p.status),
      ).length,
      completedCount: list.filter((p) => p.status === "COMPLETED").length,
    };
  });

export const getCredits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [account, tx, pricing] = await Promise.all([
      context.supabase.from("credit_accounts").select("balance, lifetime_used, lifetime_purchased").maybeSingle(),
      context.supabase
        .from("credit_transactions")
        .select("id, type, amount, balance_after, description, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      context.supabase
        .from("pricing_public" as "pricing_rules")
        .select("duration_seconds, label, price_fcfa, credits")
        .order("duration_seconds", { ascending: true }),
    ]);

    return {
      balance: Number(account.data?.balance ?? 0),
      lifetimeUsed: Number(account.data?.lifetime_used ?? 0),
      lifetimePurchased: Number(account.data?.lifetime_purchased ?? 0),
      transactions: (tx.data ?? []).map((t) => ({
        id: t.id,
        type: t.type as string,
        amount: Number(t.amount),
        balanceAfter: t.balance_after === null ? null : Number(t.balance_after),
        description: t.description,
        createdAt: t.created_at,
      })),
      pricing: (pricing.data ?? []).map((r) => ({
        durationSeconds: r.duration_seconds,
        label: r.label,
        priceFcfa: Number(r.price_fcfa),
        credits: Number(r.credits),
      })),
    };
  });

export const regenerateProduction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string }) => input)
  .handler(async ({ data, context }) => {
    const { runRegenerateProduction } = await import("@/lib/motion/engine.server");
    try {
      return await runRegenerateProduction(context.userId, data.projectId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      if (message === "INSUFFICIENT_CREDITS")
        throw new Error("Crédits insuffisants pour relancer cette production.");
      throw new Error(message);
    }
  });

export const saveFinalVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { projectId: string; path: string }) => input)
  .handler(async ({ data, context }) => {
    const { setFinalVideo } = await import("@/lib/motion/engine.server");
    return setFinalVideo(context.userId, data.projectId, data.path);
  });
