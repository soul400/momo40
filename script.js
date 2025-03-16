// إعدادات النظام
const config = {
    totalNumbers: 40, // يمكن تغييرها إلى 20 إذا كنت تريد 20 رقمًا
    totalPlayers: 4   // يمكن تغييرها إلى 2 إذا كنت تريد مشتركين فقط
};

// تحميل الأرقام الديناميكية
const numbersGrid = document.getElementById('numbers-grid');
for (let i = 1; i <= config.totalNumbers; i++) {
    const numberDiv = document.createElement('div');
    numberDiv.textContent = i;
    numberDiv.addEventListener('click', () => {
        if (!numberDiv.classList.contains('disabled')) {
            showQuestion(i);
        }
    });
    numbersGrid.appendChild(numberDiv);
}

// تحميل المشتركين الديناميكيين
const playersBoard = document.getElementById('players-board');
for (let i = 0; i < config.totalPlayers; i++) {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.innerHTML = `
        <input type="text" class="player-name" placeholder="اسم المشترك">
        <input type="number" class="score" value="0">
    `;
    playersBoard.appendChild(playerDiv);
}

// عرض نافذة السؤال
function showQuestion(number) {
    const questionModal = document.getElementById('question-modal');
    const questionImage = document.getElementById('question-image');
    questionImage.src = `questions/${number}.png`;
    questionImage.style.maxWidth = '100%'; // ضبط حجم الصورة
    questionImage.style.height = 'auto';
    questionModal.style.display = 'flex';

    // بدء العد التنازلي
    let timeLeft = 15;
    const timerCircle = document.getElementById('timer-circle');
    const countdown = setInterval(() => {
        timeLeft--;
        timerCircle.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(countdown);
            showAnswer();
        }
    }, 1000);

    // تعطيل الرقم المختار
    const selectedNumber = document.querySelector(`#numbers-grid div:nth-child(${number})`);
    selectedNumber.classList.add('selected', 'disabled');
    selectedNumber.style.backgroundColor = 'black';
    selectedNumber.style.color = 'white';
    selectedNumber.style.cursor = 'not-allowed';
}

// عرض نافذة الإجابة
function showAnswer() {
    const questionModal = document.getElementById('question-modal');
    const answerModal = document.getElementById('answer-modal');
    const answerImage = document.getElementById('answer-image');
    const currentNumber = parseInt(document.querySelector('#numbers-grid .selected').textContent);
    answerImage.src = `answers/${currentNumber}.png`;
    answerImage.style.maxWidth = '100%'; // ضبط حجم الصورة
    answerImage.style.height = 'auto';

    // إخفاء نافذة السؤال وإظهار نافذة الإجابة
    questionModal.style.display = 'none';
    answerModal.style.display = 'flex';
}

// تحديث الترتيب التلقائي للمتسابقين
function updateRanking() {
    const players = Array.from(document.querySelectorAll('.player')).map(player => ({
        name: player.querySelector('.player-name').value,
        score: parseInt(player.querySelector('.score').value)
    }));

    // ترتيب المتسابقين بناءً على النقاط
    players.sort((a, b) => b.score - a.score);

    // تحديث لوحة المشتركين
    const playersBoard = document.getElementById('players-board');
    playersBoard.innerHTML = ''; // مسح اللوحة الحالية

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.innerHTML = `
            <input type="text" class="player-name" value="${player.name}">
            <input type="number" class="score" value="${player.score}">
        `;
        playersBoard.appendChild(playerDiv);
    });
}

// التعامل مع الإجابة الصحيحة
document.getElementById('correct-answer-btn').addEventListener('click', () => {
    const correctSound = document.getElementById('correct-sound');
    correctSound.play();

    // إنشاء نافذة dialog لاختيار اسم المتسابق
    const dialog = document.createElement('dialog');
    const title = document.createElement('p');
    title.textContent = 'اختر اسم المتسابق:';
    dialog.appendChild(title);

    // إضافة زر لكل مشترك
    const playerNameOptions = Array.from(document.querySelectorAll('.player-name'));
    playerNameOptions.forEach(playerNameElement => {
        const playerName = playerNameElement.value;
        const button = document.createElement('button');
        button.textContent = playerName;
        button.style.display = 'block';
        button.style.margin = '10px auto';
        button.style.backgroundColor = 'gold';
        button.style.color = 'black';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';

        // عند الضغط على الزر، يتم إضافة النقاط وإغلاق النافذة
        button.addEventListener('click', () => {
            const playerScoreInput = playerNameElement.nextElementSibling;
            if (playerScoreInput) {
                playerScoreInput.value = parseInt(playerScoreInput.value) + 10;

                // تحديث الترتيب
                updateRanking();

                // إضافة رسالة تأكيد
                alert(`تمت إضافة 10 نقاط إلى ${playerName}`);
            }

            // إغلاق النافذة وإعادة تعيين الرقم المختار
            dialog.close();
            closeModal();
            resetSelectedNumber();
        });

        dialog.appendChild(button);
    });

    // إضافة النافذة إلى الصفحة
    document.body.appendChild(dialog);
    dialog.showModal();
});

// التعامل مع الإجابة الخطأ
document.getElementById('wrong-answer-btn').addEventListener('click', () => {
    const wrongSound = document.getElementById('wrong-sound');
    wrongSound.play();

    // إضافة رسالة تأكيد
    alert('لم يتم إضافة أو خصم أي نقاط.');

    closeModal();
});

// التعامل مع زر العودة إلى اللائحة الرئيسية
document.getElementById('back-to-main-btn').addEventListener('click', () => {
    closeModal();
});

// إعادة تعيين الرقم المختار
function resetSelectedNumber() {
    const selectedNumbers = document.querySelectorAll('#numbers-grid div.selected');
    selectedNumbers.forEach(number => number.classList.remove('selected'));
}

// إغلاق النوافذ المنبثقة
function closeModal() {
    document.getElementById('question-modal').style.display = 'none';
    document.getElementById('answer-modal').style.display = 'none';
}