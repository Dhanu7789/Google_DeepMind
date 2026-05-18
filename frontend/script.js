let htmlCode = "";
let cssCode = "";
let jsCode = "";

async function generateCode() {

  const prompt = document.getElementById("prompt").value;

  if (!prompt) {
    alert("Please enter a prompt");
    return;
  }

  try {

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Error generating code");
      return;
    }

    const text = data.result;

    htmlCode = extract(text, "HTML");
    cssCode = extract(text, "CSS");
    jsCode = extract(text, "JS");

    document.getElementById("html").textContent = htmlCode;
    document.getElementById("css").textContent = cssCode;
    document.getElementById("js").textContent = jsCode;

    updatePreview();

  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
}

function extract(text, label) {

  const regex = new RegExp(
    `${label}:([\\s\\S]*?)(?=HTML:|CSS:|JS:|$)`,
    "i"
  );

  const match = text.match(regex);

  if (!match) return "";

  let code = match[1].trim();

  code = code.replace(/```html/g, "");
  code = code.replace(/```css/g, "");
  code = code.replace(/```javascript/g, "");
  code = code.replace(/```js/g, "");
  code = code.replace(/```/g, "");

  return code.trim();
}

function updatePreview() {

  const iframe = document.getElementById("preview");

  const fullCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      ${cssCode}
      </style>
    </head>

    <body>
      ${htmlCode}

      <script>
      ${jsCode}
      <\/script>
    </body>
    </html>
  `;

  iframe.srcdoc = fullCode;
}

function copyCode(type) {

  let text = "";

  if (type === "html") text = htmlCode;
  if (type === "css") text = cssCode;
  if (type === "js") text = jsCode;

  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Copied!");
    })
    .catch(err => {
      console.error(err);
    });
}

async function downloadZip() {

  if (!htmlCode && !cssCode && !jsCode) {
    alert("Generate code first");
    return;
  }

  const zip = new JSZip();

  zip.file("index.html", htmlCode);
  zip.file("style.css", cssCode);
  zip.file("script.js", jsCode);

  const content = await zip.generateAsync({
    type: "blob"
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(content);
  a.download = "ai-website.zip";

  a.click();
}