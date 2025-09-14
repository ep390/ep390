import hljs from "highlight.js";

export default function HighlightCode({
  code,
  language = "javascript",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: any;
  language: string;
}) {
  if (typeof code !== "string") {
    code = stringifyWithFunctions(code, 2);
  }
  const highlightedCode = hljs.highlight(code, { language }).value;
  return (
    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
      <code
        className="hljs language-javascript"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stringifyWithFunctions(value: any, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (key, val) => {
      if (typeof val === "function") {
        return `[Function${val.name ? ": " + val.name : ""}]`;
      }
      if (typeof val === "bigint") {
        return `${val}n`;
      }
      if (typeof val === "symbol") {
        return val.toString();
      }
      if (val && typeof val === "object") {
        if (seen.has(val)) return "[Circular]";
        seen.add(val);
      }
      return val;
    },
    space
  );
}
