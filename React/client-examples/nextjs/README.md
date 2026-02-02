# Client Site (Next.js) Embed Example

In any Next.js page or component:

```tsx
export default function Contact() {
  return (
    <iframe
      src="https://forms.yourdomain.com/embed/contact?client=acme&theme=light"
      style={{ width: "100%", border: 0, minHeight: 720 }}
      loading="lazy"
    />
  );
}
```
