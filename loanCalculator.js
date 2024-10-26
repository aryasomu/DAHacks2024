const fetch = require('node-fetch'); // For making HTTP requests
const WolframAlphaAPI = require('@wolfram-alpha/wolfram-alpha-api');
const readline = require('readline'); // Import readline for user input

const appId = 'TVQGRP-8JQWAT5486'; // Replace with your Wolfram Alpha API key

// Set up Wolfram Alpha API
const waApi = WolframAlphaAPI(appId);

// Function to calculate monthly payment using the loan amortization formula
function calculateMonthlyPayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12; // Monthly interest rate
    const numberOfPayments = years * 12; // Total number of payments

    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

    const monthlyPayment = principal * (numerator / denominator);
    return monthlyPayment;
}

// Function to generate amortization schedule
function generateAmortizationSchedule(principal, annualRate, years) {
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= years * 12; month++) {
        const interest = balance * monthlyRate;
        const principalPayment = monthlyPayment - interest;
        balance -= principalPayment;

        // Push the details for this month to the schedule
        schedule.push({
            month: month,
            payment: monthlyPayment.toFixed(2),
            principalPayment: principalPayment.toFixed(2),
            interestPayment: interest.toFixed(2),
            remainingBalance: balance < 0 ? 0 : balance.toFixed(2), // Avoid negative balance
        });
    }

    return schedule;
}

// Create an interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt for user input
rl.question('Enter the principal amount: ', (principal) => {
    rl.question('Enter the annual interest rate (in %): ', (annualRate) => {
        rl.question('Enter the number of years: ', (years) => {
            const p = parseFloat(principal);
            const r = parseFloat(annualRate);
            const y = parseInt(years);

            // Calculate and display the monthly payment
            const monthlyPayment = calculateMonthlyPayment(p, r, y);
            console.log(`Monthly Payment: $${monthlyPayment.toFixed(2)}`);

            // Generate and display the amortization schedule
            const amortizationSchedule = generateAmortizationSchedule(p, r, y);
            console.log("\nAmortization Schedule:");
            console.log("Month | Payment | Principal | Interest | Remaining Balance");
            console.log("----------------------------------------------------------");
            amortizationSchedule.forEach((entry) => {
                console.log(`${entry.month.toString().padEnd(5)} | ${entry.payment.padStart(8)} | ${entry.principalPayment.padStart(10)} | ${entry.interestPayment.padStart(8)} | ${entry.remainingBalance.padStart(18)}`);
            });

            rl.close(); // Close the readline interface
        });
    });
});
