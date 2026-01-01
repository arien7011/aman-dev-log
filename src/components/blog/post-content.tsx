interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article
      className="prose prose-lg prose-gray mx-auto max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-teal-400 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 prose-pre:text-gray-100 dark:prose-pre:bg-gray-800 prose-img:rounded-xl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
