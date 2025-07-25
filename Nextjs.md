# Next.js Development Configuration

## Project Setup

- Next.js 15+ with App Router
- TypeScript strict mode
- File naming: snake_case (user_profile.tsx, api_client.ts)

## State Management

- Zustand for global state
- Create stores in `lib/stores/`
- Pattern:

  ```typescript
  interface StoreState {
    user: User | null;
    setUser: (user: User | null) => void;
  }

  export const useStore = create<StoreState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
  ```

## Data Fetching

- React Query (TanStack Query) for server state
- Setup in `lib/query-client.ts`
- Custom hooks in `lib/hooks/`
- Pattern: `useUserData`, `useContractData`, etc.

## UI Development

- Tailwind CSS + shadcn/ui components
- Generate initial UI from v0.dev or bolt.new
- Component structure:
  ```
  components/
  ├── ui/           # shadcn/ui components
  ├── layout/       # Header, Footer, etc
  ├── features/     # Feature-specific components
  └── shared/       # Reusable components
  ```

## Forms

- React Hook Form with Zod validation
- Pattern:

  ```typescript
  const schema = z.object({
    email: z.string().email(),
    amount: z.number().positive(),
  });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  ```

## Web3 Authentication

- Privy, Reown (WalletConnect v2), or Dynamic
- No traditional auth - wallet is identity
- Store wallet data in Zustand
- Supabase for data storage (no auth module)

## Component Architecture

- Keep pages clean - minimal logic in page.tsx
- All business logic in `lib/`
- UI components in `components/`
- Pattern:

  ```typescript
  // app/dashboard/page.tsx
  export default function DashboardPage() {
    return <DashboardContainer />;
  }

  // components/features/dashboard/dashboard-container.tsx
  function DashboardContainer() {
    const { data } = useDashboardData(); // from lib/hooks
    return <DashboardView data={data} />;
  }
  ```

## API Routes

- Structure: `app/api/[resource]/route.ts`
- Use snake_case for routes
- Standard response wrapper:
  ```typescript
  return NextResponse.json({
    success: true,
    data: result,
  });
  ```

## Common Patterns

- Loading states with Suspense boundaries
- Error boundaries for fault tolerance
- Skeleton loaders from shadcn/ui
- Toast notifications for user feedback

## Performance

- Use next/image when beneficial
- Dynamic imports for heavy components
- Optimize client components (use server components by default)

## Environment Variables

- NEXT*PUBLIC*\* for client-side vars
- Server-only vars without prefix
- Always type your env:
  ```typescript
  // lib/env.ts
  export const env = {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID!,
    DATABASE_URL: process.env.DATABASE_URL!,
  };
  ```
