/* Minimal syntax highlighting for the documentation's code blocks.
   Hand-written for the small set of languages the pages actually use
   (TypeScript, shell, JSON) — not a general-purpose highlighter.
   Progressive enhancement: without this script the blocks render as
   plain monospaced text, which is fine. Token colors: assets/style.css. */
(function () {
  var pattern = new RegExp(
    [
      // comments: `// ...` (but not `://` in URLs) and shell `# ...` at line start
      "((?<!:)\\/\\/[^\\n]*|(?:^|\\n)[ \\t]*#[^\\n]*)",
      // strings and template literals
      "(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
      // keywords
      "\\b(import|from|export|const|let|var|new|await|async|function|return|try|catch|finally|throw|if|else|for|of|in|type|interface|extends|class|this|null|undefined|true|false|typeof|as|default)\\b",
      // numbers
      "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",
    ].join("|"),
    "g"
  );
  var classes = ["tk-com", "tk-str", "tk-kw", "tk-num"];

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  document.querySelectorAll("pre code").forEach(function (code) {
    var source = code.textContent;
    var html = "";
    var last = 0;
    var match;
    while ((match = pattern.exec(source)) !== null) {
      var group = 0;
      while (match[group + 1] === undefined) group++;
      html += escapeHtml(source.slice(last, match.index));
      html += '<span class="' + classes[group] + '">' + escapeHtml(match[0]) + "</span>";
      last = match.index + match[0].length;
    }
    html += escapeHtml(source.slice(last));
    code.innerHTML = html;
  });
})();
