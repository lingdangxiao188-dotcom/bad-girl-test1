// 全局变量
let currentQuestionIndex = 0;
let userAnswers = [];
let painPointStats = {};

// 初始化卡点统计
function initPainPointStats() {
    const painPoints = [
        '职场内耗', '职场边界', '人际边界', 
        '决策拖延', '情绪内耗', '情绪受控'
    ];
    
    painPoints.forEach(point => {
        painPointStats[point] = 0;
    });
}

// 开始测试
function startTest() {
    // 隐藏封面页，显示测试页
    document.getElementById('cover-page').classList.remove('active');
    document.getElementById('test-page').classList.add('active');
    
    // 初始化
    initPainPointStats();
    showQuestion(currentQuestionIndex);
}

// 显示问题
function showQuestion(index) {
    if (!questions || !questions[index]) {
        console.error('题目数据未加载');
        return;
    }
    
    const question = questions[index];
    
    // 更新进度
    document.getElementById('current-question').textContent = index + 1;
    document.querySelector('.progress-fill').style.width = `${((index + 1) / questions.length) * 100}%`;
    
    // 更新题目
    document.getElementById('question-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.text;
    
    // 清空选项容器
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // 添加选项
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        
        optionDiv.addEventListener('click', () => selectOption(optionIndex, question.painPoint));
        
        optionsContainer.appendChild(optionDiv);
    });
}

// 选择选项
function selectOption(optionIndex, painPoint) {
    // 记录答案
    userAnswers.push({
        questionId: currentQuestionIndex + 1,
        selectedOption: optionIndex,
        painPoint: painPoint
    });
    
    // 更新卡点统计
    if (optionIndex < 3) { // A、B、C 是卡点选项
        if (painPointStats[painPoint] !== undefined) {
            painPointStats[painPoint]++;
        }
    }
    
    // 添加选中效果
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[optionIndex].classList.add('selected');
    
    // 延迟后进入下一题
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    }, 300);
}

// 显示结果
function showResults() {
    document.getElementById('test-page').classList.remove('active');
    document.getElementById('result-page').classList.add('active');
    
    // 这里可以添加结果页的逻辑
    alert('测试完成！共回答了 ' + userAnswers.length + ' 道题');
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
});
