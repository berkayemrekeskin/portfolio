// Skill Visualization using Chart.js
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Chart.js to load
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet');
        return;
    }

    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;

    // Skill data
    const skillData = {
        labels: ['Python', 'JavaScript', 'C#', 'Unity', 'React', 'Node.js', 'Machine Learning', 'Web Development'],
        datasets: [{
            label: 'Proficiency',
            data: [85, 80, 75, 70, 75, 70, 65, 85],
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            borderColor: 'rgba(124, 58, 237, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(124, 58, 237, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    const config = {
        type: 'radar',
        data: skillData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        backdropColor: 'transparent',
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(124, 58, 237, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: 'Inter, sans-serif',
                            weight: '600'
                        },
                        color: '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(124, 58, 237, 0.9)',
                    titleFont: {
                        size: 14,
                        family: 'Inter, sans-serif'
                    },
                    bodyFont: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };

    // Create chart with intersection observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const chart = new Chart(ctx, config);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ctx);
});

// Animated Statistics Counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Observe stats and animate when visible
document.addEventListener('DOMContentLoaded', () => {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
});
