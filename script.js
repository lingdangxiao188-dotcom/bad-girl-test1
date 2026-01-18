{\rtf1\ansi\ansicpg936\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset134 PingFangSC-Regular;\f2\fnil\fcharset0 AppleColorEmoji;
}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww29200\viewh18400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // 
\f1 \'c8\'ab\'be\'d6\'b1\'e4\'c1\'bf
\f0 \
let currentQuestionIndex = 0;\
let userAnswers = [];\
let painPointStats = \{\};\
\
// DOM 
\f1 \'d4\'aa\'cb\'d8
\f0 \
const coverPage = document.getElementById('cover-page');\
const testPage = document.getElementById('test-page');\
const resultPage = document.getElementById('result-page');\
const paymentModal = document.getElementById('payment-modal');\
\
const startTestBtn = document.getElementById('start-test');\
const currentQuestionEl = document.getElementById('current-question');\
const questionTextEl = document.getElementById('question-text');\
const questionCategoryEl = document.getElementById('question-category');\
const optionsContainerEl = document.getElementById('options-container');\
const progressFillEl = document.querySelector('.progress-fill');\
const painPointsEl = document.getElementById('pain-points');\
const modelsPreviewEl = document.getElementById('models-preview');\
const upgradeBtn = document.getElementById('upgrade-btn');\
const closeModalBtn = document.querySelector('.close-modal');\
const confirmPaymentBtn = document.getElementById('confirm-payment');\
const loading = document.getElementById('loading');\
\
// 
\f1 \'b3\'f5\'ca\'bc\'bb\'af\'bf\'a8\'b5\'e3\'cd\'b3\'bc\'c6
\f0 \
function initPainPointStats() \{\
    const painPoints = [\
        '
\f1 \'d6\'b0\'b3\'a1\'c4\'da\'ba\'c4
\f0 ', '
\f1 \'d6\'b0\'b3\'a1\'b1\'df\'bd\'e7
\f0 ', '
\f1 \'c8\'cb\'bc\'ca\'b1\'df\'bd\'e7
\f0 ', \
        '
\f1 \'be\'f6\'b2\'df\'cd\'cf\'d1\'d3
\f0 ', '
\f1 \'c7\'e9\'d0\'f7\'c4\'da\'ba\'c4
\f0 ', '
\f1 \'c7\'e9\'d0\'f7\'ca\'dc\'bf\'d8
\f0 '\
    ];\
    \
    painPoints.forEach(point => \{\
        painPointStats[point] = 0;\
    \});\
\}\
\
// 
\f1 \'cf\'d4\'ca\'be\'ce\'ca\'cc\'e2
\f0 \
function showQuestion(index) \{\
    if (!questions[index]) \{\
        console.error(`Question $\{index\} not found`);\
        return;\
    \}\
    \
    const question = questions[index];\
    \
    // 
\f1 \'b8\'fc\'d0\'c2\'bd\'f8\'b6\'c8
\f0 \
    currentQuestionEl.textContent = index + 1;\
    progressFillEl.style.width = `$\{((index + 1) / questions.length) * 100\}%`;\
    \
    // 
\f1 \'b8\'fc\'d0\'c2\'cc\'e2\'c4\'bf
\f0 \
    questionCategoryEl.textContent = question.category;\
    questionTextEl.textContent = question.text;\
    \
    // 
\f1 \'c7\'e5\'bf\'d5\'d1\'a1\'cf\'ee\'c8\'dd\'c6\'f7
\f0 \
    optionsContainerEl.innerHTML = '';\
    \
    // 
\f1 \'cc\'ed\'bc\'d3\'d1\'a1\'cf\'ee
\f0 \
    question.options.forEach((option, optionIndex) => \{\
        const optionDiv = document.createElement('div');\
        optionDiv.className = 'option';\
        optionDiv.dataset.index = optionIndex;\
        optionDiv.dataset.label = String.fromCharCode(65 + optionIndex);\
        \
        const optionText = document.createElement('div');\
        optionText.className = 'option-text';\
        optionText.textContent = option;\
        \
        optionDiv.appendChild(optionText);\
        \
        // 
\f1 \'cc\'ed\'bc\'d3\'b5\'e3\'bb\'f7\'ca\'c2\'bc\'fe
\f0 \
        optionDiv.addEventListener('click', () => selectOption(optionIndex, question.painPoint));\
        \
        optionsContainerEl.appendChild(optionDiv);\
    \});\
    \
    // 
\f1 \'cc\'ed\'bc\'d3\'b6\'af\'bb\'ad
\f0 \
    optionsContainerEl.style.animation = 'none';\
    setTimeout(() => \{\
        optionsContainerEl.style.animation = 'slideIn 0.5s ease';\
    \}, 10);\
\}\
\
// 
\f1 \'d1\'a1\'d4\'f1\'d1\'a1\'cf\'ee
\f0 \
function selectOption(optionIndex, painPoint) \{\
    // 
\f1 \'bc\'c7\'c2\'bc\'b4\'f0\'b0\'b8
\f0 \
    userAnswers.push(\{\
        questionId: currentQuestionIndex + 1,\
        selectedOption: optionIndex,\
        painPoint: painPoint\
    \});\
    \
    // 
\f1 \'b8\'fc\'d0\'c2\'bf\'a8\'b5\'e3\'cd\'b3\'bc\'c6
\f0 \
    if (optionIndex < 3) \{ // A
\f1 \'a1\'a2
\f0 B
\f1 \'a1\'a2
\f0 C 
\f1 \'ca\'c7\'bf\'a8\'b5\'e3\'d1\'a1\'cf\'ee
\f0 \
        if (painPointStats[painPoint] !== undefined) \{\
            painPointStats[painPoint]++;\
        \}\
    \}\
    \
    // 
\f1 \'cc\'ed\'bc\'d3\'d1\'a1\'d6\'d0\'d0\'a7\'b9\'fb
\f0 \
    const options = document.querySelectorAll('.option');\
    options.forEach(option => option.classList.remove('selected'));\
    options[optionIndex].classList.add('selected');\
    \
    // 
\f1 \'d1\'d3\'b3\'d9\'ba\'f3\'bd\'f8\'c8\'eb\'cf\'c2\'d2\'bb\'cc\'e2
\f0 \
    setTimeout(() => \{\
        if (currentQuestionIndex < questions.length - 1) \{\
            currentQuestionIndex++;\
            showQuestion(currentQuestionIndex);\
        \} else \{\
            // 
\f1 \'b2\'e2\'ca\'d4\'cd\'ea\'b3\'c9\'a3\'ac\'cf\'d4\'ca\'be\'bd\'e1\'b9\'fb
\f0 \
            showResults();\
        \}\
    \}, 300);\
\}\
\
// 
\f1 \'cf\'d4\'ca\'be\'bd\'e1\'b9\'fb\'d2\'b3
\f0 \
function showResults() \{\
    // 
\f1 \'bc\'c6\'cb\'e3\'c7\'b0
\f0 3
\f1 \'b8\'f6\'bf\'a8\'b5\'e3
\f0 \
    const sortedPainPoints = Object.entries(painPointStats)\
        .sort(([,a], [,b]) => b - a)\
        .slice(0, 3);\
    \
    // 
\f1 \'c9\'fa\'b3\'c9\'bf\'a8\'b5\'e3
\f0 HTML\
    let painPointsHTML = '';\
    sortedPainPoints.forEach(([painPoint, count], index) => \{\
        const category = painPointCategories[painPoint];\
        if (category) \{\
            painPointsHTML += `\
                <div class="pain-point" style="animation-delay: $\{index * 0.1\}s">\
                    <div class="pain-point-header">\
                        <i class="$\{category.icon\}"></i>\
                        <h4 class="pain-point-title">$\{painPoint\}</h4>\
                    </div>\
                    <p class="pain-point-description">$\{category.description\}</p>\
                </div>\
            `;\
        \}\
    \});\
    \
    painPointsEl.innerHTML = painPointsHTML || '<p>
\f1 \'c3\'bb\'d3\'d0\'bc\'ec\'b2\'e2\'b5\'bd\'c3\'f7\'cf\'d4\'b5\'c4\'bf\'a8\'b5\'e3\'a3\'ac\'b9\'a7\'cf\'b2\'c4\'e3\'a3\'a1
\f0 </p>';\
    \
    // 
\f1 \'c9\'fa\'b3\'c9\'c4\'a3\'d0\'cd\'d4\'a4\'c0\'c0
\f0 \
    let modelsHTML = '';\
    sortedPainPoints.forEach(([painPoint], index) => \{\
        const model = modelPreviews[painPoint];\
        if (model) \{\
            modelsHTML += `\
                <div class="model-preview" style="animation-delay: $\{0.3 + index * 0.1\}s">\
                    <div class="model-header">\
                        <i class="fas fa-puzzle-piece"></i>\
                        <h4 class="model-title">$\{model.name\}</h4>\
                    </div>\
                    <p class="model-scenario"><i class="fas fa-scroll"></i> 
\f1 \'ca\'ca\'d3\'c3\'b3\'a1\'be\'b0\'a3\'ba
\f0 $\{model.scenario\}</p>\
                    <div class="model-content">\
                        <div class="model-row">\
                            <div class="model-label">
\f1 \'c4\'e3\'b5\'c4\'b3\'a3\'bc\'fb\'b7\'b4\'d3\'a6
\f0 </div>\
                            <div class="model-value">$\{model.commonMistake\}</div>\
                        </div>\
                        <div class="model-row">\
                            <div class="model-label">
\f1 \'c4\'a3\'d0\'cd\'c5\'d0\'b6\'cf\'b7\'bd\'cf\'f2
\f0 </div>\
                            <div class="model-value">$\{model.correctThinking\}</div>\
                        </div>\
                    </div>\
                    <p class="model-hook">
\f2 \uc0\u55357 \u56622 
\f0  $\{model.hook\}</p>\
                </div>\
            `;\
        \}\
    \});\
    \
    modelsPreviewEl.innerHTML = modelsHTML || '<p>
\f1 \'c4\'e3\'b5\'c4\'cb\'bc\'ce\'ac\'c4\'a3\'ca\'bd\'d2\'d1\'be\'ad\'ba\'dc\'bd\'a1\'bf\'b5\'c1\'cb\'a3\'a1
\f0 </p>';\
    \
    // 
\f1 \'c7\'d0\'bb\'bb\'d2\'b3\'c3\'e6
\f0 \
    coverPage.classList.remove('active');\
    testPage.classList.remove('active');\
    resultPage.classList.add('active');\
    \
    // 
\f1 \'b9\'f6\'b6\'af\'b5\'bd\'b6\'a5\'b2\'bf
\f0 \
    window.scrollTo(0, 0);\
\}\
\
// 
\f1 \'ca\'c2\'bc\'fe\'bc\'e0\'cc\'fd
\f0 \
startTestBtn.addEventListener('click', () => \{\
    coverPage.classList.remove('active');\
    testPage.classList.add('active');\
    initPainPointStats();\
    showQuestion(currentQuestionIndex);\
\});\
\
upgradeBtn.addEventListener('click', () => \{\
    paymentModal.classList.add('active');\
    document.body.style.overflow = 'hidden';\
\});\
\
closeModalBtn.addEventListener('click', () => \{\
    paymentModal.classList.remove('active');\
    document.body.style.overflow = 'auto';\
\});\
\
// 
\f1 \'b5\'e3\'bb\'f7\'c4\'a3\'cc\'ac\'bf\'f2\'cd\'e2\'b2\'bf\'b9\'d8\'b1\'d5
\f0 \
window.addEventListener('click', (e) => \{\
    if (e.target === paymentModal) \{\
        paymentModal.classList.remove('active');\
        document.body.style.overflow = 'auto';\
    \}\
\});\
\
// 
\f1 \'d6\'a7\'b8\'b6\'c8\'b7\'c8\'cf\'b0\'b4\'c5\'a5
\f0 \
confirmPaymentBtn.addEventListener('click', () => \{\
    const agreeTerms = document.getElementById('agree-terms').checked;\
    \
    if (!agreeTerms) \{\
        alert('
\f1 \'c7\'eb\'cf\'c8\'d4\'c4\'b6\'c1\'b2\'a2\'cd\'ac\'d2\'e2\'d3\'c3\'bb\'a7\'d0\'ad\'d2\'e9\'ba\'cd\'cd\'cb\'bf\'ee\'d5\'fe\'b2\'df
\f0 ');\
        return;\
    \}\
    \
    // 
\f1 \'c4\'a3\'c4\'e2\'d6\'a7\'b8\'b6\'b9\'fd\'b3\'cc
\f0 \
    confirmPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>
\f1 \'d6\'a7\'b8\'b6\'b4\'a6\'c0\'ed\'d6\'d0
\f0 ...</span>';\
    confirmPaymentBtn.disabled = true;\
    \
    // 
\f1 \'d5\'e2\'c0\'ef\'d3\'a6\'b8\'c3\'b5\'f7\'d3\'c3\'c4\'e3\'b5\'c4\'ca\'b5\'bc\'ca\'d6\'a7\'b8\'b6\'bd\'d3\'bf\'da
\f0 \
    setTimeout(() => \{https://xhslink.com/m/o0SSSMONag\
        alert('
\f1 \'d6\'a7\'b8\'b6\'b3\'c9\'b9\'a6\'a3\'a1\'b8\'d0\'d0\'bb\'b9\'ba\'c2\'f2\'a1\'b6\'b2\'bb\'ba\'c3\'c8\'c7\'c5\'ae\'ba\'a2\'b5\'c4
\f0 50
\f1 \'b8\'f6\'cb\'bc\'ce\'ac\'c4\'a3\'d0\'cd\'a1\'b7\'cd\'ea\'d5\'fb\'b0\'e6\'a1\'a3
\f0 \\n\\n
\f1 \'c7\'eb\'d4\'da\'ce\'a2\'d0\'c5\'d6\'d0\'b2\'e9\'bf\'b4\'b6\'a9\'b5\'a5\'cf\'ea\'c7\'e9\'a1\'a3
\f0 ');\
        \
        // 3
\f1 \'c3\'eb\'ba\'f3\'b9\'d8\'b1\'d5\'b5\'af\'b4\'b0
\f0 \
        setTimeout(() => \{\
            paymentModal.classList.remove('active');\
            document.body.style.overflow = 'auto';\
            confirmPaymentBtn.innerHTML = '<i class="fas fa-shopping-cart"></i><span>
\f1 \'c8\'b7\'c8\'cf\'d6\'a7\'b8\'b6
\f0  99 
\f1 \'d4\'aa
\f0 </span>';\
            confirmPaymentBtn.disabled = false;\
        \}, 3000);\
    \}, 2000);\
\});\
\
// 
\f1 \'b7\'d6\'cf\'ed\'b9\'a6\'c4\'dc
\f0 \
document.querySelectorAll('.share-btn').forEach(btn => \{\
    btn.addEventListener('click', function() \{\
        const type = this.classList.contains('wechat') ? '
\f1 \'ce\'a2\'d0\'c5\'ba\'c3\'d3\'d1
\f0 ' : '
\f1 \'c5\'f3\'d3\'d1\'c8\'a6
\f0 ';\
        alert(`
\f1 \'d2\'d1\'b8\'b4\'d6\'c6\'b7\'d6\'cf\'ed\'c1\'b4\'bd\'d3\'a3\'ac\'bf\'c9\'d2\'d4\'d5\'b3\'cc\'f9\'b5\'bd
\f0 $\{type\}
\f1 \'b7\'d6\'cf\'ed
\f0 \\n\\n
\f1 \'b7\'d6\'cf\'ed\'ce\'c4\'b0\'b8\'a3\'ba
\f0 \\n
\f1 \'ce\'d2\'b8\'d5\'d7\'f6\'c1\'cb\'b2\'bb\'ba\'c3\'c8\'c7\'c5\'ae\'ba\'a2\'b5\'c4\'bf\'a8\'b5\'e3\'b2\'e2\'ca\'d4\'a3\'ac\'bd\'e1\'b9\'fb\'cc\'ab\'d7\'bc\'c1\'cb\'a3\'a1\'c4\'e3\'d2\'b2\'c0\'b4\'b2\'e2\'b2\'e2\'d7\'d4\'bc\'ba\'d4\'da\'d6\'b0\'b3\'a1
\f0 /
\f1 \'b9\'d8\'cf\'b5\'d6\'d0\'c8\'dd\'d2\'d7\'b3\'d4\'bf\'f7\'b5\'c4\'b5\'d8\'b7\'bd\'b0\'c9\'a1\'ab
\f0 `);\
        \
        // 
\f1 \'b8\'b4\'d6\'c6\'b7\'d6\'cf\'ed\'c1\'b4\'bd\'d3\'b5\'bd\'bc\'f4\'cc\'f9\'b0\'e5
\f0 \
        navigator.clipboard.writeText(window.location.href)\
            .then(() => console.log('
\f1 \'c1\'b4\'bd\'d3\'d2\'d1\'b8\'b4\'d6\'c6
\f0 '))\
            .catch(err => console.log('
\f1 \'b8\'b4\'d6\'c6\'ca\'a7\'b0\'dc
\f0 :', err));\
    \});\
\});\
\
// 
\f1 \'b7\'c0\'d6\'b9\'d2\'b3\'c3\'e6\'b9\'f6\'b6\'af
\f0 \
function preventScroll(e) \{\
    e.preventDefault();\
    e.stopPropagation();\
    return false;\
\}\
\
// 
\f1 \'d2\'c6\'b6\'af\'b6\'cb\'b4\'a5\'c3\'fe\'d3\'c5\'bb\'af
\f0 \
let startY = 0;\
document.addEventListener('touchstart', e => \{\
    startY = e.touches[0].clientY;\
\}, \{ passive: true \});\
\
document.addEventListener('touchmove', e => \{\
    const currentY = e.touches[0].clientY;\
    const diff = startY - currentY;\
    \
    // 
\f1 \'d4\'da\'c4\'a3\'cc\'ac\'bf\'f2\'b4\'f2\'bf\'aa\'ca\'b1\'bd\'fb\'d6\'b9\'b1\'b3\'be\'b0\'b9\'f6\'b6\'af
\f0 \
    if (paymentModal.classList.contains('active')) \{\
        e.preventDefault();\
    \}\
\}, \{ passive: false \});\
\
// 
\f1 \'b3\'f5\'ca\'bc\'bb\'af
\f0 \
document.addEventListener('DOMContentLoaded', () => \{\
    // 
\f1 \'c4\'a3\'c4\'e2\'bc\'d3\'d4\'d8\'cd\'ea\'b3\'c9
\f0 \
    setTimeout(() => \{\
        loading.classList.remove('active');\
    \}, 1000);\
    \
    // 
\f1 \'b3\'f5\'ca\'bc\'bb\'af
\f0 \
    initPainPointStats();\
    \
    // 
\f1 \'b8\'fc\'d0\'c2\'d3\'c3\'bb\'a7\'ca\'fd\'a3\'a8\'c4\'a3\'c4\'e2\'d4\'f6\'b3\'a4\'a3\'a9
\f0 \
    setInterval(() => \{\
        const countEl = document.getElementById('user-count');\
        if (countEl) \{\
            let count = parseInt(countEl.textContent.replace(',', '')) || 2843;\
            count += Math.floor(Math.random() * 3);\
            countEl.textContent = count.toLocaleString();\
        \}\
    \}, 30000); // 
\f1 \'c3\'bf
\f0 30
\f1 \'c3\'eb\'b8\'fc\'d0\'c2\'d2\'bb\'b4\'ce
\f0 \
\});\
\
// 
\f1 \'d2\'b3\'c3\'e6\'c0\'eb\'bf\'aa\'cc\'e1\'ca\'be
\f0 \
window.addEventListener('beforeunload', (e) => \{\
    if (currentQuestionIndex > 0 && currentQuestionIndex < questions.length) \{\
        e.preventDefault();\
        e.returnValue = '
\f1 \'b2\'e2\'ca\'d4\'bb\'b9\'ce\'b4\'cd\'ea\'b3\'c9\'a3\'ac\'c8\'b7\'b6\'a8\'d2\'aa\'c0\'eb\'bf\'aa\'c2\'f0\'a3\'bf
\f0 ';\
    \}\
\});\
\
// 
\f1 \'b4\'ed\'ce\'f3\'b4\'a6\'c0\'ed
\f0 \
window.addEventListener('error', (e) => \{\
    console.error('
\f1 \'d2\'b3\'c3\'e6\'b4\'ed\'ce\'f3
\f0 :', e.error);\
    alert('
\f1 \'b1\'a7\'c7\'b8\'a3\'ac\'d2\'b3\'c3\'e6\'b3\'f6\'cf\'d6\'c1\'cb\'d2\'bb\'d0\'a9\'ce\'ca\'cc\'e2\'a3\'ac\'c7\'eb\'cb\'a2\'d0\'c2\'d6\'d8\'ca\'d4\'a1\'a3
\f0 ');\
\});\
\
// 
\f1 \'c0\'eb\'cf\'df\'d6\'a7\'b3\'d6
\f0 \
window.addEventListener('online', () => \{\
    console.log('
\f1 \'cd\'f8\'c2\'e7\'d2\'d1\'bb\'d6\'b8\'b4
\f0 ');\
\});\
\
window.addEventListener('offline', () => \{\
    console.log('
\f1 \'cd\'f8\'c2\'e7\'d2\'d1\'b6\'cf\'bf\'aa
\f0 ');\
\});}