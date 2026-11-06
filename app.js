/* ==========================================================================
   Portfolio Plan Helper - JavaScript Engine
   ========================================================================== */

let currentLang = 'th';
let currentTheme = 'light';
let donutChart = null;
let barChart = null;
let scatterChart = null;
let lineChart = null;

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    calculateRiskAndRecommend();
    updatePortfolioSim();
});

// Tab Switcher (Tabs 1, 2, 3)
function switchTab(tabIndex) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.getElementById(`tabBtn${tabIndex}`).classList.add('active');
    document.getElementById(`tab${tabIndex}`).classList.add('active');
}

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = `${currentTheme}-theme`;
    document.getElementById('themeToggleBtn').innerText = currentTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}

// Language Toggle
function toggleLanguage() {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    document.querySelectorAll('[data-th]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
}

// Tab 1: Risk & ML Recommendation Calculation
function calculateRiskAndRecommend() {
    const q1 = parseInt(document.getElementById('q1').value);
    const q2 = parseInt(document.getElementById('q2').value);
    const q3 = parseInt(document.getElementById('q3').value);
    const q4 = parseInt(document.getElementById('q4').value);
    const q5 = parseInt(document.getElementById('q5').value);

    const totalScore = q1 + q2 + q3 + q4 + q5; // Max 20

    let planName = '';
    let weights = [];
    let mddPct = 0;
    let labelTH = '';
    let labelEN = '';

    if (totalScore <= 8) {
        planName = 'Conservative Plan (เน้นคุ้มครองเงินต้น)';
        weights = [70, 15, 0, 15]; // TBOND, SET, TECH, GOLD
        mddPct = 6.8;
        labelTH = 'แผนนี้เหมาะสำหรับผู้รับความเสี่ยงได้ต่ำ เน้นความปลอดภัยของเงินต้น';
        labelEN = 'Preservation plan suitable for low risk tolerance clients.';
    } else if (totalScore <= 13) {
        planName = 'Balanced Growth Plan (เติบโตปานกลาง)';
        weights = [40, 30, 20, 10];
        mddPct = 18.5;
        labelTH = 'แผนนี้สะสมความมั่งคั่งอย่างสมดุล รับความผันผวนได้ปานกลาง';
        labelEN = 'Balanced plan aiming for steady capital appreciation.';
    } else if (totalScore <= 17) {
        planName = 'High Growth Plan (เน้นเติบโตสูง)';
        weights = [20, 35, 35, 10];
        mddPct = 26.4;
        labelTH = 'แผนนี้เน้นผลตอบแทนสูง มุ่งเน้นหุ้นไทยและหุ้นเทคโนโลยี';
        labelEN = 'High growth strategy with significant equity exposure.';
    } else {
        planName = 'Aggressive Opportunistic Plan (เติบโตสูงสุด)';
        weights = [10, 30, 50, 10];
        mddPct = 34.2;
        labelTH = 'แผนลุยลงทุน มุ่งเน้นสินทรัพย์เติบโตสูง รับความผันผวนได้มาก';
        labelEN = 'Aggressive strategy aiming for maximum return.';
    }

    // Update Text UI
    document.getElementById('recBadge').innerText = planName;
    document.getElementById('recTitle').innerText = planName;
    document.getElementById('recDesc').innerText = currentLang === 'th' ? labelTH : labelEN;

    // Update Max Drawdown Alert (Step 6 Requirement)
    const minCapital = Math.round(100000 * (1 - mddPct / 100));
    document.getElementById('mddPct').innerText = `${mddPct.toFixed(2)}%`;
    document.getElementById('mddVal').innerText = minCapital.toLocaleString();

    // Update Donut Chart
    updateDonutChart(weights);
}

// Initialize Charts
function initCharts() {
    // 1. Asset Allocation Donut Chart
    const ctxDonut = document.getElementById('allocationDonutChart').getContext('2d');
    donutChart = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['TBOND', 'SET', 'US TECH', 'GOLD'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#3b82f6', '#22c55e', '#a855f7', '#eab308']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 2. Model Accuracy Bar Chart
    const ctxBar = document.getElementById('modelBarChart').getContext('2d');
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Baseline Model', 'Logistic Regression', 'Random Forest'],
            datasets: [{
                label: 'Accuracy (%)',
                data: [52.0, 84.5, 91.2],
                backgroundColor: ['#94a3b8', '#3b82f6', '#22c55e']
            }]
        },
        options: {
            responsive: true,
            scales: { y: { min: 0, max: 100 } }
        }
    });

    // 3. Tab 2: K-Means Scatter Chart
    const ctxScatter = document.getElementById('clusterScatterChart').getContext('2d');
    scatterChart = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [
                { label: 'Cluster 0 (Elders)', data: [{x: 62, y: 1.5}, {x: 68, y: 1.8}, {x: 58, y: 2.1}], backgroundColor: '#a855f7' },
                { label: 'Cluster 1 (Moderate)', data: [{x: 42, y: 2.5}, {x: 48, y: 2.8}, {x: 39, y: 3.1}], backgroundColor: '#3b82f6' },
                { label: 'Cluster 2 (Aggressive)', data: [{x: 24, y: 3.8}, {x: 28, y: 4.0}, {x: 22, y: 3.6}], backgroundColor: '#22c55e' },
                { label: 'Cluster 3 (Opportunistic)', data: [{x: 34, y: 3.0}, {x: 38, y: 3.5}, {x: 30, y: 3.2}], backgroundColor: '#f59e0b' }
            ]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Age (อายุ)' } },
                y: { title: { display: true, text: 'Risk Score (สเกลความเสี่ยง 1-4)' } }
            }
        }
    });

    // 4. Tab 3: Line Chart Growth Simulation
    const ctxLine = document.getElementById('growthLineChart').getContext('2d');
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
            datasets: [{
                label: 'Portfolio Value (THB)',
                data: [100000, 101200, 100800, 103400, 102900, 105600, 107100, 106500, 109200, 110500, 111800, 112450],
                borderColor: '#2563eb',
                fill: false,
                tension: 0.2
            }]
        },
        options: { responsive: true }
    });
}

function updateDonutChart(weights) {
    if (donutChart) {
        donutChart.data.datasets[0].data = weights;
        donutChart.update();
    }
}

// Tab 3: Portfolio Simulator Logic
function updatePortfolioSim() {
    const tbond = parseInt(document.getElementById('slideTbond').value);
    const set = parseInt(document.getElementById('slideSet').value);
    const tech = parseInt(document.getElementById('slideTech').value);
    const gold = parseInt(document.getElementById('slideGold').value);

    document.getElementById('valTbond').innerText = `${tbond}%`;
    document.getElementById('valSet').innerText = `${set}%`;
    document.getElementById('valTech').innerText = `${tech}%`;
    document.getElementById('valGold').innerText = `${gold}%`;

    const total = tbond + set + tech + gold;
    const box = document.getElementById('totalWeightBox');
    const valText = document.getElementById('totalWeightVal');
    const statusText = document.getElementById('weightStatusText');

    valText.innerText = `${total}%`;

    // Validate 100% total allocation (check_plan logic)
    if (total === 100) {
        box.className = 'weight-status status-ok margin-top';
        statusText.innerText = '(ถูกต้องพร้อมคำนวณ)';

        // Recalculate Mock Financial Metrics (metrics.py)
        const totalRet = (tbond * 0.03 + set * 0.08 + tech * 0.15 + gold * 0.05).toFixed(2);
        const annRet = (totalRet * 0.95).toFixed(2);
        const maxDd = (tbond * -0.02 + set * -0.18 + tech * -0.28 + gold * -0.10).toFixed(2);
        const sharpe = (annRet / Math.abs(maxDd * 0.5)).toFixed(2);

        document.getElementById('mTotalReturn').innerText = `+${totalRet}%`;
        document.getElementById('mAnnualReturn').innerText = `+${annRet}%`;
        document.getElementById('mMaxDrawdown').innerText = `${maxDd}%`;
        document.getElementById('mSharpe').innerText = sharpe;

    } else {
        box.className = 'weight-status status-err margin-top';
        statusText.innerText = `⚠️ ข้อผิดพลาด: สัดส่วนรวมต้องได้ 100% (ปัจจุบัน ${total}%)`;
    }
}
