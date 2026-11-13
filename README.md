# riskcatangame

## Shared player scoreboard

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project's Supabase URL and anon/public key. Restart the dev server after changing these values. The shared scoreboard uses the `public.players` table and its realtime publication/policies; never put a service-role key in the browser app.

Each browser remembers its selected player row locally. Resetting the player deletes that row, freeing the color and clearing its points for everyone.
