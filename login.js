// دالة لتشفير كلمة المرور SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  
  // الحسابات المسموح بها
  const users = [
    { username: "ahmed sami", role: "مدير", passwordHash: "1710da6f2dd392b94f9782eaad97f5d11f237095a26dea899f2dde533989b83d" },
    { username: "ridha ahmed", role: "موظف", passwordHash: "e4bb6f17027822f20b036d8ae181c95fa967962082e632f777d16adb9a76f7c1" } 
  ];
  
  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
  
    const enteredHash = await hashPassword(password);
    const foundUser = users.find(u => u.username.toLowerCase() === username && u.passwordHash === enteredHash);
  
    if (foundUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", foundUser.username);
      localStorage.setItem("role", foundUser.role);
      window.location.href = "/admin.html";
    } else {
      errorMsg.textContent = "❌ اسم المستخدم أو كلمة المرور غير صحيحة";
    }
  });
  