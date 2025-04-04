// Initialize state
let goals = {
    weeklyCalories: 0,
    weeklyWorkouts: 0
};

let workouts = [];

// Load saved data
document.addEventListener('DOMContentLoaded', () => {
    const savedWorkouts = localStorage.getItem('workouts');
    const savedGoals = localStorage.getItem('goals');
    if (savedWorkouts) workouts = JSON.parse(savedWorkouts);
    if (savedGoals) goals = JSON.parse(savedGoals);
    updateSummary();
    displayWorkoutHistory();
});

// Handle goal form submission
document.getElementById('goalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    goals = {
        weeklyCalories: parseInt(document.getElementById('weeklyCalorieGoal').value),
        weeklyWorkouts: parseInt(document.getElementById('weeklyWorkoutGoal').value)
    };
    localStorage.setItem('goals', JSON.stringify(goals));
    updateSummary();
});

// Handle workout form submission
document.getElementById('workoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const workout = {
        date: document.getElementById('workoutDate').value,
        type: document.getElementById('workoutType').value,
        duration: parseInt(document.getElementById('duration').value),
        calories: parseInt(document.getElementById('caloriesBurned').value)
    };
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    updateSummary();
    displayWorkoutHistory();
    e.target.reset();
});

function updateSummary() {
    const weekWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const today = new Date();
        return workoutDate >= new Date(today - 7 * 24 * 60 * 60 * 1000);
    });

    const totalWorkouts = weekWorkouts.length;
    const totalCalories = weekWorkouts.reduce((sum, w) => sum + w.calories, 0);

    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalCalories').textContent = totalCalories;

    // Update progress bars
    const calorieProgress = goals.weeklyCalories ? (totalCalories / goals.weeklyCalories) * 100 : 0;
    const workoutProgress = goals.weeklyWorkouts ? (totalWorkouts / goals.weeklyWorkouts) * 100 : 0;

    document.getElementById('calorieProgress').style.width = `${Math.min(calorieProgress, 100)}%`;
    document.getElementById('workoutProgress').style.width = `${Math.min(workoutProgress, 100)}%`;
}

function displayWorkoutHistory() {
    const historyDiv = document.getElementById('workoutHistory');
    historyDiv.innerHTML = workouts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(workout => `
            <div class="workout-entry">
                <p>Date: ${workout.date}</p>
                <p>Type: ${workout.type}</p>
                <p>Duration: ${workout.duration} minutes</p>
                <p>Calories: ${workout.calories}</p>
            </div>
        `).join('');
}