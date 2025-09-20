# Set Up

### Terminal

`npm create vite@latest book-tracker`

- react
- javascript

`cd book-tracker`

`npm install lucide-react`

`npm install recharts`

`npm install tailwindcss @tailwindcss/vite`

- Configure the Vite plugin:
  **vite.config.ts**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- Import Tailwind CSS in your css file:

```css
@import "tailwindcss";
```

Start your build process
`npm run dev`

`npm install @supabase/supabase-js`

`npm install react-router-dom`

### Supabase

In Supabase SQL Editor:

```sql
-- Enable auth schema
create extension if not exists "uuid-ossp";

-- 1. Books table (static info)
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  pages int4,
  isbn text unique,
  inserted_at timestamptz default now()
);

-- 2. User Books (personal library)
create table user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references books (id) on delete cascade,
  shelf text check (shelf in ('to-read','reading','read')) default 'to-read',
  rating int4 check (rating between 0 and 5),
  spice_rating int4 check (spice_rating between 0 and 5),
  form text default 'ebook',
  note text,
  inserted_at timestamptz default now(),
  unique (user_id, book_id)
);

-- 3. Reading Sessions (supports multiple rereads)
create table reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_book_id uuid not null references user_books (id) on delete cascade,
  date_started date,
  date_finished date
);

-- 4. Tags (user-specific)
create table tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  unique (user_id, name)
);

-- 5. User Book Tags (junction between user_books and tags)
create table user_book_tags (
  id uuid primary key default gen_random_uuid(),
  user_book_id uuid not null references user_books (id) on delete cascade,
  tag_id uuid not null references tags (id) on delete cascade,
  unique (user_book_id, tag_id)
);
```

- enable row level policies on these public tables

## .env file
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deployment to github page
```bash
npm install gh-pages --save-dev
```

at the top of package.json add github site where the site will be deployed

```json
"homepage": "https://shar23d.github.io/book-tracker",
```

and in scripts add

```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
```

in vite.config.js add base (/repo name)
```js
export default defineConfig({
  base: "/book-tracker",
});
```

## 📬 Contact

Have questions or suggestions?

Email: sharon.dang.ncg@gmail.com

GitHub: https://github.com/Shar23D
```
