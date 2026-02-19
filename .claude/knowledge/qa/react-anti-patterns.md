# React Performance Anti-Patterns Reference

Complete catalog of React performance anti-patterns with detection patterns and fixes.

## Critical Anti-Patterns

### 1. Inline Object in Props

**Pattern:**

```tsx
// BAD - new object every render
<Component style={{ marginTop: 8 }} />
<Component config={{ enabled: true, threshold: 10 }} />
<Component data={[item1, item2]} />
```

**Detection:**

```regex
\w+=\{\{[^}]+\}\}
\w+=\{\[[^\]]+\]\}
```

**Why it's bad:** Creates a new object/array reference on every render. Even if the values are identical, `{} !== {}` in JavaScript. This breaks `React.memo` and causes child components to re-render.

**Fix:**

```tsx
// GOOD - stable reference
const style = { marginTop: 8 };
<Component style={style} />;

// GOOD - memoized when deps change
const config = useMemo(() => ({ enabled, threshold }), [enabled, threshold]);
<Component config={config} />;

// GOOD - constant outside component
const ITEMS = [item1, item2];
<Component data={ITEMS} />;
```

---

### 2. Inline Function in Props

**Pattern:**

```tsx
// BAD - new function every render
<Button onClick={() => handleClick(id)} />
<Input onChange={(e) => setValue(e.target.value)} />
<List renderItem={(item) => <Item data={item} />} />
```

**Detection:**

```regex
on\w+=\{\s*\(\)?\s*=>
on\w+=\{\s*function
```

**Why it's bad:** Creates a new function reference on every render, breaking memoization of child components.

**Fix:**

```tsx
// GOOD - useCallback for stable reference
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
<Button onClick={handleClick} />

// GOOD - for simple setters, pass the setter directly
<Input onChange={setValue} /> // if setValue is already stable

// GOOD - useCallback with deps
const renderItem = useCallback((item) => <Item data={item} />, []);
<List renderItem={renderItem} />
```

---

### 3. Missing React.memo

**Pattern:**

```tsx
// BAD - re-renders when parent renders, even with same props
const EntityRow = ({ entity }) => {
  return <TableRow>...</TableRow>;
};
export default EntityRow;
```

**Detection:**

- Component exported without `memo()` wrapper
- Component receives props from parent
- Parent re-renders frequently (data updates, state changes)

**Why it's bad:** Without `memo`, React re-renders the component whenever its parent renders, regardless of whether props changed.

**Fix:**

```tsx
// GOOD - only re-renders when props change
const EntityRow = memo(({ entity }) => {
  return <TableRow>...</TableRow>;
});
export default EntityRow;

// GOOD - with custom comparison for complex props
const EntityRow = memo(
  ({ entity }) => {
    return <TableRow>...</TableRow>;
  },
  (prevProps, nextProps) => {
    return prevProps.entity.id === nextProps.entity.id;
  }
);
```

**When to use memo:**

- Component renders often due to parent updates
- Component receives complex props that rarely change
- Component has expensive render logic or large subtree

**When NOT to use memo:**

- Component always receives new props
- Component is very simple (memo overhead > render cost)
- Component is the root or rarely re-renders

---

### 4. Unstable Hook Dependencies

**Pattern:**

```tsx
// BAD - inline object in deps causes recreation every render
const callback = useCallback(() => {
  doSomething(config);
}, [{ enabled: true }]); // Object in deps!

const value = useMemo(() => {
  return expensiveCalculation(items);
}, [[1, 2, 3]]); // Array in deps!
```

**Detection:**

```regex
use(Callback|Memo)\([^)]+\],\s*\[[^[\]]*\{
use(Callback|Memo)\([^)]+\],\s*\[[^[\]]*\[
```

**Why it's bad:** Objects/arrays in dependency arrays are compared by reference. Inline objects create new references, so the hook always sees "changed" dependencies.

**Fix:**

```tsx
// GOOD - use primitive values or stable references
const callback = useCallback(() => {
  doSomething(config);
}, [config.enabled, config.threshold]); // Primitives

// GOOD - memoize the dependency
const items = useMemo(() => [1, 2, 3], []);
const value = useMemo(() => {
  return expensiveCalculation(items);
}, [items]);
```

---

### 5. Context Provider with Inline Value

**Pattern:**

```tsx
// BAD - new object every render, all consumers re-render
const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

**Detection:**

```regex
\.Provider value=\{\{
```

**Why it's bad:** Every render creates a new object for the context value. All consumers re-render because the value reference changed.

**Fix:**

```tsx
// GOOD - memoize the context value
const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// BETTER - split into separate contexts
const UserContext = createContext(null);
const UserActionsContext = createContext(null);

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={user}>
      <UserActionsContext.Provider value={setUser}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
};
```

---

## Warning Anti-Patterns

### 6. Missing useMemo for Expensive Computation

**Pattern:**

```tsx
// BAD - recalculates every render
const Component = ({ items }) => {
  const sortedItems = items.sort((a, b) => a.value - b.value);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  // ...
};
```

**Detection:**

- `.sort()`, `.filter()`, `.reduce()`, `.map()` in component body
- Complex calculations without useMemo wrapper

**Fix:**

```tsx
// GOOD - only recalculates when items change
const Component = ({ items }) => {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.value - b.value),
    [items]
  );
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.value, 0),
    [items]
  );
  // ...
};
```

---

### 7. Derived State (useState for Computed Values)

**Pattern:**

```tsx
// BAD - derived state requires manual sync
const Component = ({ user }) => {
  const [fullName, setFullName] = useState(`${user.first} ${user.last}`);

  useEffect(() => {
    setFullName(`${user.first} ${user.last}`);
  }, [user.first, user.last]);
  // ...
};
```

**Detection:**

- useState immediately followed by useEffect that updates it based on props
- State that's always derived from props

**Fix:**

```tsx
// GOOD - compute during render
const Component = ({ user }) => {
  const fullName = `${user.first} ${user.last}`;
  // ...
};

// GOOD - useMemo if expensive
const Component = ({ user }) => {
  const fullName = useMemo(
    () => `${user.first} ${user.last}`,
    [user.first, user.last]
  );
  // ...
};
```

---

### 8. Large Lists Without Virtualization

**Pattern:**

```tsx
// BAD - renders all 1000 items
const Component = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <Item key={item.id} data={item} />
      ))}
    </div>
  );
};
```

**Detection:**

- `.map()` rendering components
- List likely to have >50 items
- No virtualization library (react-window, react-virtualized, tanstack-virtual)

**Fix:**

```tsx
// GOOD - only renders visible items
import { FixedSizeList } from "react-window";

const Component = ({ items }) => {
  return (
    <FixedSizeList height={400} itemCount={items.length} itemSize={50}>
      {({ index, style }) => <Item style={style} data={items[index]} />}
    </FixedSizeList>
  );
};
```

---

## Note Anti-Patterns

### 9. Index as Key in Dynamic Lists

**Pattern:**

```tsx
// BAD - index as key on reorderable/filterable list
{
  items.map((item, index) => <Item key={index} data={item} />);
}
```

**Detection:**

```regex
key=\{index\}
key=\{i\}
```

**Why it's bad:** When items are reordered, added, or removed, React can't correctly track which item is which. This causes incorrect state preservation and inefficient DOM updates.

**Fix:**

```tsx
// GOOD - stable unique identifier
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

**Exception:** Index as key is fine for static lists that never reorder.

---

### 10. Prop Drilling Through Many Levels

**Pattern:**

```tsx
// BAD - same prop passed through many components
<Grandparent user={user}>
  <Parent user={user}>
    <Child user={user}>
      <Grandchild user={user} /> // Finally used here
    </Child>
  </Parent>
</Grandparent>
```

**Detection:**

- Same prop name appears in component chain
- 3+ levels of passing without transformation

**Why it's bad:**

- Maintenance burden
- All intermediate components re-render when prop changes
- Tight coupling between components

**Fix:**

```tsx
// GOOD - context for deeply shared state
const UserContext = createContext(null);

const Grandparent = ({ children }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

const Grandchild = () => {
  const user = useContext(UserContext);
  // ...
};
```

---

## Project-Specific Patterns

### ChainContainer Usage

```tsx
// BAD - using wagmi hooks directly
import { useAccount, useChainId } from "wagmi";
const { address } = useAccount();

// GOOD - use container
import { ChainContainer } from "@/containers/ChainContainer";
const { address } = ChainContainer.useContainer();
```

### Transform Hook Usage

```tsx
// BAD - using raw ponder hooks in components
import { usePonderEntities } from "@/hooks/ponder/usePonderEntities";

// GOOD - use transform hooks
import { useGetEntities } from "@/hooks/blockchain/useGetEntities";
```

### Contract Reads

```tsx
// BAD - useReadContract in component
const { data } = useReadContract({ ... });

// GOOD - create hook in src/hooks/blockchain/
// Then use in component
const { data } = useEntityTotalAssets(entityAddress);
```
