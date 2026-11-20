
function startProject() {
    alert("Welcome to Smart Electricity Analyzer!");
    document.querySelector(".welcome").style.display = "none";
}

function showHistory() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    let display = document.getElementById("billHistory");

    display.innerHTML = "";

    if (history.length === 0) {
        display.innerText = "No History Available";
    } else {
        history.forEach(function(item) {
            let record = document.createElement("p");
            record.innerText =
                item.month + " - " + item.units +
                " Units - ₹" + item.bill;
            display.appendChild(record);
        });
    }

    showComparison();
    showMonthlyReport();
}

function calculateUnits() {
    let previous = Number(document.getElementById("previous").value);
    let current = Number(document.getElementById("current").value);
    let month = document.getElementById("billingMonth").value;

    if (!month || current <= previous || previous < 0) {
        alert("Please enter valid readings and billing month!");
        return;
    }

    let units = current - previous;
    let bill = 0;

    if (units <= 100) {
        bill = 0;
    } else if (units <= 200) {
        bill = (units - 100) * 2.35;
    } else if (units <= 400) {
        bill = 100 * 2.35 + (units - 200) * 4.70;
    } else {
        bill = 100 * 2.35 + 200 * 4.70 + (units - 400) * 6.30;
    }

    bill = bill.toFixed(2);

    document.getElementById("result").innerText =
    "Units Consumed: " + units +
    " Units | Estimated Bill: ₹" + bill;

if (units > 300) {
    alert("Warning! Your electricity consumption is high!");
}

    let history = JSON.parse(localStorage.getItem("billHistory")) || [];

    history.push({
        month: month,
        units: units,
        bill: bill
    });

    localStorage.setItem("billHistory", JSON.stringify(history));

    showHistory();
    drawGraph();
}

function showComparison() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    let result = document.getElementById("comparisonResult");

    if (history.length < 2) {
        result.innerText = "Add at least 2 monthly bills to compare.";
        return;
    }

    let previous = history[history.length - 2];
    let current = history[history.length - 1];

    let difference = current.units - previous.units;

    let status = "";

    if (difference > 0) {
        status = "Consumption Increased";
    } else if (difference < 0) {
        status = "Consumption Decreased";
    } else {
        status = "Consumption Unchanged";
    }

    result.innerText =
        previous.month + ": " + previous.units + " Units\n" +
        current.month + ": " + current.units + " Units\n" +
        "Difference: " + difference + " Units\n" +
        status;
    
}
function showMonthlyReport() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    let report = document.getElementById("monthlyReport");

    if (history.length === 0) {
        report.innerText = "No Report Available";
        return;
    }

    let totalUnits = 0;
    let totalBill = 0;

    history.forEach(function(item) {
        totalUnits += Number(item.units);
        totalBill += Number(item.bill);
    });

    report.innerText =
        "Total Months: " + history.length + "\n" +
        "Total Units: " + totalUnits + " Units\n" +
        "Total Estimated Bill: ₹" + totalBill.toFixed(2);
}
function drawGraph() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    let canvas = document.getElementById("consumptionChart");

    if (history.length === 0) return;

    let ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let maxUnits = Math.max(...history.map(item => item.units), 100);

    history.forEach(function(item, index) {
        let barWidth = 40;
        let gap = 25;
        let barHeight = (item.units / maxUnits) * 200;
        let x = 50 + index * (barWidth + gap);
        let y = 240 - barHeight;

        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = "black";
        ctx.fillText(item.month, x - 5, 260);
        ctx.fillText(item.units, x + 10, y - 5);
    });
}
function exportCSV() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];

    if (history.length === 0) {
        alert("No History Available!");
        return;
    }

    let csv = "Month,Units,Bill\n";

    history.forEach(function(item) {
        csv += item.month + "," + item.units + "," + item.bill + "\n";
    });

    let blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Electricity_Bill_Report.csv";
    link.click();

    URL.revokeObjectURL(link.href);
}

window.onload = function() {
    showHistory();
    drawGraph();
};
