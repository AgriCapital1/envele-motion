import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_ROLES = ["super_admin", "admin"];

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.from("user_roles").select("role");
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.some((r: string) => ADMIN_ROLES.includes(r)))
    throw new Error("Accès refusé : réservé à l'administration.");
  return roles as string[];
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role");
    return (data ?? []).map((r) => r.role as string);
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [users, projects, jobs, accounts, tx, recent, pricing] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("generation_jobs").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("credit_accounts").select("balance, lifetime_used, lifetime_purchased"),
      supabaseAdmin.from("credit_transactions").select("type, amount"),
      supabaseAdmin
        .from("projects")
        .select("id, title, status, duration_seconds, credits_spent, created_at")
        .order("created_at", { ascending: false })
        .limit(15),
      supabaseAdmin
        .from("pricing_rules")
        .select("id, model_key, duration_seconds, label, price_fcfa, credits, estimated_cost_fcfa, target_margin, safety_coefficient, active")
        .order("duration_seconds", { ascending: true }),
    ]);

    const acc = accounts.data ?? [];
    const revenue = (tx.data ?? [])
      .filter((t) => t.type === "purchase")
      .reduce((s, t) => s + Number(t.amount), 0);

    return {
      userCount: users.count ?? 0,
      projectCount: projects.count ?? 0,
      jobCount: jobs.count ?? 0,
      creditsOutstanding: acc.reduce((s, a) => s + Number(a.balance), 0),
      creditsUsed: acc.reduce((s, a) => s + Number(a.lifetime_used), 0),
      creditsSold: revenue,
      recentProjects: (recent.data ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        durationSeconds: p.duration_seconds,
        creditsSpent: Number(p.credits_spent),
        createdAt: p.created_at,
      })),
      pricing: (pricing.data ?? []).map((r) => ({
        id: r.id,
        modelKey: r.model_key,
        durationSeconds: r.duration_seconds,
        label: r.label,
        priceFcfa: Number(r.price_fcfa),
        credits: Number(r.credits),
        estimatedCostFcfa: Number(r.estimated_cost_fcfa),
        targetMargin: Number(r.target_margin),
        safetyCoefficient: Number(r.safety_coefficient),
        active: r.active,
      })),
    };
  });

export const updatePricingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id: string;
    priceFcfa: number;
    credits: number;
    estimatedCostFcfa: number;
    targetMargin: number;
    safetyCoefficient: number;
    active: boolean;
  }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("pricing_rules")
      .update({
        price_fcfa: data.priceFcfa,
        credits: data.credits,
        estimated_cost_fcfa: data.estimatedCostFcfa,
        target_margin: data.targetMargin,
        safety_coefficient: data.safetyCoefficient,
        active: data.active,
      })
      .eq("id", data.id);
    if (error) throw new Error("Mise à jour tarifaire impossible.");
    return { ok: true };
  });
