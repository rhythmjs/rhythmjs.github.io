(function () {
  var pattern = new RegExp(
    [
      "((?<!:)\\/\\/[^\\n]*|(?:^|\\n)[ \\t]*#[^\\n]*)",
      "(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
      "\\b(import|from|export|const|let|var|new|await|async|function|return|try|catch|finally|throw|if|else|for|of|in|type|interface|extends|class|this|null|undefined|true|false|typeof|as|default)\\b",
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
