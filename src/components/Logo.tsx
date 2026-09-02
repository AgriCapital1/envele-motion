import logoAsset from "@/assets/logo-envle-motion.png.asset.json";

const logo = logoAsset.url;

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="E'nvlé Motion"
      className={`${className} rounded-lg object-contain`}
      loading="lazy"
    />
  );
}

export function LogoWordmark() {
  return (
    <div className="flex items-center gap-3">
      <Logo className="h-9 w-9" />
      <div className="leading-tight">
        <p className="font-display text-base font-semibold text-gold-gradient">E'NVLÉ MOTION</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Imaginez. Décrivez. Réalisez.
        </p>
      </div>
    </div>
  );
}
