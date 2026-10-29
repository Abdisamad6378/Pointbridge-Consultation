import { Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, ChevronDown, LayoutDashboard, Loader2, LogIn, LogOut, Trash2, UserPlus, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assetUrl, type AuthUser } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";
import { AVATAR_ACCEPT, prepareAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({ user, className, busy = false }: { user: AuthUser; className?: string; busy?: boolean }) {
  return (
    // Keyed on the URL: Radix Avatar keeps its "image loaded" state after the image is
    // removed, which would hide the letter fallback until the component remounts.
    <Avatar key={user.avatarUrl ?? "no-photo"} className={cn("relative h-7 w-7", className)}>
      {user.avatarUrl && <AvatarImage src={assetUrl(user.avatarUrl)} alt="" className="object-cover" />}
      <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
        {(user.name.trim()[0] ?? "?").toUpperCase()}
      </AvatarFallback>
      {busy && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45">
          <Loader2 className="h-1/2 w-1/2 animate-spin text-white" />
        </span>
      )}
    </Avatar>
  );
}

/** Hidden file input plus upload/remove actions for the signed-in user's photo. */
export function useAvatarPicker() {
  const { uploadAvatar, removeAvatar } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={AVATAR_ACCEPT}
      className="hidden"
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) void run(async () => uploadAvatar(await prepareAvatar(file)), "Profile photo updated");
      }}
    />
  );

  return {
    input,
    busy,
    choose: () => inputRef.current?.click(),
    remove: () => run(removeAvatar, "Profile photo removed"),
  };
}

function useSignOut() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return () => {
    logout();
    toast.success("You have been signed out");
    navigate({ to: "/" });
  };
}

/**
 * Desktop header actions. All three states (loading, signed out, signed in) share one
 * fixed-width slot so the nav links never shift when auth state resolves or changes.
 */
export function HeaderAuthActions() {
  const { user, loading } = useAuth();
  const signOut = useSignOut();
  const photo = useAvatarPicker();

  return (
    <div className="hidden w-[200px] items-center justify-end gap-2 md:flex xl:w-[220px] xl:gap-3">
      {loading ? (
        <div className="h-9 w-full animate-pulse rounded-full bg-muted" aria-hidden />
      ) : user ? (
        <>
          {photo.input}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 max-w-full gap-2 rounded-full border-primary/40 pl-1 pr-3 shadow-sm"
                aria-label={`Account menu for ${user.name}`}
              >
                <UserAvatar user={user} busy={photo.busy} className="text-xs" />
                <span className="truncate text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
                <UserAvatar user={user} busy={photo.busy} className="h-10 w-10 text-base" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <UserRound className="mr-2 h-4 w-4" />
                  My profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={photo.choose} disabled={photo.busy} className="cursor-pointer">
                <Camera className="mr-2 h-4 w-4" />
                {user.avatarUrl ? "Change photo" : "Upload photo"}
              </DropdownMenuItem>
              {user.avatarUrl && (
                <DropdownMenuItem onSelect={() => void photo.remove()} disabled={photo.busy} className="cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove photo
                </DropdownMenuItem>
              )}
              {user.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 min-w-[96px] justify-center rounded-full border-primary/40 px-4 text-primary shadow-sm transition-colors duration-300 hover:bg-primary/5 xl:min-w-[104px] xl:px-5"
          >
            <Link to="/login">
              <LogIn className="mr-1.5 h-4 w-4 shrink-0" />
              Sign In
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-9 min-w-[96px] justify-center rounded-full bg-primary px-4 shadow-md transition-colors duration-300 hover:bg-primary/90 xl:min-w-[104px] xl:px-5"
          >
            <Link to="/signup">
              <UserPlus className="mr-1.5 h-4 w-4 shrink-0" />
              Sign Up
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

/** Mobile-menu actions: fixed row heights (h-11) in every state. */
export function MobileAuthActions({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading } = useAuth();
  const signOut = useSignOut();
  const photo = useAvatarPicker();

  if (loading) {
    return <div className="h-11 animate-pulse rounded-full bg-muted" aria-hidden />;
  }

  if (user) {
    return (
      <div className="grid gap-3">
        {photo.input}
        <div className="flex h-14 items-center gap-3 rounded-full border px-2">
          <button
            type="button"
            onClick={photo.choose}
            disabled={photo.busy}
            className="relative shrink-0 rounded-full"
            aria-label={user.avatarUrl ? "Change profile photo" : "Upload profile photo"}
          >
            <UserAvatar user={user} busy={photo.busy} className="h-10 w-10 text-base" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
              <Camera className="h-2.5 w-2.5" />
            </span>
          </button>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className={cn("grid gap-3", user.role === "admin" ? "grid-cols-2" : "grid-cols-1")}>
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link to="/profile" onClick={onNavigate}>
              <UserRound className="mr-1.5 h-4 w-4" /> My profile
            </Link>
          </Button>
          {user.role === "admin" && (
            <Button asChild variant="outline" className="h-11 rounded-full">
              <Link to="/admin" onClick={onNavigate}>
                <LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-full text-destructive hover:text-destructive"
          onClick={() => {
            onNavigate();
            signOut();
          }}
        >
          <LogOut className="mr-1.5 h-4 w-4" /> Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button asChild variant="outline" className="h-11 rounded-full">
        <Link to="/login" onClick={onNavigate}>
          <LogIn className="mr-1.5 h-4 w-4" /> Sign In
        </Link>
      </Button>
      <Button asChild className="h-11 rounded-full bg-primary">
        <Link to="/signup" onClick={onNavigate}>
          <UserPlus className="mr-1.5 h-4 w-4" /> Sign Up
        </Link>
      </Button>
    </div>
  );
}
