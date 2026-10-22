// Scientific Calculator
// Logika kalkulator menggunakan JavaScript murni tanpa framework.

const expressionElement = document.getElementById("expression");
const resultElement = document.getElementById("result");
const messageElement = document.getElementById("message");
const keypad = document.getElementById("keypad");
const historyList = document.getElementById("historyList");
const degModeButton = document.getElementById("degMode");
const radModeButton = document.getElementById("radMode");

let expression = "";
let lastAnswer = 0;
let angleMode = "DEG";
let history = [];

// Tampilkan ekspresi dan hasil sementara.
function updateDisplay() {
  expressionElement.textContent = expression || "0";

  if (!expression) {
    resultElement.textContent = "0";
    setMessage("Masukkan perhitungan untuk memulai.");
    return;
  }

  try {
    const value = calculate(expression);
    resultElement.textContent = formatNumber(value);
    setMessage("Hasil sementara");
  } catch (error) {
    resultElement.textContent = "—";
    setMessage("Lengkapi ekspresi untuk melihat hasil.");
  }
}

function setMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.classList.toggle("error", isError);
}

function formatNumber(number) {
  if (!Number.isFinite(number)) {
    throw new Error("Hasil tidak valid.");
  }

  // Mengurangi masalah angka desimal seperti 0.1 + 0.2.
  const rounded = Number.parseFloat(number.toPrecision(12));
  return String(rounded);
}

function appendValue(value) {
  if (expression === "Error") expression = "";

  // Setelah menekan '=', angka baru memulai perhitungan baru.
  if (resultElement.dataset.completed === "true" && /[0-9.]$/.test(value)) {
    expression = "";
  }

  resultElement.dataset.completed = "false";
  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  resultElement.dataset.completed = "false";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  resultElement.dataset.completed = "false";
  updateDisplay();
}

function toggleSign() {
  if (!expression) {
    expression = "−";
  } else if (expression.startsWith("−")) {
    expression = expression.slice(1);
  } else {
    expression = "−(" + expression + ")";
  }

  updateDisplay();
}

// Mengubah teks tombol menjadi token yang dapat dihitung.
function normalizeExpression(input) {
  return input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "PI")
    .replace(/√\(/g, "sqrt(")
    .replace(/Ans/g, "ANS")
    .replace(/\bmod\b/g, "%");
}

// Tokenizer: memisahkan angka, operator, tanda kurung, dan fungsi.
function tokenize(input) {
  const source = normalizeExpression(input);
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const rest = source.slice(index);

    if (/^\s/.test(rest)) {
      index += rest.match(/^\s+/)[0].length;
      continue;
    }

    const numberMatch = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
    if (numberMatch) {
      tokens.push({ type: "number", value: Number(numberMatch[0]) });
      index += numberMatch[0].length;
      continue;
    }

    const identifierMatch = rest.match(/^[a-zA-Z]+/);
    if (identifierMatch) {
      tokens.push({ type: "identifier", value: identifierMatch[0].toUpperCase() });
      index += identifierMatch[0].length;
      continue;
    }

    const character = source[index];
    if ("+-*/%^!()".includes(character)) {
      tokens.push({ type: "operator", value: character });
      index += 1;
      continue;
    }

    throw new Error("Ada karakter yang tidak dikenali.");
  }

  return tokens;
}

// Parser rekursif agar prioritas operasi matematika tetap benar.
// Urutan: penjumlahan -> perkalian -> pangkat -> unary -> fungsi.
function calculate(input) {
  const tokens = tokenize(input);
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function consume(value) {
    if (peek() && peek().value === value) {
      position += 1;
      return true;
    }
    return false;
  }

  function parseExpression() {
    let value = parseTerm();

    while (peek() && (peek().value === "+" || peek().value === "-")) {
      const operator = tokens[position++].value;
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  function parseTerm() {
    let value = parseUnary();

    while (peek() && ["*", "/", "%"].includes(peek().value)) {
      const operator = tokens[position++].value;
      const right = parseUnary();

      if ((operator === "/" || operator === "%") && right === 0) {
        throw new Error("Tidak bisa membagi dengan nol.");
      }

      if (operator === "*") value *= right;
      if (operator === "/") value /= right;
      if (operator === "%") value %= right;
    }

    return value;
  }

  function parseUnary() {
    if (consume("+")) return parseUnary();
    if (consume("-")) return -parseUnary();
    return parsePower();
  }

  function parsePower() {
    let value = parsePostfix();

    // Pangkat dibuat right-associative: 2^3^2 = 2^(3^2).
    if (consume("^")) {
      value = Math.pow(value, parseUnary());
    }

    return value;
  }

  function parsePostfix() {
    let value = parsePrimary();

    while (consume("!")) {
      value = factorial(value);
    }

    return value;
  }

  function parsePrimary() {
    const token = peek();

    if (!token) throw new Error("Ekspresi belum lengkap.");

    if (consume("(")) {
      const value = parseExpression();
      if (!consume(")")) throw new Error("Tanda kurung belum lengkap.");
      return value;
    }

    if (token.type === "number") {
      position += 1;
      return token.value;
    }

    if (token.type === "identifier") {
      position += 1;
      const name = token.value;

      if (name === "PI") return Math.PI;
      if (name === "E") return Math.E;
      if (name === "ANS") return lastAnswer;

      if (!consume("(")) {
        throw new Error("Fungsi harus diikuti tanda kurung.");
      }

      const argument = parseExpression();
      if (!consume(")")) throw new Error("Tanda kurung fungsi belum lengkap.");

      return applyFunction(name, argument);
    }

    throw new Error("Ekspresi tidak valid.");
  }

  const result = parseExpression();

  if (position < tokens.length) {
    throw new Error("Periksa kembali operator atau tanda kurung.");
  }

  if (!Number.isFinite(result)) {
    throw new Error("Hasil di luar rentang angka yang didukung.");
  }

  return result;
}

function factorial(number) {
  if (number < 0 || !Number.isInteger(number)) {
    throw new Error("Faktorial hanya menerima bilangan bulat nonnegatif.");
  }
  if (number > 170) {
    throw new Error("Angka terlalu besar untuk faktorial.");
  }

  let result = 1;
  for (let i = 2; i <= number; i += 1) {
    result *= i;
  }
  return result;
}

function applyFunction(name, value) {
  const angle = angleMode === "DEG" ? value * Math.PI / 180 : value;

  switch (name) {
    case "SIN": return Math.sin(angle);
    case "COS": return Math.cos(angle);
    case "TAN":
      if (Math.abs(Math.cos(angle)) < 1e-12) {
        throw new Error("Tan tidak terdefinisi untuk sudut ini.");
      }
      return Math.tan(angle);
    case "SQRT":
      if (value < 0) throw new Error("Akar kuadrat bilangan negatif tidak real.");
      return Math.sqrt(value);
    case "LN":
      if (value <= 0) throw new Error("ln hanya menerima angka lebih dari nol.");
      return Math.log(value);
    case "LOG":
      if (value <= 0) throw new Error("log hanya menerima angka lebih dari nol.");
      return Math.log10(value);
    default:
      throw new Error("Fungsi tidak dikenal.");
  }
}

function calculateAndSave() {
  if (!expression.trim()) {
    setMessage("Masukkan ekspresi terlebih dahulu.", true);
    return;
  }

  try {
    const value = calculate(expression);
    const formatted = formatNumber(value);
    lastAnswer = value;
    resultElement.textContent = formatted;
    resultElement.dataset.completed = "true";
    setMessage("Perhitungan berhasil.");
    addHistory(expression, formatted);
  } catch (error) {
    resultElement.textContent = "Error";
    resultElement.dataset.completed = "false";
    setMessage(error.message || "Ekspresi tidak valid.", true);
  }
}

function addHistory(originalExpression, answer) {
  history.unshift({ expression: originalExpression, answer });
  history = history.slice(0, 8);
  renderHistory();
}

function renderHistory() {
  historyList.replaceChildren();

  if (history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-history";
    empty.textContent = "Belum ada perhitungan. Hasilmu akan muncul di sini.";
    historyList.appendChild(empty);
    return;
  }

  history.forEach((item) => {
    const row = document.createElement("article");
    row.className = "history-item";

    const details = document.createElement("div");
    details.className = "history-details";

    const oldExpression = document.createElement("div");
    oldExpression.className = "history-expression";
    oldExpression.textContent = item.expression;

    const oldResult = document.createElement("div");
    oldResult.className = "history-result";
    oldResult.textContent = "= " + item.answer;

    const useButton = document.createElement("button");
    useButton.className = "history-use";
    useButton.type = "button";
    useButton.textContent = "GUNAKAN";
    useButton.addEventListener("click", () => {
      expression = item.expression;
      resultElement.dataset.completed = "false";
      updateDisplay();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    details.append(oldExpression, oldResult);
    row.append(details, useButton);
    historyList.appendChild(row);
  });
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { value, action } = button.dataset;

  if (action === "clear") clearAll();
  else if (action === "backspace") backspace();
  else if (action === "sign") toggleSign();
  else if (action === "calculate") calculateAndSave();
  else if (value) appendValue(value);
});

function setAngleMode(mode) {
  angleMode = mode;
  degModeButton.classList.toggle("active", mode === "DEG");
  radModeButton.classList.toggle("active", mode === "RAD");
  degModeButton.setAttribute("aria-pressed", String(mode === "DEG"));
  radModeButton.setAttribute("aria-pressed", String(mode === "RAD"));
  updateDisplay();
}

degModeButton.addEventListener("click", () => setAngleMode("DEG"));
radModeButton.addEventListener("click", () => setAngleMode("RAD"));

document.getElementById("clearHistory").addEventListener("click", () => {
  history = [];
  renderHistory();
});

document.getElementById("copyButton").addEventListener("click", async () => {
  const text = resultElement.textContent;

  if (!text || text === "—" || text === "Error") {
    setMessage("Tidak ada hasil yang bisa disalin.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setMessage("Hasil disalin ke clipboard.");
  } catch (error) {
    setMessage("Clipboard tidak tersedia di browser ini.", true);
  }
});

// Dukungan keyboard untuk input lebih cepat.
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (/^[0-9.]$/.test(event.key)) {
    appendValue(event.key);
  } else if (event.key === "+") {
    appendValue("+");
  } else if (event.key === "-") {
    appendValue("−");
  } else if (event.key === "*") {
    appendValue("×");
  } else if (event.key === "/") {
    event.preventDefault();
    appendValue("÷");
  } else if (event.key === "(" || event.key === ")") {
    appendValue(event.key);
  } else if (event.key === "^") {
    appendValue("^");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculateAndSave();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Escape") {
    clearAll();
  }
});

updateDisplay();
renderHistory();
