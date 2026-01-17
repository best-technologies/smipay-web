## TypeScript & ESLint Rules Cheat‑Sheet

Use this file as a checklist when writing or reviewing code so builds don’t fail on lint.

---

## 1. Unused Variables / Imports

- **Rule**: `@typescript-eslint/no-unused-vars`
- **Symptoms**: “`X` is defined but never used”, “`isSomething` is assigned a value but never used”.
- **Guidelines**
  - **Remove** variables, function params, and imports that are not used.
  - If you need a parameter for API compatibility but don’t use it, **prefix with `_`**:

    ```ts
    // OK: param not used but intentional
    const handleError = (_error: unknown) => {
      // logging is handled elsewhere
    };
    ```

  - Do **not** keep dead state like `const [isPlaying] = useState(false);` if you never read it.

---

## 2. Avoid `any`

- **Rule**: `@typescript-eslint/no-explicit-any`
- **Symptoms**: “Unexpected any. Specify a different type.”
- **Guidelines**
  - Use **specific types** whenever possible.
  - If you truly need a generic type:
    - Prefer `unknown` over `any` and narrow it.
    - Consider a **generic type parameter** `<T>` instead of `any`.
  - For event handlers, use React / DOM types:

    ```ts
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
    };
    ```

---

## 3. React Hooks Dependencies

- **Rule**: `react-hooks/exhaustive-deps`
- **Symptoms**: “Hook has a missing dependency: X. Either include it or remove the dependency array.”
- **Guidelines**
  - For `useEffect`, `useCallback`, and `useMemo`:
    - **Include all referenced variables and functions** in the dependency array.
    - If a function you use inside an effect is defined in the component, wrap it in **`useCallback`** and then add it as a dependency.
  - When updating state that depends on existing state, use the **functional form**:

    ```ts
    // Good: no need to add formData itself as a dependency
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    ```

  - Don’t silence this rule with `// eslint-disable-next-line` unless there is a **very strong reason** and you understand the re-render behavior.

---

## 4. JSX Text & Quotes (`react/no-unescaped-entities`)

- **Rule**: `react/no-unescaped-entities`
- **Symptoms**: Errors on `'` or `"` inside JSX text like `Don't` or `He said "Hi"`.
- **Guidelines**
  - Escape quotes inside plain JSX text:

    ```tsx
    // Instead of:
    // <p>Don't forget to save your work</p>
    // <p>He said "Hello"</p>

    <p>Don&apos;t forget to save your work</p>
    <p>He said &quot;Hello&quot;</p>
    ```

  - Apostrophes: `&apos;`, `&#39;`  
    Double quotes: `&quot;`, `&#34;`
  - Inside **string literals** in TS/JS (e.g. `"Don't"`), you don’t need HTML entities; just escape normally for the string if needed.

---

## 5. Next.js `<Image />` vs `<img>`

- **Rule**: `@next/next/no-img-element`
- **Symptoms**: “Using `<img>` could result in slower LCP…”
- **Guidelines**
  - Prefer `next/image` for all non-trivial images:

    ```tsx
    import Image from "next/image";

    <Image
      src={imageUrl}
      alt="Description"
      width={400}
      height={300}
      className="object-cover"
    />;
    ```

  - For background / avatar / thumbnail containers, use `fill` and a relative parent:

    ```tsx
    <div className="relative w-24 h-32">
      <Image
        src={thumbnailUrl}
        alt="Thumbnail"
        fill
        sizes="96px"
        className="object-cover"
      />
    </div>
    ```

  - Only use `<img>` when you **intentionally** bypass optimization and are OK adding a **local eslint-disable** (rare).

---

## 6. General Patterns for New Code

- **Imports**
  - Only import what you use.
  - After refactors, quickly remove now-unused imports/variables.

- **Catch Blocks**

  ```ts
  try {
    // ...
  } catch {
    // If you don't use the error, omit the param
  }
  ```

- **Props with Optional Callbacks**

  ```ts
  interface Props {
    onDone?: () => void;
  }

  const MyComponent = ({ onDone }: Props) => {
    const handleClick = () => {
      onDone?.();
    };
  };
  ```

---

## 7. Quick Pre‑Build Checklist

Before running `npm run build`, quickly scan your changes for:

- **Unused** imports, variables, state, or function params.
- Any new **`any`** types – replace with specific types or `unknown`.
- Hooks (`useEffect`, `useCallback`, `useMemo`) that reference values **not listed** in their dependency array.
- JSX text with `'` or `"` that should use HTML entities.
- Raw `<img>` elements that should be `next/image`.

Following this checklist will prevent almost all of the build‑breaking errors shown in the logs.


