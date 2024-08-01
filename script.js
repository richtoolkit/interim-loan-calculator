function calculateLoan() {
    const totalAmount = parseFloat(document.getElementById('totalAmount').value.replace(/,/g, ''));
    const installmentAmount = parseFloat(document.getElementById('installmentAmount').value.replace(/,/g, ''));
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const repaymentDate = new Date(document.getElementById('repaymentDate').value);

    const tableBody = document.getElementById('loanTableBody');
    tableBody.innerHTML = '';

    let totalInstallment = 0;
    let totalInterest = 0;
    let totalSavings = 0;

    const installmentDates = [
        '2024-11-15', '2025-05-15', '2025-11-15',
        '2026-05-15', '2026-11-15', '2027-05-15'
    ];

    installmentDates.forEach((date, index) => {
        const row = tableBody.insertRow();
        const installmentDate = new Date(date);
        const daysUntilRepayment = Math.ceil((repaymentDate - installmentDate) / (1000 * 60 * 60 * 24));
        let interest = installmentAmount * interestRate * (daysUntilRepayment / 365);
        if (isNaN(interest)) interest = 0;

        totalInstallment += installmentAmount;

        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = isNaN(installmentAmount) ? '0원' : installmentAmount.toLocaleString() + '원';
        row.insertCell(2).innerHTML = `<input type="date" value="${date}" onchange="updateDays(this)">`;
        row.insertCell(3).textContent = daysUntilRepayment ? daysUntilRepayment : '';
        row.insertCell(4).textContent = isNaN(interest) ? '0원' : interest.toLocaleString(undefined, {maximumFractionDigits: 0}) + "원";
        
        const loanStatusCell = row.insertCell(5);
        loanStatusCell.innerHTML = `<span class="loan-status O" onclick="toggleLoanStatus(this)">O</span>`;

        totalInterest += interest;
    });

    updateSummary(totalInstallment, totalInterest, totalSavings);
}

function updateDays(input) {
    const repaymentDate = new Date(document.getElementById('repaymentDate').value);
    const installmentDate = new Date(input.value);
    const row = input.parentElement.parentElement;
    const daysUntilRepayment = Math.ceil((repaymentDate - installmentDate) / (1000 * 60 * 60 * 24));

    row.cells[3].textContent = daysUntilRepayment ? daysUntilRepayment : '';
    updateInterest(row);
}

function toggleLoanStatus(element) {
    const row = element.parentElement.parentElement;
    if (element.textContent === 'O') {
        element.textContent = 'X';
        element.classList.remove('O');
        element.classList.add('X');
        row.cells[4].classList.add('no-loan');
    } else {
        element.textContent = 'O';
        element.classList.remove('X');
        element.classList.add('O');
        row.cells[4].classList.remove('no-loan');
    }
    updateInterest(row);
}

function updateInterest(row) {
    const installmentAmount = parseFloat(document.getElementById('installmentAmount').value.replace(/,/g, ''));
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const repaymentDate = new Date(document.getElementById('repaymentDate').value);
    const installmentDate = new Date(row.cells[2].querySelector('input').value);
    const daysUntilRepayment = Math.ceil((repaymentDate - installmentDate) / (1000 * 60 * 60 * 24));
    let interest = installmentAmount * interestRate * (daysUntilRepayment / 365);

    if (isNaN(interest)) interest = 0;
    if (row.cells[5].querySelector('.loan-status').textContent === 'X') {
        interest = 0;
    }

    row.cells[4].textContent = interest ? interest.toLocaleString(undefined, {maximumFractionDigits: 0}) + "원" : '0원';
    updateSummary();
}

function updateSummary() {
    let totalInstallment = 0;
    let totalInterest = 0;
    let totalSavings = 0;
    const rows = document.getElementById('loanTableBody').rows;

    for (let i = 0; i < rows.length; i++) {
        const installment = parseFloat(rows[i].cells[1].textContent.replace(/,/g, '').replace('원', ''));
        const interest = parseFloat(rows[i].cells[4].textContent.replace(/,/g, '').replace('원', ''));
        const loanStatus = rows[i].cells[5].querySelector('.loan-status').textContent;

        totalInstallment += isNaN(installment) ? 0 : installment;

        if (loanStatus === 'O') {
            totalInterest += isNaN(interest) ? 0 : interest;
        } else {
            totalSavings += originalInterest(installment, parseFloat(document.getElementById('interestRate').value) / 100, parseInt(rows[i].cells[3].textContent));
        }
    }

    document.getElementById('totalInstallment').textContent = totalInstallment ? totalInstallment.toLocaleString() + "원" : '0원';
    document.getElementById('totalInterest').textContent = totalInterest ? totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0}) + "원" : '0원';
    document.getElementById('interestSavings').textContent = totalSavings ? totalSavings.toLocaleString(undefined, {maximumFractionDigits: 0}) + "원" : '0원';
}

function originalInterest(amount, rate, days) {
    return amount * rate * (days / 365);
}

function formatCurrency(input) {
    let value = input.value.replace(/,/g, '');
    value = parseInt(value, 10);
    if (!isNaN(value)) {
        input.value = value.toLocaleString();
    } else {
        input.value = '';
    }
}

window.onload = () => {
    document.getElementById('totalInstallment').textContent = '0원';
    document.getElementById('totalInterest').textContent = '0원';
    document.getElementById('interestSavings').textContent = '0원';
    calculateLoan();
};