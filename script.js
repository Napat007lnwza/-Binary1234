let score = 0;
let currentQuestion = 0;
let username = "";

const bgMusic = document.getElementById("bg-music");
const muteBtn = document.getElementById("mute-btn");

const questions = [
  { question: "แปลง 1101 (Binary) เป็น Decimal?", correctAnswer: 13, answers: [10,13,12,15] },
  { question: "แปลง 15 (Decimal) เป็น Binary?", correctAnswer: "1111", answers: ["1010","1111","1001","1101"] },
  { question: "แปลง A (Hexadecimal) เป็น Decimal?", correctAnswer: 10, answers: [8,10,12,16] },
  { question: "แปลง 1010 (Binary) เป็น Hexadecimal?", correctAnswer: "A", answers: ["B","A","C","D"] }
];

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// เริ่มเกม
document.getElementById("start-btn").addEventListener("click", () => {
  const input = document.getElementById("username").value.trim();
  if (!input) return alert("กรุณากรอกชื่อ!");
  username = input;
  showSection("loading-screen");

  bgMusic.play();
  muteBtn.textContent = "🔊"; //

  setTimeout(() => {
    score = 0;
    currentQuestion = 0;
    document.getElementById("score").innerText = score;
    showSection("game-container");
    loadQuestion();
  }, 1500);
});

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn,i) => {
    // รีเซ็ตสีและสถานะปุ่ม
    btn.classList.remove("correct", "incorrect", "disabled"); 
    btn.innerText = q.answers[i];
    btn.onclick = () => checkAnswer(q.answers[i], q.correctAnswer);
   });
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".answer-btn");

  // 1. ปิดการใช้งานปุ่มทั้งหมดทันที
  buttons.forEach(btn => {
    btn.onclick = null;
    btn.classList.add("disabled");
  });
  
  // 2. ตรวจสอบคำตอบและอัปเดตคะแนน
  if (selected == correct) {
    score++; // เพิ่มคะแนน
    // แสดงปุ่มที่ถูก (สีเขียว)
    buttons.forEach(btn => {
      if (btn.innerText == selected) {
        btn.classList.add("correct");
      }
    });
  } else {
    // (แก้ไขแล้ว) ลบ forEach ที่ซ้อนกันออก
    // แสดงปุ่มที่ผิด (สีแดง) และปุ่มที่ถูก (สีเขียว)
    buttons.forEach(btn => {
      if (btn.innerText == selected) {
        btn.classList.add("incorrect");
      }
      if (btn.innerText == correct) {
        btn.classList.add("correct");
      }
    });
  } // <== ปีกกา if/else จบตรงนี้

  // 3. (ย้ายมาไว้ข้างนอก) อัปเดตคะแนนที่แสดงผลเสมอ
  document.getElementById("score").innerText = score;

  // 4. (ย้ายมาไว้ข้างนอก) หน่วงเวลา 1.5 วิ แล้วไปต่อ
  // ส่วนนี้จะทำงานเสมอไม่ว่าจะตอบถูกหรือผิด
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      endGame();
    }
  }, 1500); // 1.5 วินาที
}

function endGame() {
  showSection("result-screen");
  document.getElementById("final-name").innerText = username;
  document.getElementById("final-score").innerText = score + " / " + questions.length;
  saveHighscore(username, score);
  showHighscores();
}

function saveHighscore(name, score) {
  const saved = JSON.parse(localStorage.getItem("highscores")) || [];
  saved.push({ name, score });
  saved.sort((a,b) => b.score - a.score);
  localStorage.setItem("highscores", JSON.stringify(saved.slice(0,5)));
}

// === คัดลอกไป "แทนที่" ฟังก์ชัน showHighscores เดิม ===

function showHighscores() {
  const list = document.getElementById("highscore-list");
  list.innerHTML = "";
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];

  highscores.forEach((entry, i) => {
    const li = document.createElement("li");
    
    let rankDisplay; // ตัวแปรสำหรับเก็บเหรียญหรือตัวเลข

    // 1. 🌟 ตรวจสอบอันดับสำหรับเหรียญ 🌟
    switch (i) {
        case 0:
            rankDisplay = "🥇"; // อันดับ 1
            li.classList.add("rank-gold"); // เพิ่มคลาส CSS
            break;
        case 1:
            rankDisplay = "🥈"; // อันดับ 2
            li.classList.add("rank-silver"); // เพิ่มคลาส CSS
            break;
        case 2:
            rankDisplay = "🥉"; // อันดับ 3
            li.classList.add("rank-bronze"); // เพิ่มคลาส CSS
            break;
        default:
            rankDisplay = `${i + 1}.`; // อันดับ 4, 5
    }
    
    // 2. สร้างข้อความพร้อมเหรียญ
    li.textContent = `${rankDisplay} ${entry.name} — ${entry.score} คะแนน`;
    list.appendChild(li);
  });
}

document.getElementById("play-again-btn").addEventListener("click", () => {
  document.getElementById("username").value = "";
  showSection("name-screen");
});

muteBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    // 🎵 สถานะปัจจุบัน: หยุดอยู่ -> ให้เล่นต่อ
    bgMusic.play(); 
    muteBtn.textContent = "🔊"; // <-- เปลี่ยนเป็น 🔊 (แสดงว่าเพลงกำลังดัง)
  } else {
    // 🔇 สถานะปัจจุบัน: กำลังเล่น -> ให้หยุด
    bgMusic.pause(); 
    muteBtn.textContent = "🔇"; // <-- เปลี่ยนเป็น 🔇 (แสดงว่าเพลงเงียบอยู่)
  }
});
// ... (โค้ด EventListener ของ #play-again-btn) ...
// (โค้ดนี้จะช่วยให้ปุ่มแสดงผลถูกต้อง หากมีการตั้งค่า autoplay ใน HTML)
if (bgMusic.paused) {
  muteBtn.textContent = "🔊";
} else {
  muteBtn.textContent = "🔇";
}