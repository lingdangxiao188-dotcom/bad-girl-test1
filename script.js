// 全局变量
let currentQuestionIndex = 0;
let userAnswers = [];
let painPointStats = {};

// DOM 元素
const coverPage = document.getElementById('cover-page');
const testPage = document.getElementById('test-page');
const resultPage = document.getElementById('result-page');
const paymentModal = document.getElementById('payment-modal');

const startTestBtn = document.getElementById('start-test');
const currentQuestionEl = document.getElementById('current-question');
const questionTextEl = document.getElementById('question-text');
const questionCategoryEl = document.getElementById('question-category');
const optionsContainerEl = document.getElementById('options-container');
const progressFillEl = document.querySelector('.progress-fill');
const painPointsEl = document.getElementById('pain-points');
const modelsPreviewEl = document.getElementById('models-preview');
const upgradeBtn = document.getElementById('upgrade-btn');
const closeModalBtn = document.querySelector('.close-modal');
const confirmPaymentBtn = document.getElementById('confirm-payment');
const loading = document.getElementById('loading');

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

// 显示问题
function showQuestion(index) {
    if (!questions[index]) {
        console.error(`Question ${index} not found`);
        return;
    }
    
    const question = questions[index];
    
    // 更新进度
    currentQuestionEl.textContent = index + 1;
    progressFillEl.style.width = `${((index + 1) / questions.length) * 100}%`;
    
    // 更新题目
    questionCategoryEl.textContent = question.category;
    questionTextEl.textContent = question.text;
    
    // 清空选项容器
    optionsContainerEl.innerHTML = '';
    
    // 添加选项
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.index = optionIndex;
        optionDiv.dataset.label = String.fromCharCode(65 + optionIndex);
        
        const optionText = document.createElement('div');
        optionText.className = 'option-text';
        optionText.textContent = option;
        
        optionDiv.appendChild(optionText);
        
        // 添加点击事件
        optionDiv.addEventListener('click', () => selectOption(optionIndex, question.painPoint));
        
        optionsContainerEl.appendChild(optionDiv);
    });
    
    // 添加动画
    optionsContainerEl.style.animation = 'none';
    setTimeout(() => {
        optionsContainerEl.style.animation = 'slideIn 0.5s ease';
    }, 10);
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
            // 测试完成，显示结果
            showResults();
        }
    }, 300);
}

// 显示结果页
function showResults() {
    // 计算前3个卡点
    const sortedPainPoints = Object.entries(painPointStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    // 生成卡点HTML
    let painPointsHTML = '';
    sortedPainPoints.forEach(([painPoint, count], index) => {
        const category = painPointCategories[painPoint];
        if (category) {
            painPointsHTML += `
                <div class="pain-point" style="animation-delay: ${index * 0.1}s">
                    <div class="pain-point-header">
                        <i class="${category.icon}"></i>
                        <h4 class="pain-point-title">${painPoint}</h4>
                    </div>
                    <p class="pain-point-description">${category.description}</p>
                </div>
            `;
        }
    });
    
    painPointsEl.innerHTML = painPointsHTML || '<p>没有检测到明显的卡点，恭喜你！</p>';
    
    // 生成模型预览
    let modelsHTML = '';
    sortedPainPoints.forEach(([painPoint], index) => {
        const model = modelPreviews[painPoint];
        if (model) {
            modelsHTML += `
                <div class="model-preview" style="animation-delay: ${0.3 + index * 0.1}s">
                    <div class="model-header">
                        <i class="fas fa-puzzle-piece"></i>
                        <h4 class="model-title">${model.name}</h4>
                    </div>
                    <p class="model-scenario"><i class="fas fa-scroll"></i> 适用场景：${model.scenario}</p>
                    <div class="model-content">
                        <div class="model-row">
                            <div class="model-label">你的常见反应</div>
                            <div class="model-value">${model.commonMistake}</div>
                        </div>
                        <div class="model-row">
                            <div class="model-label">模型判断方向</div>
                            <div class="model-value">${model.correctThinking}</div>
                        </div>
                    </div>
                    <p class="model-hook">🔮 ${model.hook}</p>
                </div>
            `;
        }
    });
    
    modelsPreviewEl.innerHTML = modelsHTML || '<p>你的思维模式已经很健康了！</p>';
    
    // 切换页面
    coverPage.classList.remove('active');
    testPage.classList.remove('active');
    resultPage.classList.add('active');
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 事件监听
startTestBtn.addEventListener('click', () => {
    coverPage.classList.remove('active');
    testPage.classList.add('active');
    initPainPointStats();
    showQuestion(currentQuestionIndex);
});

upgradeBtn.addEventListener('click', () => {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeModalBtn.addEventListener('click', () => {
    paymentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// 支付确认按钮
confirmPaymentBtn.addEventListener('click', () => {
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!agreeTerms) {
        alert('请先阅读并同意用户协议和退款政策');
        return;
    }
    
    // 模拟支付过程
    confirmPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>支付处理中...</span>';
    confirmPaymentBtn.disabled = true;
    
    // 这里应该调用你的实际支付接口
    setTimeout(() => {https://xhslink.com/m/o0SSSMONag
        alert('支付成功！感谢购买《不好惹女孩的50个思维模型》完整版。\n\n请在微信中查看订单详情。');
        
        // 3秒后关闭弹窗
        setTimeout(() => {
            paymentModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            confirmPaymentBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span>确认支付 99 元</span>';
            confirmPaymentBtn.disabled = false;
        }, 3000);
    }, 2000);
});

// 分享功能
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.classList.contains('wechat') ? '微信好友' : '朋友圈';
        alert(`已复制分享链接，可以粘贴到${type}分享\n\n分享文案：\n我刚做了不好惹女孩的卡点测试，结果太准了！你也来测测自己在职场/关系中容易吃亏的地方吧～`);
        
        // 复制分享链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
            .then(() => console.log('链接已复制'))
            .catch(err => console.log('复制失败:', err));
    });
});

// 防止页面滚动
function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// 移动端触摸优化
let startY = 0;
document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    
    // 在模态框打开时禁止背景滚动
    if (paymentModal.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 模拟加载完成
    setTimeout(() => {
        loading.classList.remove('active');
    }, 1000);
    
    // 初始化
    initPainPointStats();
    
    // 更新用户数（模拟增长）
    setInterval(() => {
        const countEl = document.getElementById('user-count');
        if (countEl) {
            let count = parseInt(countEl.textContent.replace(',', '')) || 2843;
            count += Math.floor(Math.random() * 3);
            countEl.textContent = count.toLocaleString();
        }
    }, 30000); // 每30秒更新一次
});

// 页面离开提示
window.addEventListener('beforeunload', (e) => {
    if (currentQuestionIndex > 0 && currentQuestionIndex < questions.length) {
        e.preventDefault();
        e.returnValue = '测试还未完成，确定要离开吗？';
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
    alert('抱歉，页面出现了一些问题，请刷新重试。');
});

// 离线支持
window.addEventListener('online', () => {
    console.log('网络已恢复');
});

window.addEventListener('offline', () => {
    console.log('网络已断开');
});
