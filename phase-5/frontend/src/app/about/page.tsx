export default function AboutPage() {
  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About TodoApp</h1>
      <div className="prose dark:prose-invert">
        <p className="mb-4">
          TodoApp is a demonstration of a modern Full-Stack Web Application built with:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Next.js 16</strong> (App Router) for the Frontend</li>
          <li><strong>FastAPI</strong> & <strong>SQLModel</strong> for the Backend</li>
          <li><strong>PostgreSQL</strong> (Neon) for persistent storage</li>
          <li><strong>JWT Authentication</strong> for security</li>
        </ul>
        <p>
          This project adheres to strict Spec-Driven Development principles, ensuring
          every feature is planned before implementation.
        </p>
      </div>
    </div>
  );
}
