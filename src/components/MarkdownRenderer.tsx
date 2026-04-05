export default function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.match(/^#{1,3}\s/)) {
          const text = line.replace(/^#{1,3}\s/, '');
          return <h3 key={i} className="font-bold text-white text-lg mt-3">{text.replace(/\*\*/g, '')}</h3>;
        }
        if (line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./)) {
          const text = line.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-gray-300" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
        );
      })}
    </div>
  );
}
