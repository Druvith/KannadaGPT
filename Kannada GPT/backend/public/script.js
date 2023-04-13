document.getElementById("promptForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const language = detectLanguage(prompt);
  
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, language }),
    });
  
    const data = await response.json();
    document.getElementById("generatedText").innerText = data.response;
  
    document.getElementById("promptForm").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
  });
  
  document.getElementById("newPrompt").addEventListener("click", () => {
    document.getElementById("promptForm").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
  });
  
  function detectLanguage(prompt) {
    // Replace this function with a more accurate language detection method if needed
    const englishCharacters = /[a-zA-Z]/;
    return englishCharacters.test(prompt) ? "en" : "kn";
  }
  
  async function testBackend() {
    try {
      const response = await fetch("http://localhost:3000/api/test");
      const data = await response.text();
      console.log("Backend test:", data);
    } catch (error) {
      console.error("Error testing backend:", error);
    }
  }
  
  testBackend();
  